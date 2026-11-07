/**
 * Deterministic demo/fallback data for live recruiter demos.
 * Returned when GEMINI_API_KEY is missing, rate-limited, or a presetId is selected.
 */

const PRESETS = {
  "lagos-dental": {
    overallConfidence: 78,
    autoApproved: false,
    urgencyLevel: "high",
    fields: [
      {
        key: "customer_name",
        label: "Customer Name",
        value: "Adebayo Ogunlesi",
        confidence: 72,
        reasoning:
          "Handwritten text, partially illegible — first name clear, surname uncertain",
      },
      {
        key: "contact_info",
        label: "Contact Info",
        value: "+234 812 345 6789",
        confidence: 88,
        reasoning: "Phone number printed clearly on intake form header",
      },
      {
        key: "category",
        label: "Category",
        value: "Healthcare / Dental Intake",
        confidence: 95,
        reasoning:
          "Form header reads 'Lagos Dental Clinic — Patient Intake Form'",
      },
      {
        key: "urgency_level",
        label: "Urgency Level",
        value: "high",
        confidence: 62,
        reasoning:
          "Patient mentions 'severe pain' but handwriting is ambiguous — could be 'several' or 'severe'",
      },
      {
        key: "summary",
        label: "Summary",
        value:
          "Patient intake form for dental emergency. Patient reports severe tooth pain in lower right molar area lasting 3 days. Requests immediate consultation and possible extraction. No known drug allergies noted.",
        confidence: 78,
        reasoning:
          "Synthesised from partially legible handwritten notes across two form sections",
      },
      {
        key: "line_items",
        label: "Line Items",
        value: [
          {
            item: "Emergency dental consultation",
            qty: 1,
            amount: 25000,
          },
        ],
        confidence: 85,
        reasoning:
          "Fee schedule printed on form footer matches standard consultation rate",
      },
      {
        key: "total_amount",
        label: "Total Amount",
        value: "₦25,000",
        confidence: 85,
        reasoning: "Single line item, amount clearly printed",
      },
    ],
  },

  "vi-real-estate": {
    overallConfidence: 96,
    autoApproved: true,
    urgencyLevel: "medium",
    fields: [
      {
        key: "customer_name",
        label: "Customer Name",
        value: "Chief Mrs. Folake Adeyemo-Williams",
        confidence: 98,
        reasoning:
          "Typed letterhead with full title and hyphenated surname, clearly legible",
      },
      {
        key: "contact_info",
        label: "Contact Info",
        value: "folake.aw@luxeproperties.ng",
        confidence: 99,
        reasoning: "Email address in typed correspondence header",
      },
      {
        key: "category",
        label: "Category",
        value: "Real Estate / Luxury Property Inquiry",
        confidence: 96,
        reasoning:
          "Document subject line: 'Expression of Interest — Eko Atlantic Penthouse'",
      },
      {
        key: "urgency_level",
        label: "Urgency Level",
        value: "medium",
        confidence: 94,
        reasoning:
          "Inquiry mentions 'within the next quarter' — no immediate deadline",
      },
      {
        key: "summary",
        label: "Summary",
        value:
          "Corporate buyer inquiry for premium waterfront property in Eko Atlantic City. Interested in a 3-bedroom penthouse with ocean view. Requests property inspection and legal due diligence package. Budget pre-approved by corporate board.",
        confidence: 97,
        reasoning:
          "Well-structured typed letter with clear intent and specifications",
      },
      {
        key: "line_items",
        label: "Line Items",
        value: [
          {
            item: "3-Bed Penthouse, Eko Atlantic City",
            qty: 1,
            amount: 450000000,
          },
          {
            item: "Legal & Survey Fees",
            qty: 1,
            amount: 2500000,
          },
        ],
        confidence: 96,
        reasoning:
          "Amounts referenced in formal inquiry with board-approved budget figures",
      },
      {
        key: "total_amount",
        label: "Total Amount",
        value: "₦452,500,000",
        confidence: 96,
        reasoning: "Sum of property price and legal fees, clearly stated",
      },
    ],
  },

  "apapa-shipping": {
    overallConfidence: 91,
    autoApproved: true,
    urgencyLevel: "high",
    fields: [
      {
        key: "customer_name",
        label: "Customer Name",
        value: "Dragon King Trading Ltd (Guangzhou)",
        confidence: 94,
        reasoning:
          "Company name printed on commercial invoice header with registration number",
      },
      {
        key: "contact_info",
        label: "Contact Info",
        value: "logistics@dragonkingtrading.cn",
        confidence: 91,
        reasoning:
          "Email in invoice footer; phone number partially obscured by stamp",
      },
      {
        key: "category",
        label: "Category",
        value: "Shipping / Customs Clearing",
        confidence: 97,
        reasoning:
          "Document type: Commercial Invoice with HS codes and CBM measurements",
      },
      {
        key: "urgency_level",
        label: "Urgency Level",
        value: "high",
        confidence: 93,
        reasoning:
          "Vessel ETA noted as 5 days; demurrage charges apply after 7 free days",
      },
      {
        key: "summary",
        label: "Summary",
        value:
          "Commercial invoice for 40ft container shipment, Guangzhou to Apapa Port Lagos. Contains ceramic floor tiles and LED panel lights. Includes ocean freight and estimated import duty at 20% CET. Total shipment value USD 34,280 with Naira equivalent at current exchange rate.",
        confidence: 90,
        reasoning:
          "Invoice well-structured but exchange rate is an estimate based on current CBN rate",
      },
      {
        key: "line_items",
        label: "Line Items",
        value: [
          {
            item: "Ceramic Floor Tiles (HS 6908.90)",
            qty: 1200,
            unit: "cartons",
            cbm: 28.5,
            amount: 18400,
          },
          {
            item: "LED Panel Lights (HS 9405.42)",
            qty: 500,
            unit: "pcs",
            cbm: 6.2,
            amount: 7500,
          },
          {
            item: "Ocean Freight (Guangzhou-Apapa)",
            qty: 1,
            amount: 3200,
          },
          {
            item: "Import Duty Estimate (20% CET)",
            qty: 1,
            amount: 5180,
          },
        ],
        confidence: 88,
        reasoning:
          "Line items clearly printed; duty is an estimate pending final customs assessment",
      },
      {
        key: "total_amount",
        label: "Total Amount",
        value: "$34,280 (≈ ₦52,891,200 @ ₦1,543/$)",
        confidence: 87,
        reasoning:
          "USD total is exact; Naira equivalent uses estimated exchange rate",
      },
    ],
  },
};

/**
 * Return demo triage data with simulated latency.
 * @param {string} [presetId] - one of "lagos-dental", "vi-real-estate", "apapa-shipping"
 * @returns {Promise<object>} triage response
 */
export async function getDemoResult(presetId) {
  // Simulated latency: random 420-680 ms
  const delay = Math.floor(Math.random() * 261) + 420;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const preset = PRESETS[presetId] || PRESETS["lagos-dental"];

  // Simulated token usage
  const inputTokens = Math.floor(Math.random() * 200) + 350;
  const outputTokens = Math.floor(Math.random() * 150) + 250;

  return {
    success: true,
    mode: "demo",
    latencyMs: delay,
    tokenUsage: {
      input: inputTokens,
      output: outputTokens,
      estimatedCost: parseFloat(
        ((inputTokens * 0.15) / 1e6 + (outputTokens * 0.6) / 1e6).toFixed(6)
      ),
    },
    triage: {
      overallConfidence: preset.overallConfidence,
      autoApproved: preset.autoApproved,
      urgencyLevel: preset.urgencyLevel,
      fields: preset.fields,
    },
  };
}

/** Expose preset IDs for validation. */
export const PRESET_IDS = Object.keys(PRESETS);
