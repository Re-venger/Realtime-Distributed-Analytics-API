import { Queue } from "bullmq";
import {redis} from "../config/redis";

export const eventQueue = new Queue("events", {
  connection: {
    host: "127.0.0.1",
    port: 6379
  },
});