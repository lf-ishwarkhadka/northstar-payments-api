import express from "express";
import { requestId } from "./middleware/request-id.js";
import { healthRouter } from "./routes/health.js";
import { paymentsRouter } from "./routes/payments.js";
//testing
export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(requestId);
  app.use(healthRouter());
  app.use(paymentsRouter());
  return app;
}
