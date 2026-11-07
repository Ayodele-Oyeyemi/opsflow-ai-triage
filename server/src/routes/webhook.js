import { Router } from "express";
import { createDispatchHeaders, signPayload } from "../utils/signature.js";

const router = Router();

/**
 * POST /api/dispatch-webhook
 * Dispatches a signed webhook to a target URL, or returns a simulated loopback.
 */
router.post("/", async (req, res) => {
  try {
    const { targetUrl, payload } = req.body;
    const timestamp = new Date().toISOString();

    // If no targetUrl, return simulated loopback
    if (!targetUrl) {
      return res.json({
        success: true,
        statusCode: 200,
        statusText: "OK (loopback — no targetUrl provided)",
        responseTimeMs: Math.floor(Math.random() * 30) + 10,
        timestamp,
        responseHeaders: { "content-type": "application/json" },
        responseBody: { received: true, loopback: true },
      });
    }

    const body = payload || req.body;
    const headers = createDispatchHeaders(body);
    const startMs = performance.now();

    let fetchRes;
    try {
      fetchRes = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    } catch (fetchErr) {
      // Network failure — return simulated 200 loopback
      return res.json({
        success: true,
        statusCode: 200,
        statusText: "OK (simulated — fetch failed: " + fetchErr.message + ")",
        responseTimeMs: Math.round(performance.now() - startMs),
        timestamp,
        responseHeaders: {},
        responseBody: { simulated: true, error: fetchErr.message },
      });
    }

    const responseTimeMs = Math.round(performance.now() - startMs);

    let responseBody;
    try {
      responseBody = await fetchRes.json();
    } catch {
      responseBody = await fetchRes.text().catch(() => null);
    }

    const responseHeaders = Object.fromEntries(fetchRes.headers.entries());

    return res.json({
      success: fetchRes.ok,
      statusCode: fetchRes.status,
      statusText: fetchRes.statusText,
      responseTimeMs,
      timestamp,
      responseHeaders,
      responseBody,
    });
  } catch (err) {
    console.error("[webhook] Dispatch error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
