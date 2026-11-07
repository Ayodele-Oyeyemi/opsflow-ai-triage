# Project Rules: OpsFlow AI Triage
- Stack: Monorepo with `/client` (React 18, Vite, Tailwind CSS, Lucide Icons) and `/server` (Node.js, Express, @google/genai SDK).
- Design System: Enterprise Dark Slate theme (#090D16 background, #111827 cards, subtle 1px #1F2937 borders, emerald/amber/rose status badges).
- Reliability: Always include a deterministic fallback/mock extraction mode if GEMINI_API_KEY is missing or rate-limited so live recruiter demos never crash.