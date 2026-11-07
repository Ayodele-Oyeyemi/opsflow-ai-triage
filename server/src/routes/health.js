import { Router } from "express";

const router = Router();

/**
 * GET /api/health
 * Basic health check endpoint.
 */
router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "opsflow-ai-triage",
    version: "1.0.0",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

export default router;
