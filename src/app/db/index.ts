import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
// Correct the import path here
import * as dotenv from "dotenv";
import * as schema from "./schema";

// Load environment variables from your .env file
dotenv.config();


if (!process.env.DATABASE_URL) {
  throw new Error("🔴 DATABASE_URL is not set in the .env file");
}


export const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function connectDb() {
    await client.connect();
}

connectDb();


export const db = drizzle(client, { schema });