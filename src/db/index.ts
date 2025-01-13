import { config } from "dotenv";
config({ path: ".env.local" }); // or .env.local
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(process.env.POSTGRES_URL!, { prepare: false });
export const db = drizzle({ client });
