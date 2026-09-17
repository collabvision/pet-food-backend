import fs from "fs";
import path from "path";

const modulesDir = path.join(process.cwd(), "src", "modules");
const mdFile = path.join(process.cwd(), "API_DOCUMENTATION.md");

const modulePaths = fs.readdirSync(modulesDir);
let tableStr = "\n## 📊 Complete Endpoint Reference\n\n| Module | Method | Endpoint | Description |\n|--------|--------|----------|-------------|\n";

modulePaths.forEach(mod => {
  const routeFile = path.join(modulesDir, mod, mod + ".routes.js") || path.join(modulesDir, mod, "routes.js");
  let fileToRead = "";
  if (fs.existsSync(path.join(modulesDir, mod, mod + ".routes.js"))) {
    fileToRead = path.join(modulesDir, mod, mod + ".routes.js");
  } else if (fs.existsSync(path.join(modulesDir, mod, "routes.js"))) {
    fileToRead = path.join(modulesDir, mod, "routes.js");
  } else if (fs.existsSync(path.join(modulesDir, mod, "auth.routes.js"))) {
      // specifically for auth which is in auth/auth.routes.js 
      fileToRead = path.join(modulesDir, mod, "auth.routes.js");
  }
  
  if (fileToRead) {
    const content = fs.readFileSync(fileToRead, "utf8");
    const regex = /router\.(get|post|put|patch|delete)\(\s*['"`](.*?)['"`]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      let route = match[2];
      if (route === "/") route = "";
      const fullRoute = `/api/v1/${mod}${route}`;
      tableStr += `| ${mod} | \`${method}\` | \`${fullRoute}\` | |\n`;
    }
  }
});

fs.appendFileSync(mdFile, tableStr);
console.log("Appended all endpoints to API_DOCUMENTATION.md");
