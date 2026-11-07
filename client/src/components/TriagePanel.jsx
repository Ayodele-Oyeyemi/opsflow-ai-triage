import { ShieldCheck, AlertTriangle, Clock, Cpu, Sparkles } from 'lucide-react';
import FieldCard from './FieldCard';

export default function TriagePanel({ triageResult, viewMode, setViewMode, onFieldUpdate }) {
  if (!triageResult) {
    return (
      <div className="w-[55%] flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1a1a28] border border-[#2a2a3a] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-[var(--text-muted)]" />
          </div>
          <p className="text-[var(--text-muted)] text-sm">
            Load a sample preset or upload a document,
          </p>
          <p className="text-[var(--text-muted)] text-sm">
            then click <span className="text-violet-400 font-medium">Run AI Triage</span> to see results
          </p>
        </div>
      </div>
    );
  }

  const { triage, mode, latencyMs, tokenUsage } = triageResult;
  const { autoApproved, overallConfidence, urgencyLevel, fields } = triage;

  return (
    <div className="w-[55%] flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* Status Banner */}
      <div
        className={`px-5 py-3 flex items-center gap-2.5 border-b shrink-0 ${
          autoApproved
            ? 'bg-emerald-500/8 border-emerald-500/20'
            : 'bg-amber-500/8 border-amber-500/20 animate-pulse-amber'
        }`}
      >
        {autoApproved ? (
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        )}
        <div>
          <span
            className={`text-sm font-semibold ${
              autoApproved ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {autoApproved
              ? 'AUTO-APPROVED — Ready for Webhook Dispatch'
              : 'HUMAN REVIEW REQUIRED — Low Confidence Fields Detected'}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
            autoApproved
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
          }`}>
            {overallConfidence}% Overall
          </span>
        </div>
      </div>

      {/* Meta Row */}
      <div className="px-5 py-2.5 flex items-center gap-3 border-b border-[#2a2a3a] shrink-0">
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
          mode === 'gemini'
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            : 'bg-[#1a1a28] text-[var(--text-muted)] border-[#2a2a3a]'
        }`}>
          <Cpu className="w-3 h-3" />
          {mode === 'gemini' ? 'Gemini' : 'Demo'}
        </span>
        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {latencyMs}ms
        </span>
        {tokenUsage && (
          <span className="text-xs text-[var(--text-muted)]">
            {tokenUsage.input + tokenUsage.output} tokens · ${tokenUsage.estimatedCost.toFixed(4)}
          </span>
        )}
        <span className={`text-xs px-2 py-0.5 rounded-full border ${
          urgencyLevel === 'high'
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            : urgencyLevel === 'medium'
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        }`}>
          {urgencyLevel} urgency
        </span>
      </div>

      {/* View Toggle Tabs */}
      <div className="px-5 py-2 border-b border-[#2a2a3a] flex items-center gap-1 shrink-0">
        <button
          onClick={() => setViewMode('visual')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            viewMode === 'visual'
              ? 'bg-[#2a2a3a] text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          Visual Editor
        </button>
        <button
          onClick={() => setViewMode('json')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            viewMode === 'json'
              ? 'bg-[#2a2a3a] text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          JSON Schema
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {viewMode === 'visual' ? (
          <div>
            {fields.map((field) => (
              <FieldCard
                key={field.key}
                field={field}
                onUpdate={onFieldUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-[#16161f] border border-[#2a2a3a] p-4 overflow-auto">
            <pre className="text-xs font-mono text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(triage, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

