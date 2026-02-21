export default function BasketAssociationChart({ data }) {
  const sorted = [...data.associations].sort((a, b) => b.lift - a.lift)

  return (
    <div>
      <div className="mb-4">
        <div className="text-sm font-semibold text-white mb-1">{data.title}</div>
        <p className="text-xs" style={{ color: '#AFADAD' }}>{data.insight}</p>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((item) => (
          <div
            key={item.item}
            className="flex items-center gap-4 rounded-lg p-3"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{item.item}</div>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="h-1.5 rounded-full overflow-hidden flex-1"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', maxWidth: 120 }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(item.coRate * 100, 100)}%`,
                      backgroundColor: '#C4B5FD',
                    }}
                  />
                </div>
                <span className="text-[11px]" style={{ color: '#AFADAD' }}>
                  {Math.round(item.coRate * 100)}% co-purchase
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div
                className="text-lg font-bold"
                style={{ color: item.lift >= 4 ? '#22C55E' : item.lift >= 2.5 ? '#5C70D6' : '#AFADAD' }}
              >
                {item.lift.toFixed(1)}x
              </div>
              <div className="text-[10px]" style={{ color: '#AFADAD' }}>lift</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
