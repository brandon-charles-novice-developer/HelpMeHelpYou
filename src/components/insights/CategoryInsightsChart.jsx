export default function CategoryInsightsChart({ data }) {
  const chartData = data.data.map((d) => ({
    category: d.category,
    share: Math.round(d.share * 100),
    index: d.index,
  }))

  return (
    <div>
      <div className="mb-4">
        <div className="text-sm font-semibold text-white mb-1">{data.title}</div>
        <p className="text-xs" style={{ color: '#AFADAD' }}>
          Audience share by purchase category · Index vs U.S. average (100 = baseline)
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {chartData.map((d) => (
          <div key={d.category}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-white truncate">{d.category}</span>
              <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                <span className="text-xs text-white font-semibold">{d.share}%</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor:
                      d.index >= 180
                        ? 'rgba(34, 197, 94, 0.15)'
                        : d.index >= 130
                        ? 'rgba(92, 112, 214, 0.15)'
                        : 'rgba(175, 173, 173, 0.1)',
                    color:
                      d.index >= 180
                        ? '#22C55E'
                        : d.index >= 130
                        ? '#5C70D6'
                        : '#AFADAD',
                  }}
                >
                  {d.index} index
                </span>
              </div>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${d.share}%`,
                  backgroundColor:
                    d.index >= 180 ? '#22C55E' : d.index >= 130 ? '#5C70D6' : '#AFADAD',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
