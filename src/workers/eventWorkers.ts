import { Worker } from "bullmq";
import { EventService } from "../services/eventService";

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

eventWorker.on("completed", (job) => {
  console.log(`🎯 Job ${job.id} completed`);
});

eventWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed`, err);
});
