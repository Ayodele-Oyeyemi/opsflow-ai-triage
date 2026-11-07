import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";

// Flash pricing per 1 M tokens
const INPUT_COST_PER_M = 0.15;
const OUTPUT_COST_PER_M = 0.60;
const MODEL = "gemini-2.5-flash";

let _client = null;

function getClient() {
  if (!_client) {
    _client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _client;
}

/**
 * Build the system instruction for document triage extraction.
 */
function buildSystemInstruction() {
  return `You are an expert document triage AI for OpsFlow. Your job is to extract structured data from business documents, forms, invoices, and correspondence.

For every document, extract the following fields and assign each a confidence score (0-100) with a brief reasoning string:
- customer_name: The primary person or company name
- contact_info: Phone, email, or address
- category: The document category (e.g. "Healthcare / Dental Intake", "Shipping / Customs Clearing")
- urgency_level: "high", "medium", or "low"
- summary: A 1-3 sentence summary of the document content
- line_items: An array of items with item name, qty, optional unit, optional cbm, and amount
- total_amount: The total monetary amount as a formatted string

Also provide:
- overallConfidence: A weighted average confidence (0-100)
- autoApproved: true if overallConfidence >= 90, else false
- urgencyLevel: the urgency level string

Be precise. If text is partially illegible or ambiguous, lower the confidence and explain why in the reasoning.`;
}

/**
 * Build the JSON response schema for structured output.
 */
function buildResponseSchema() {
  return {
    type: "object",
    properties: {
      overallConfidence: { type: "number", description: "Weighted average confidence 0-100" },
      autoApproved: { type: "boolean", description: "true if overallConfidence >= 90" },
      urgencyLevel: { type: "string", enum: ["high", "medium", "low"] },
      fields: {
        type: "array",
        items: {
          type: "object",
          properties: {
            key: { type: "string" },
            label: { type: "string" },
            value: { type: "string", description: "Extracted value — for arrays, use JSON-encoded string" },
            confidence: { type: "number" },
            reasoning: { type: "string" },
          },
          required: ["key", "label", "value", "confidence", "reasoning"],
        },
      },
    },
    required: ["overallConfidence", "autoApproved", "urgencyLevel", "fields"],
  };
}

/**
 * Determine MIME type from file extension.
 */
function mimeFromPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
    ".txt": "text/plain",
  };
  return map[ext] || "application/octet-stream";
}

/**
 * Run Gemini extraction on text and/or file input.
 * @param {{ text?: string, filePath?: string }} input
 * @returns {Promise<object>} triage response
 */
export async function extractWithGemini({ text, filePath }) {
  const client = getClient();
  const startMs = performance.now();

  // Build input parts
  const inputParts = [];

  if (text) {
    inputParts.push({ text: `Extract triage data from the following document:\n\n${text}` });
  }

  if (filePath && fs.existsSync(filePath)) {
    const mime = mimeFromPath(filePath);

    if (mime === "text/plain") {
      const content = fs.readFileSync(filePath, "utf-8");
      inputParts.push({
        text: `[Attached text file content]:\n${content}`,
      });
    } else {
      const data = fs.readFileSync(filePath).toString("base64");
      inputParts.push({
        inlineData: { data, mimeType: mime },
      });
    }
  }

  if (inputParts.length === 0) {
    throw new Error("No input provided — supply text or a file.");
  }

  // Build the request input
  const input = inputParts.length === 1 && inputParts[0].text
    ? inputParts[0].text
    : inputParts;

  // Call Gemini Interactions API with structured output
  const response = await client.interactions.create({
    model: MODEL,
    system_instruction: buildSystemInstruction(),
    input,
    response_format: buildResponseSchema(),
    store: false,
  });

  const latencyMs = Math.round(performance.now() - startMs);

  // Parse structured output
  let triage;
  try {
    const raw = response.output_text;
    triage = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    throw new Error("Failed to parse Gemini structured output");
  }

  // Parse line_items field value from JSON string if needed
  if (triage.fields) {
    for (const field of triage.fields) {
      if (field.key === "line_items" && typeof field.value === "string") {
        try {
          field.value = JSON.parse(field.value);
        } catch {
          // leave as string
        }
      }
    }
  }

  // Estimate token usage from the response if available
  const usage = response.usage_metadata || response.usage || {};
  const inputTokens = usage.prompt_token_count || usage.input_tokens || 0;
  const outputTokens = usage.candidates_token_count || usage.output_tokens || 0;

  return {
    success: true,
    mode: "gemini",
    latencyMs,
    tokenUsage: {
      input: inputTokens,
      output: outputTokens,
      estimatedCost: parseFloat(
        ((inputTokens * INPUT_COST_PER_M) / 1e6 +
          (outputTokens * OUTPUT_COST_PER_M) / 1e6
        ).toFixed(6)
      ),
    },
    triage,
  };
}
