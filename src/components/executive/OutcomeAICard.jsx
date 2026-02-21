// OutcomeAI Card — 3-zone glassmorphism layout for Outcome HQ 2.0
// Zone 1: glass dark — what happened
// Zone 2: glass purple — what to do
// Zone 3: card surface (#252040) — expected impact

export default function OutcomeAICard({ card, index = 0 }) {
  return (
    <div
      className="rounded-card overflow-hidden"
      style={{
        border: '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 2px 40px 0px',
      }}
    >
      {/* Zone 1 — Insight */}
      <div
        className="p-5"
        style={{
          background: 'rgba(30, 26, 46, 0.60)',
          WebkitBackdropFilter: 'blur(14px)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <div
          className="text-[10px] uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5"
          style={{ color: '#67579E' }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#67579E' }}
          />
          Outcome HQ AI Insight {index > 0 ? `#${index}` : ''}
        </div>
        <p className="text-sm text-white leading-relaxed">{card.insight}</p>
      </div>

      {/* Zone 2 — Recommendation */}
      <div
        className="p-5"
        style={{
          background: 'rgba(77, 65, 118, 0.40)',
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="text-[10px] uppercase tracking-widest font-semibold mb-2"
          style={{ color: '#C4B5FD' }}
        >
          Recommendation
        </div>
        <p className="text-sm text-white leading-relaxed">{card.recommendation}</p>
      </div>

      {/* Zone 3 — Expected Impact */}
      <div
        className="p-5"
        style={{
          background: 'rgba(37, 32, 64, 0.50)',
          WebkitBackdropFilter: 'blur(14px)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <div
          className="text-[10px] uppercase tracking-widest font-semibold mb-2"
          style={{ color: '#AFADAD' }}
        >
          Expected Impact
        </div>
        <p
          className="text-base font-bold"
          style={{ color: card.impactPositive ? '#22C55E' : '#EF4444' }}
        >
          {card.expectedImpact}
        </p>
      </div>
    </div>
  )
}
