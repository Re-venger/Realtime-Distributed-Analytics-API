CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    user_id VARCHAR(100),
    session_id VARCHAR(100),
    page_url TEXT,
    metadata JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);
