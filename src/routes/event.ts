import { Router } from "express";
import { createEvent } from "../controllers/events_controller";


const eventsRouter = Router();

// Sample event route
eventsRouter.post("/events", createEvent);

export default eventsRouter;