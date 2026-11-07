import { Router } from "express";
import upload from "../middleware/upload.js";
import { extractWithGemini } from "../services/geminiService.js";
import { getDemoResult, PRESET_IDS } from "../services/demoFallback.js";

const router = Router();

/**
 * POST /api/triage
 * Accepts multipart form data: text, file, presetId
 */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { text, presetId } = req.body;
    const file = req.file;

    // 1. If presetId is provided, always use demo fallback
    if (presetId && PRESET_IDS.includes(presetId)) {
      const result = await getDemoResult(presetId);
      return res.json(result);
    }

    // 2. If text/file provided AND Gemini key exists, use Gemini
    if ((text || file) && process.env.GEMINI_API_KEY) {
      try {
        const result = await extractWithGemini({
          text: text || undefined,
          filePath: file?.path,
        });
        return res.json(result);
      } catch (err) {
        // Gemini failed (rate-limit, network, etc.) — fall through to demo
        console.warn("[triage] Gemini extraction failed, falling back to demo:", err.message);
      }
    }

    // 3. Fallback to demo data with simulated latency
    const result = await getDemoResult("lagos-dental");
    return res.json(result);
  } catch (err) {
    console.error("[triage] Unexpected error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
});

export default router;
