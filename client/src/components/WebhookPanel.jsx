import { useState } from 'react';
import { ChevronDown, ChevronUp, Send, Loader2, ExternalLink } from 'lucide-react';
import PayloadModal from './PayloadModal';

export default function WebhookPanel({
  webhookUrl,
  setWebhookUrl,
  triageResult,
  webhookLogs,
  onDispatch,
  isDispatching,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalPayload, setModalPayload] = useState(null);

  return (
    <div className="bg-[#12121a] border-t border-[#2a2a3a] shrink-0">
      {/* Toggle Bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-[#16161f] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Webhook Dispatcher & Audit Log
          </span>
          {webhookLogs.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#2a2a3a] text-xs text-[var(--text-muted)]">
              {webhookLogs.length}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
        ) : (
          <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-4 max-h-[300px] overflow-auto">
          <div className="flex gap-4">
            {/* Left: Dispatch Controls */}
            <div className="flex-1">
              <label className="text-xs text-[var(--text-muted)] mb-1.5 block">
                Target Webhook URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-n8n.example.com/webhook/opsflow-intake"
                  className="flex-1 bg-[#16161f] border border-[#2a2a3a] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#4a4a6a] transition-colors"
                />
                <button
                  onClick={onDispatch}
                  disabled={!triageResult || isDispatching}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  {isDispatching ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Approve & Dispatch
                </button>
              </div>
            </div>
          </div>

          {/* Audit Log Table */}
          {webhookLogs.length > 0 && (
            <div className="mt-4 rounded-xl border border-[#2a2a3a] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1a1a28]">
                    <th className="text-left px-3 py-2 text-xs font-medium text-[var(--text-muted)]">Timestamp</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-[var(--text-muted)]">Status</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-[var(--text-muted)]">Response Time</th>
                    <th className="text-center px-3 py-2 text-xs font-medium text-[var(--text-muted)]">Payload</th>
                  </tr>
                </thead>
                <tbody>
                  {webhookLogs.map((log, idx) => (
                    <tr key={idx} className="border-t border-[#2a2a3a]">
                      <td className="px-3 py-2 text-xs text-[var(--text-muted)] font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          log.statusCode >= 200 && log.statusCode < 300
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}>
                          {log.statusCode} {log.statusText?.split(' ')[0] || ''}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-xs text-[var(--text-secondary)] font-mono">
                        {log.responseTimeMs}ms
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => setModalPayload(log)}
                          className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 mx-auto"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Payload Modal */}
      <PayloadModal
        isOpen={!!modalPayload}
        onClose={() => setModalPayload(null)}
        payload={modalPayload}
      />
    </div>
  );
}

