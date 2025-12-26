import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "../config/redis";

const limiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl",
  points: 10000,          // allow 100 requests
  duration: 60          // per 60 seconds
});

export async function rateLimit(req: Request, res: Response, next: NextFunction) {
  try {
    const key = (req.headers["x-api-key"] as string) || req.ip;

    await limiter.consume(key!);
    next();
  } catch {
    return res.status(429).json({
      message: "Too many requests. Please slow down."
    });
  }
}
