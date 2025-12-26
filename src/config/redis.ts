import { createClient } from "redis";
import { env } from "./env";

const client = createClient({
  url: env.redisUrl,
  socket: {
    reconnectStrategy: retries => {
      if (retries > 10) {
        console.error("❌ Too many Redis reconnect attempts. Giving up.");
        return new Error("Redis reconnect failed");
      }

      const delay = Math.min(retries * 500, 5000);
      console.log(`⚠️ Redis reconnect attempt ${retries}, retrying in ${delay}ms`);
      return delay;
    },
    connectTimeout: 10000
  }
});

let isReady = false;

client.on("connect", () => console.log("⚡ Redis connecting..."));
client.on("ready", () => {
  isReady = true;
  console.log("🟢 Redis Ready");
});
client.on("end", () => {
  isReady = false;
  console.log("🔴 Redis connection closed");
});
client.on("reconnecting", () => console.log("♻️ Redis reconnecting..."));
client.on("error", err => console.error("❌ Redis Error:", err));

export async function initRedis() {
  if (isReady) return client;

  try {
    await client.connect();
    await client.ping();
    console.log("✅ Redis ping OK");
    return client;
  } catch (err) {
    console.error("🚨 Failed to connect to Redis:", err);
    process.exit(1); // fail fast in production
  }
}

export function getRedis() {
  return client;
}

export async function closeRedis() {
  try {
    await client.quit();
    console.log("👋 Redis closed gracefully");
  } catch (err) {
    console.error("❌ Error closing Redis:", err);
  }
}

export default client;
