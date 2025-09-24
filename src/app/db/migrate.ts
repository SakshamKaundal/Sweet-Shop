
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from ".";
import { client } from ".";

async function main() {
  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("Migrations finished.");
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
