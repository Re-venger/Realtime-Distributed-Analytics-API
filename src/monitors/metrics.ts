import client from "prom-client";

export const register = new client.Registry();

register.setDefaultLabels({
  app: "analytics-api"
});

client.collectDefaultMetrics({ register });

// HTTP Request counter
export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total API Requests",
  labelNames: ["method", "route", "status"]
});

register.registerMetric(httpRequestsTotal);

// Event ingestion counter
export const eventsIngested = new client.Counter({
  name: "events_ingested_total",
  help: "Total events processed"
});

register.registerMetric(eventsIngested);
