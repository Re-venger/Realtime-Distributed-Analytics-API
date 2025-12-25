import { Request, Response } from "express";
import { AnalyticsService } from "../services/analyticsService";

export async function getSummaryAnalytics(req: Request, res: Response) {
  try {
    const data = await AnalyticsService.summary();
    return res.json({
      cached: data.cached,
      summary: data.summary,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
