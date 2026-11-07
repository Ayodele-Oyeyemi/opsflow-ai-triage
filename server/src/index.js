import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import triageRouter from "./routes/triage.js";
import webhookRouter from "./routes/webhook.js";
import healthRouter from "./routes/health.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ── Ensure uploads directory exists ────────────────────────
const uploadsDir = path.resolve(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Routes ─────────────────────────────────────────────────
app.use("/api/triage", triageRouter);
app.use("/api/dispatch-webhook", webhookRouter);
app.use("/api/health", healthRouter);

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ✦ OpsFlow AI Triage Server`);
  console.log(`  ├─ Port:    ${PORT}`);
  console.log(`  ├─ Gemini:  ${process.env.GEMINI_API_KEY ? "configured ✔" : "not configured (demo mode)"}`);
  console.log(`  └─ Health:  http://localhost:${PORT}/api/health\n`);
});
