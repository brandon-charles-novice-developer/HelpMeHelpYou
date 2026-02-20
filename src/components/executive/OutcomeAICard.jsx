// OutcomeAI Card — 3-zone layout matching Attain's OutcomeHQ AI design
// Zone 1: near-black (#1E1A2E) — what happened
// Zone 2: deep purple (#4D4176) — what to do
// Zone 3: card surface (#252040) — expected impact

export default function OutcomeAICard({ card, index = 0 }) {
  return (
    <div
      className="rounded-card overflow-hidden"
      style={{ boxShadow: 'rgba(0, 0, 0, 0.25) 0px 2px 40px 0px' }}
    >
      {/* Zone 1 — Insight */}
      <div className="p-5" style={{ backgroundColor: '#1E1A2E' }}>
        <div
          className="text-[10px] uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5"
          style={{ color: '#67579E' }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#67579E' }}
          />
          OutcomeHQ AI Insight {index > 0 ? `#${index}` : ''}
        </div>
        <p className="text-sm text-white leading-relaxed">{card.insight}</p>
      </div>

      {/* Zone 2 — Recommendation */}
      <div className="p-5" style={{ backgroundColor: '#4D4176' }}>
        <div
          className="text-[10px] uppercase tracking-widest font-semibold mb-2"
          style={{ color: '#C4B5FD' }}
        >
          Recommendation
        </div>
        <p className="text-sm text-white leading-relaxed">{card.recommendation}</p>
      </div>

      {/* Zone 3 — Expected Impact */}
      <div className="p-5" style={{ backgroundColor: '#252040' }}>
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
