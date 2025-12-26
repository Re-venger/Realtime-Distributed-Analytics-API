import { Request, Response, NextFunction } from "express";
import { pool } from "../config/database";

export async function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || typeof apiKey !== "string") {
      return res.status(401).json({ message: "API Key missing" });
    }

    const result = await pool.query(
      "SELECT * FROM api_keys WHERE key=$1 AND active=true",
      [apiKey]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ message: "Invalid API Key" });
    }

    // Attach for future use
    (req as any).apiKeyOwner = result.rows[0].owner;

    next();
  } catch (err) {
    console.error("API key auth failed", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
