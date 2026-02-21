import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { tooltipStyle } from '../../tokens/colors'

export default function SwitchingBehaviorChart({ data }) {
  const chartData = data.competitors.map((c) => ({
    brand: c.brand,
    switchedTo: Math.round(c.switchedTo * 100),
    switchedFrom: Math.round(c.switchedFrom * 100),
    net: (c.net * 100).toFixed(1),
    netPositive: c.net >= 0,
  }))

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-white mb-1">{data.title}</div>
          <p className="text-xs" style={{ color: '#AFADAD' }}>{data.insight}</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] flex-shrink-0 ml-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#EF4444' }} />
            <span style={{ color: '#AFADAD' }}>Switched To</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#5C70D6' }} />
            <span style={{ color: '#AFADAD' }}>Switched From</span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barGap={2}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="brand"
            tick={{ fill: '#AFADAD', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: '#AFADAD', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v, name) => [`${v}%`, name === 'switchedTo' ? 'Switched To' : 'Switched From']}
          />
          <Bar dataKey="switchedTo" fill="#EF4444" radius={[3, 3, 0, 0]} maxBarSize={32} />
          <Bar dataKey="switchedFrom" fill="#5C70D6" radius={[3, 3, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>

      {/* Net change table */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {chartData.map((c) => (
          <div
            key={c.brand}
            className="rounded-lg p-3 text-center"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="text-[11px] font-medium mb-1 truncate" style={{ color: '#AFADAD' }}>
              {c.brand}
            </div>
            <div
              className="text-sm font-bold"
              style={{ color: c.netPositive ? '#22C55E' : '#EF4444' }}
            >
              {c.netPositive ? '+' : ''}{c.net}%
            </div>
            <div className="text-[10px]" style={{ color: '#AFADAD' }}>net change</div>
          </div>
        ))}
      </div>
    </div>
  )
}
