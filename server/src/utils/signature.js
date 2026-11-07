import crypto from "node:crypto";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "opsflow-default-secret";

/**
 * Compute HMAC-SHA256 hex digest of a JSON payload.
 * @param {object} payload
 * @returns {string} hex signature
 */
export function signPayload(payload) {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  return crypto.createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex");
}

/**
 * Build dispatch headers including signature and timestamp.
 * @param {object} payload
 * @returns {{ "Content-Type": string, "X-OpsFlow-Signature": string, "X-OpsFlow-Timestamp": string }}
 */
export function createDispatchHeaders(payload) {
  return {
    "Content-Type": "application/json",
    "X-OpsFlow-Signature": signPayload(payload),
    "X-OpsFlow-Timestamp": new Date().toISOString(),
  };
}
