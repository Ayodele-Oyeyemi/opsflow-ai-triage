import { X } from 'lucide-react';

export default function PayloadModal({ isOpen, onClose, payload }) {
  if (!isOpen || !payload) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-[#16161f] border border-[#2a2a3a] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a3a]">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Webhook Dispatch Detail
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {payload.timestamp ? new Date(payload.timestamp).toLocaleString() : ''}
              {' · '}
              <span className={
                payload.statusCode >= 200 && payload.statusCode < 300
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }>
                {payload.statusCode} {payload.statusText}
              </span>
              {' · '}
              {payload.responseTimeMs}ms
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#2a2a3a] transition-colors"
          >
            <X className="w-4 h-4 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          {payload.responseHeaders && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Response Headers
              </h4>
              <div className="rounded-lg bg-[#1a1a28] border border-[#2a2a3a] p-3">
                <pre className="text-xs font-mono text-[var(--text-secondary)] whitespace-pre-wrap">
                  {JSON.stringify(payload.responseHeaders, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Response Body
            </h4>
            <div className="rounded-lg bg-[#1a1a28] border border-[#2a2a3a] p-3">
              <pre className="text-xs font-mono text-[var(--text-secondary)] whitespace-pre-wrap">
                {JSON.stringify(payload.responseBody, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

