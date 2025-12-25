import { pool } from "../config/database";
import { CreateEventDTO, Event } from "../types/events";

export const EventService = {
  async saveEvent(data: CreateEventDTO): Promise<Event> {
    const query = `
      INSERT INTO events(event_type, user_id, session_id, page_url, metadata)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      data.event_type,
      data.user_id || null,
      data.session_id || null,
      data.page_url || null,
      data.metadata ? JSON.stringify(data.metadata) : null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },
};
