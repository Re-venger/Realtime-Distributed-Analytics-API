import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import { closeRedis, initRedis } from "./config/redis";

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

async function shutdown() {
  console.log("⚠ Shutting down gracefully...");
  await closeRedis();
  process.exit(0);
}

// custom imports
import eventsRouter from "./routes/event";
import analyticsRoutes from "./routes/analytics";
import "./workers/eventWorkers";
import { httpRequestsTotal, register } from "./monitors/metrics";
import { errorHandler } from "./middleware/errorHandler";


// Initialize express app
const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

// Midddlewares

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);
app.use(errorHandler);
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
  });

  next();
});

// Sample route
app.get("/health", (req, res) => {
  res.send("Server is running smoothly! Health 100%\n");
});

// Import and use event routes
app.use("/api", eventsRouter);
app.use("/analytics", analyticsRoutes);

// Prometheus Metrics endpoint
app.get("/metrics", async (_, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Start server
const startServer = async () => {
  await initRedis();
  server.listen(process.env.PORT || 3000, () => {
    console.log("Server running...");
  });
};

startServer();