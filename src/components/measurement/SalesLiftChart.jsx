import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { tooltipStyle } from '../../tokens/colors'

function fmt(v) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(2)}M`
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`
  return `$${v}`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={tooltipStyle}>
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          <span style={{ color: '#AFADAD' }}>{p.name}:</span>
          <span className="font-medium">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function SalesLiftChart({ data }) {
  return (
    <div
      className="rounded-card p-5"
      style={{
        backgroundColor: '#252040',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 30px 0px',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="text-[11px] uppercase tracking-widest font-semibold"
          style={{ color: '#AFADAD' }}
        >
          Sales Lift
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: '#5C70D6' }} />
            <span style={{ color: '#AFADAD' }}>Observed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 inline-block"
              style={{
                height: 2,
                backgroundImage: 'repeating-linear-gradient(90deg, #2DD4BF 0, #2DD4BF 4px, transparent 4px, transparent 8px)',
              }}
            />
            <span style={{ color: '#AFADAD' }}>Expected</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: '#22C55E' }} />
            <span style={{ color: '#AFADAD' }}>Incremental</span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="incrementalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />

          <XAxis
            dataKey="week"
            tick={{ fill: '#AFADAD', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fill: '#AFADAD', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="incremental"
            name="Incremental"
            stroke="#22C55E"
            strokeWidth={2}
            fill="url(#incrementalGrad)"
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="expected"
            name="Expected"
            stroke="#2DD4BF"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="observed"
            name="Observed"
            stroke="#5C70D6"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
