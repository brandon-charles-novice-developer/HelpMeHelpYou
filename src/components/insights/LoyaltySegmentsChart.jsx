import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { tooltipStyle } from '../../tokens/colors'

export default function LoyaltySegmentsChart({ data }) {
  const chartData = data.segments.map((s) => ({
    name: s.label,
    value: Math.round(s.share * 100),
    color: s.color,
    hhiIndex: s.hhiIndex,
  }))

  return (
    <div>
      <div className="mb-4">
        <div className="text-sm font-semibold text-white mb-1">{data.title}</div>
        <p className="text-xs" style={{ color: '#AFADAD' }}>{data.insight}</p>
      </div>

      <div className="flex items-start gap-6">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [`${v}%`, 'Share']}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col gap-3 flex-1">
          {chartData.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-white truncate">{s.name}</span>
                  <span className="text-xs font-bold text-white flex-shrink-0">{s.value}%</span>
                </div>
                <div
                  className="h-1 rounded-full mt-1 overflow-hidden"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.value}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] font-semibold" style={{ color: '#AFADAD' }}>
                  HHI {s.hhiIndex}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
