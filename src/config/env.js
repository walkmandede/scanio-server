import { config } from "dotenv";

// Load .env.development or .env.production based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

config({ path: envFile });

export const { PORT, DATABASE_URL, NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN } =
  process.env;
