import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("📦 Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL Error", err);
});
