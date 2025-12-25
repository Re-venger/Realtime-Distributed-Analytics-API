import {z} from 'zod';

export const EventSchema = z.object({
    event_type: z.string().min(1, "Event type is required"),
    
    user_id: z.string().optional(),
    session_id: z.string().optional(),
    page_url: z.string().optional(),

    metadata: z.any().optional()
})