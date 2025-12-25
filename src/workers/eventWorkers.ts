import { Worker } from "bullmq";
import { EventService } from "../services/eventService";
import { io } from "../server";
import { pool } from "../config/database";
import { eventsIngested } from "../monitors/metrics";

export const eventWorker = new Worker(
  "events",
  async (job) => {
    console.log("Processing event: ", job.id);
    await EventService.saveEvent(job.data);
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

eventWorker.on("completed", async(job) => {
  console.log(`🎯 Job ${job.id} completed`);
  eventsIngested.inc();
  io.emit("event_processed", {
    message: "New Event Recorded",
    event: job.data,
  })

  // Updated analytics
    const total = await pool.query("SELECT COUNT(*) FROM events");
  io.emit("analytics_update", {
    total_events: Number(total.rows[0].count)
  });
});

eventWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed`, err);
});
