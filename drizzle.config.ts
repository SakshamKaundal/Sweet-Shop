import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error("🔴 DATABASE_URL is not set in the .env file");
}

export default defineConfig({
  schema: "./src/app/db/schema.ts", // IMPORTANT: Make sure this path is correct!
  dialect: "postgresql",       // Your database type
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
