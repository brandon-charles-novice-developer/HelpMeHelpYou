// Cross-retailer attribution breakdown

export default function RetailerBreakdown({ retailers }) {
  if (!retailers?.length) return null

  const sorted = [...retailers].sort((a, b) => b.share - a.share)

  return (
    <div
      className="rounded-card p-4"
      style={{
        backgroundColor: '#252040',
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 1px 20px 0px',
      }}
    >
      <div
        className="text-[11px] uppercase tracking-widest font-semibold mb-3"
        style={{ color: '#AFADAD' }}
      >
        Cross-Retailer Attribution
      </div>

      <div className="flex flex-col gap-2.5">
        {sorted.map((r) => (
          <div key={r.retailer}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-white">{r.retailer}</span>
              <span className="text-xs font-bold text-white">{Math.round(r.share * 100)}%</span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${r.share * 100}%`, backgroundColor: '#5C70D6' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
