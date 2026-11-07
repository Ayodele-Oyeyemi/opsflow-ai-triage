import { PRESETS } from '../data/presets';

export default function SampleBar({ onLoadPreset, isProcessing }) {
  return (
    <div className="bg-[#0e0e16] border-b border-[#2a2a3a] px-6 py-3 shrink-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
          Quick Start — Load Sample Preset
        </span>
      </div>
      <div className="flex items-center gap-3">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onLoadPreset(preset.id)}
            disabled={isProcessing}
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a1a28] border border-[#2a2a3a] hover:bg-[#22222f] hover:border-[#4a4a6a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left group"
          >
            <span className="text-2xl shrink-0">{preset.icon}</span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-[var(--text-primary)] group-hover:text-white truncate">
                {preset.label}
              </div>
              <div className="text-xs text-[var(--text-muted)] truncate">
                {preset.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

