import { Brain, FileText, ShieldCheck, Clock, DollarSign } from 'lucide-react';

export default function TelemetryHeader({ systemStatus, metrics }) {
  const isConnected = systemStatus === 'connected';

  return (
    <header className="bg-[#12121a] border-b border-[#2a2a3a] px-6 py-3 flex items-center justify-between shrink-0">
      {/* Left: Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
          <Brain className="w-4.5 h-4.5 text-violet-400" />
        </div>
        <span className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
          OpsFlow AI
        </span>
      </div>

      {/* Center: Status Badge */}
      <div className="flex items-center">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            isConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isConnected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          {isConnected ? 'Gemini 2.5 Flash Connected' : 'Demo Fallback Active'}
        </div>
      </div>

      {/* Right: Metrics */}
      <div className="flex items-center gap-2">
        <MetricPill
          icon={<FileText className="w-3 h-3" />}
          label="Docs"
          value={metrics.documentsProcessed}
        />
        <MetricPill
          icon={<ShieldCheck className="w-3 h-3" />}
          label="Auto-Approval"
          value={`${metrics.autoApprovalRate}%`}
        />
        <MetricPill
          icon={<Clock className="w-3 h-3" />}
          label="Avg Latency"
          value={`${metrics.avgLatencyMs}ms`}
        />
        <MetricPill
          icon={<DollarSign className="w-3 h-3" />}
          label="Token Cost"
          value={`$${metrics.totalTokenCost.toFixed(4)}`}
        />
      </div>
    </header>
  );
}

function MetricPill({ icon, label, value }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1a1a28] border border-[#2a2a3a] text-xs">
      <span className="text-[var(--text-muted)]">{icon}</span>
      <span className="text-[var(--text-muted)]">{label}:</span>
      <span className="text-[var(--text-primary)] font-medium">{value}</span>
    </div>
  );
}
