import dotenv from "dotenv";
dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`❌ Missing required env: ${name}`);
    process.exit(1);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,

  databaseUrl: required("DATABASE_URL"),
  redisUrl: required("REDIS_URL"),

  apiKeySecret: required("API_KEY_SECRET"),
  queueConcurrency: Number(process.env.QUEUE_CONCURRENCY || 5),
};
