import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";


import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import categoryRoutes from "./modules/categories/categories.routes.js";
import productRoutes from "./modules/products/products.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import ordersRoutes from "./modules/orders/orders.routes.js";
import paymentsRoutes from "./modules/payments/payments.routes.js";
import shippingRoutes from "./modules/shipping/shipping.routes.js";
import returnsRoutes from "./modules/returns/returns.routes.js";
import prescriptionsRoutes from "./modules/prescriptions/prescriptions.routes.js";
import notificationsRoutes from "./modules/notifications/notifications.routes.js";

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, SSR server fetches)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      // Add your production domain here e.g. "https://furnest.com"
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: Origin '${origin}' is not allowed`));
  },
  credentials: true,   // Required for httpOnly cookie (refresh token)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
};

// ⚠️ CORS must come BEFORE helmet so its headers aren't overwritten
app.use(cors(corsOptions));

// Handle OPTIONS preflight for ALL routes (Express 5 requires named wildcard)
app.options(/\/.*/, cors(corsOptions));

// Helmet — configured to allow cross-origin resource sharing
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow cross-origin fetches
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: false, // CSP is handled by Next.js next.config.js headers
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(cookieParser());

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

// Custom NoSQL injection sanitizer (express-mongo-sanitize is incompatible with Express 5)
// Strips keys starting with '$' or containing '.' from req.body, req.params
function sanitizeObj(obj) {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        for (const key of Object.keys(obj)) {
            if (key.startsWith("$") || key.includes(".")) {
                delete obj[key];
            } else {
                sanitizeObj(obj[key]);
            }
        }
    } else if (Array.isArray(obj)) {
        obj.forEach(sanitizeObj);
    }
}

app.use((req, res, next) => {
    sanitizeObj(req.body);
    sanitizeObj(req.params);
    next();
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "E-commerce API is running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/shipping", shippingRoutes);
app.use("/api/v1/returns", returnsRoutes);
app.use("/api/v1/prescriptions", prescriptionsRoutes);
app.use("/api/v1/notifications", notificationsRoutes);

app.use(errorMiddleware);

export default app;
