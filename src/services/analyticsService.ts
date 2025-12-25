import { pool } from "../config/database";
import redis from "../config/redis";


export const AnalyticsService = {
  async summary() {
    const cacheKey = "analytics:summary";

    // 1️⃣ Try Redis cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return {
        cached: true,
        summary: JSON.parse(cached)
      };
    }

    // 2️⃣ Query DB if cache miss
    const totalEventsQuery = await pool.query(`SELECT COUNT(*) FROM events`);

    //  by last 24 hours
    const last24Query = await pool.query(`
      SELECT COUNT(*) FROM events
      WHERE timestamp > NOW() - INTERVAL '24 HOURS'
    `);

    // by event type
    const typeQuery = await pool.query(`
      SELECT event_type, COUNT(*) 
      FROM events
      GROUP BY event_type
    `);

    const summary = {
      total_events: Number(totalEventsQuery.rows[0].count),
      last_24_hours: Number(last24Query.rows[0].count),
      by_type: typeQuery.rows
    };

    // 3️⃣ Store result in Redis (TTL = 30 seconds)
    await redis.set(cacheKey, JSON.stringify(summary), {
      EX: 30
    });

    return { cached: false, summary };
  }
};