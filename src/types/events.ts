export interface CreateEventDTO {
    event_type: string;
    user_id?: string;
    session_id?: string;
    page_url?: string;
    metadata?: Record<string, any>;
}
export interface Event extends CreateEventDTO {
    id: number;
    timestamp: Date;
}