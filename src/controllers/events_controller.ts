import { Request, Response } from "express";
import { eventQueue } from "../workers/eventQueue";
import { EventSchema } from "../validations/eventSchema";

export async function createEvent(req: Request, res: Response) {
  try {
    // validation of the event schema
    const parsed = EventSchema.parse(req.body);

    // push to the queue
    await eventQueue.add("new_event", parsed);

    return res.status(201).json({
      message: "Event created successfully and queued for processing",
    });
  } catch (error: any) {
    if (error === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
    console.log("Event Save failed", error as string);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
