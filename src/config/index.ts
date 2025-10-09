import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABAE_URL,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 12,
  paypal_api_url: process.env.PAYPAL_API_URL || "",
  paypal_client_id: process.env.PAYPAL_CLIENT_ID || "",
  paypal_secret: process.env.PAYPAL_SECRET || "",
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  resetlink: process.env.RESET_PASSWORD_UI_LINK,
  email: process.env.SMTP_USER,
  appPass: process.env.SMTP_PASS,

  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
    publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  paypal: {
    client_id: process.env.PAYPAL_CLIENT_ID,
    secret: process.env.PAYPAL_SECRET,
    base_url: process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com",
  },
  frontend_url: process.env.FRONTEND_URL,
};
