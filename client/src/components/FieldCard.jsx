export default function FieldCard({ field, onUpdate }) {
  const { key, label, value, confidence, reasoning } = field;

  const isLineItems = key === 'line_items' && Array.isArray(value);

  // Confidence pill styling
  let pillClasses, pillText;
  if (confidence >= 90) {
    pillClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    pillText = `${confidence}% Match`;
  } else if (confidence >= 70) {
    pillClasses = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    pillText = `${confidence}% Uncertain`;
  } else {
    pillClasses = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    pillText = `${confidence}% Low`;
  }

  const handleChange = (newValue) => {
    onUpdate(key, newValue);
  };

  return (
    <div className="bg-[#16161f] rounded-xl border border-[#2a2a3a] p-4 mb-3 hover:border-[#3a3a4a] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
          {label}
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${pillClasses}`}>
          {pillText}
        </span>
      </div>

      {/* Value */}
      {isLineItems ? (
        <div className="rounded-lg border border-[#2a2a3a] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a28]">
                <th className="text-left px-3 py-2 text-xs font-medium text-[var(--text-muted)]">Item</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-[var(--text-muted)]">Qty</th>
                {value.some(i => i.unit) && (
                  <th className="text-left px-3 py-2 text-xs font-medium text-[var(--text-muted)]">Unit</th>
                )}
                {value.some(i => i.cbm) && (
                  <th className="text-right px-3 py-2 text-xs font-medium text-[var(--text-muted)]">CBM</th>
                )}
                <th className="text-right px-3 py-2 text-xs font-medium text-[var(--text-muted)]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {value.map((item, idx) => (
                <tr key={idx} className="border-t border-[#2a2a3a]">
                  <td className="px-3 py-2 text-[var(--text-secondary)]">{item.item}</td>
                  <td className="px-3 py-2 text-right text-[var(--text-secondary)]">{item.qty?.toLocaleString()}</td>
                  {value.some(i => i.unit) && (
                    <td className="px-3 py-2 text-[var(--text-muted)]">{item.unit || '—'}</td>
                  )}
                  {value.some(i => i.cbm) && (
                    <td className="px-3 py-2 text-right text-[var(--text-muted)]">{item.cbm || '—'}</td>
                  )}
                  <td className="px-3 py-2 text-right font-medium text-[var(--text-primary)]">
                    {typeof item.amount === 'number' ? item.amount.toLocaleString() : item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : key === 'summary' ? (
        <textarea
          value={typeof value === 'string' ? value : JSON.stringify(value)}
          onChange={(e) => handleChange(e.target.value)}
          rows={3}
          className="w-full bg-[#1a1a28] rounded-lg border border-[#2a2a3a] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#4a4a6a] resize-none transition-colors"
        />
      ) : (
        <input
          type="text"
          value={typeof value === 'string' ? value : JSON.stringify(value)}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full bg-[#1a1a28] rounded-lg border border-[#2a2a3a] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#4a4a6a] transition-colors"
        />
      )}

      {/* AI Reasoning */}
      {reasoning && (
        <div className="mt-2 flex items-start gap-1.5">
          <svg className="w-3 h-3 text-[var(--text-muted)] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-xs italic text-[var(--text-muted)] leading-relaxed">
            {reasoning}
          </span>
        </div>
      )}
    </div>
  );
}

