# 📊 Real-Time Analytics Platform

A **production-style real-time analytics platform** that collects user events from websites/apps, processes them through a queue system, stores structured analytics in PostgreSQL, caches frequently accessed queries in Redis, and powers a **live dashboard UI** with WebSockets.

Built to simulate how large-scale analytics platforms like Mixpanel, PostHog, or Google Analytics work internally.

---

## 🚀 Features

- **Event Ingestion API**
  - Accepts events like `PAGE_VIEW`, `BUTTON_CLICK`, `SESSION_START`, `PURCHASE`
- **High Performance Backend**
  - Node.js + Express + TypeScript
- **Reliable Storage Layer**
  - PostgreSQL for structured analytics data
- **⚡ Redis Caching**
  - Cache-aside strategy to speed up analytics queries
- **📬 Queue System**
  - Handles burst traffic and async processing
- **📡 Real-time Updates**
  - WebSocket live metrics streaming
- **📈 Analytics Dashboard UI**
  - Charts, metrics, top pages, recent events
- **Docker Ready**
  - Run entire stack with one command
- **Production-like Architecture**
  - Logging, rate limiting, environment handling

---

## 🏗️ Architecture
Client / App / Website
|
v
/api/events ---> Express + TypeScript
|
Queue (Bull / Redis)
|
v
PostgreSQL (Events DB)
|
Analytics Services
|
+--> Redis Cache
|
+--> REST Analytics API
|
+--> WebSocket Live Stream
|
v
React Dashboard UI



---

## 🛠️ Tech Stack

**Backend**
- Node.js  
- Express  
- TypeScript  
- PostgreSQL  
- Redis  
- Queue (Bull / RabbitMQ)  
- WebSockets  

**Frontend**
- React  
- Vite  
- Chart.js  
- TailwindCSS  

**DevOps**
- Docker + Docker Compose  
- Prometheus + Grafana (optional monitoring)

---

## 🧪 API Endpoints

### 📥 Event Ingestion



**Body**
```json
{
  "event_type": "PAGE_VIEW",
  "user_id": "user_101",
  "session_id": "sess_1",
  "page_url": "/pricing",
  "metadata": {
    "device": "mobile",
    "browser": "Chrome"
  }
}


GET /analytics/summary
GET /analytics/top-pages
GET /analytics/timeseries?range=24h
GET /analytics/recent
▶️ Running Locally
Backend
npm install
npm run dev

Dashboard
cd dashboard
npm install
npm run dev


Open browser at:

http://localhost:5173

🐳 Run Entire System with Docker
docker-compose up


This will start:

Backend

PostgreSQL

Redis

Monitoring stack (optional)

🧼 (Optional) Seed Dummy Data

To reset:

TRUNCATE TABLE events RESTART IDENTITY;


Then insert dummy dataset or auto-generate test events.

📸 Screenshots

Add screenshots in repo:

/screenshots/dashboard.png
/screenshots/timeseries.png
/screenshots/top-pages.png

🧠 What I Learned

Designed a scalable backend architecture similar to production analytics platforms

Implemented Redis caching strategies (cache-aside, TTL)

Built queue-based async processing for handling burst traffic

Designed REST analytics APIs and time-series analytics

Implemented real-time WebSocket streaming

Structured backend using modular & layered architecture

Built a complete analytics dashboard UI using React + Chart.js

🚀 Deployment

Planned deployment targets:

Backend: Render / Fly.io / VPS

Frontend: Vercel

Database: Managed PostgreSQL

Redis: Upstash / Render Redis

💡 Possible Enhancements

Authentication + multi-tenant analytics

Public JavaScript SDK (auto tracking)

Custom dashboards per app

Funnel tracking

Alerts & anomaly detection

More event schema analytics
