import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("🔥 Unhandled Error:", err);

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message:
      status === 500
        ? "Internal Server Error"
        : err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err.details
    })
  });
}
