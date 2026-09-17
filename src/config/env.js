import "dotenv/config";

const requiredEnv = ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  mongoUri: process.env.MONGO_URI,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,

    refreshSecret: process.env.JWT_REFRESH_SECRET,

    accessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",

    refreshExpires: process.env.JWT_REFRESH_EXPIRES || "7d",
  },

  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },
};
