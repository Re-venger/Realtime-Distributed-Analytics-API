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
        summary: JSON.parse(cached),
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
      by_type: typeQuery.rows,
    };

    // 3️⃣ Store result in Redis (TTL = 30 seconds)
    await redis.set(cacheKey, JSON.stringify(summary), {
      EX: 30,
    });

    return { cached: false, summary };
  },
  async timeSeries(range: string) {
    const cacheKey = `analytics:timeseries:${range}`;
    const cached = await redis.get(cacheKey);
    if (cached) return { cached: true, result: JSON.parse(cached) };

    let interval = "hour";
    let condition = "NOW() - INTERVAL '24 HOURS'";

    if (range === "7d") {
      interval = "day";
      condition = "NOW() - INTERVAL '7 DAYS'";
    }

    const query = await pool.query(`
    SELECT date_trunc('${interval}', timestamp) AS bucket,
           COUNT(*) AS count
    FROM events
    WHERE timestamp > ${condition}
    GROUP BY bucket
    ORDER BY bucket ASC
  `);

    const result = {
      range,
      interval,
      data: query.rows.map((r) => ({
        time: r.bucket,
        count: Number(r.count),
      })),
    };

    await redis.set(cacheKey, JSON.stringify(result), { EX: 30 });

    return { cached: false, result };
  },
  async topPages() {
    const key = "analytics:top-pages";
    const cached = await redis.get(key);
    if (cached) return { cached: true, pages: JSON.parse(cached) };

    const result = await pool.query(`
    SELECT page_url, COUNT(*) AS count
    FROM events
    WHERE page_url IS NOT NULL
    GROUP BY page_url
    ORDER BY count DESC
    LIMIT 10
  `);

    await redis.set(key, JSON.stringify(result.rows), { EX: 30 });

    return { cached: false, pages: result.rows };
  },
  async recentEvents() {
    const result = await pool.query(`
    SELECT * FROM events
    ORDER BY timestamp DESC
    LIMIT 50
  `);

    return { events: result.rows };
  },
};
