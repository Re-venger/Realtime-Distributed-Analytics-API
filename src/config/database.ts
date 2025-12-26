import {Pool} from 'pg';
import { env } from "./env";


if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

export const pool = new Pool({
    connectionString: env.databaseUrl,
    max: 10
});

pool.on("connect", () => {
  console.log("📦 Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL Error", err);
});
