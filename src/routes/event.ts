import { Router } from "express";
import { createEvent } from "../controllers/events_controller";
import {apiKeyAuth} from '../middleware/apiKeyAuth';
import {rateLimit} from '../middleware/rateLimit';

const eventsRouter = Router();

// Sample event route
eventsRouter.post("/events", apiKeyAuth, rateLimit, createEvent);

export default eventsRouter;