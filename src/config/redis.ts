import {Redis} from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis =  new Redis(redisURL);

redis.on("connect", () => console.log("⚡ Redis Connected"));
redis.on("error", err => console.error("Redis Error", err));