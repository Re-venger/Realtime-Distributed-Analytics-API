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

export async function getTimeSeries(req: Request, res: Response) {
  try {
    const range = (req.query.range as string) || "24h";
    const data = await AnalyticsService.timeSeries(range);

    return res.json({
      cached: data.cached,
      ...data.result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getTopPages(req: Request, res: Response) {
  try {
    const data = await AnalyticsService.topPages();
    return res.json(data);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getRecentEvents(req: Request, res: Response) {
  try {
    const events = await AnalyticsService.recentEvents();
    return res.json(events);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
