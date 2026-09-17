import fs from "fs";
import app from "./src/app.js";
import listEndpoints from "express-list-endpoints";

const endpoints = listEndpoints(app);

const collection = {
  info: {
    name: "PetFood E-Commerce API",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    {
      key: "BASE_URL",
      value: "http://localhost:5000",
      type: "string"
    },
    {
      key: "ACCESS_TOKEN",
      value: "",
      type: "string"
    }
  ],
  item: []
};

// Group endpoints by their base path (e.g., /api/v1/auth)
const groups = {};

endpoints.forEach(ep => {
  const path = ep.path;
  const parts = path.split("/").filter(Boolean);
  
  // Find the group name (e.g. "auth", "products")
  let groupName = "General";
  if (parts.length >= 3 && parts[0] === "api" && parts[1] === "v1") {
    groupName = parts[2];
  }

  if (!groups[groupName]) {
    groups[groupName] = [];
  }

  ep.methods.forEach(method => {
    if (method === "HEAD") return;
    
    // Replace Express params like :id with Postman variables like {{id}}
    const postmanPath = path.replace(/:([^\/]+)/g, "{{$1}}");
    const pathParts = postmanPath.split("/").filter(Boolean);

    const req = {
      name: `${method} ${path}`,
      request: {
        method: method,
        header: [
          {
            key: "Authorization",
            value: "Bearer {{ACCESS_TOKEN}}",
            type: "text"
          }
        ],
        url: {
          raw: `{{BASE_URL}}${postmanPath}`,
          host: ["{{BASE_URL}}"],
          path: pathParts
        }
      },
      response: []
    };

    // Add basic JSON body for POST/PUT/PATCH
    if (["POST", "PUT", "PATCH"].includes(method)) {
      req.request.body = {
        mode: "raw",
        raw: "{\n    \n}",
        options: {
          raw: {
            language: "json"
          }
        }
      };
    }

    groups[groupName].push(req);
  });
});

// Build final item array
for (const [groupName, items] of Object.entries(groups)) {
  collection.item.push({
    name: groupName.charAt(0).toUpperCase() + groupName.slice(1),
    item: items
  });
}

fs.writeFileSync("PetFood_API_Collection.json", JSON.stringify(collection, null, 2));
console.log("Generated PetFood_API_Collection.json with", endpoints.length, "endpoints!");
