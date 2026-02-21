import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { useFadeIn } from '../../hooks/useFadeIn'
import { tooltipStyle } from '../../tokens/colors'
import SectionLabel from '../shared/SectionLabel'

// Conversion rate over time — Tombras blended vs 2.8% CTV benchmark
const data = [
  { week: 'W1',  tombras: 0.030, benchmark: 0.028 },
  { week: 'W2',  tombras: 0.032, benchmark: 0.028 },
  { week: 'W3',  tombras: 0.034, benchmark: 0.028 },
  { week: 'W4',  tombras: 0.033, benchmark: 0.028 },
  { week: 'W5',  tombras: 0.035, benchmark: 0.028 },
  { week: 'W6',  tombras: 0.037, benchmark: 0.028 },
  { week: 'W7',  tombras: 0.038, benchmark: 0.028 },
  { week: 'W8',  tombras: 0.036, benchmark: 0.028 },
  { week: 'W9',  tombras: 0.039, benchmark: 0.028 },
  { week: 'W10', tombras: 0.040, benchmark: 0.028 },
  { week: 'W11', tombras: 0.041, benchmark: 0.028 },
  { week: 'W12', tombras: 0.038, benchmark: 0.028 },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={tooltipStyle}>
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          <span style={{ color: '#AFADAD' }}>{p.name}:</span>
          <span className="font-medium">{(p.value * 100).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

export default function ConversionChart() {
  const { ref, className } = useFadeIn()

  return (
    <div
      ref={ref}
      className={`glass-card rounded-card p-6 ${className}`}
    >
      <SectionLabel right={
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: '#5C70D6' }} />
            <span style={{ color: '#AFADAD' }}>Tombras Blended CVR</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 inline-block"
              style={{
                height: 2,
                backgroundImage: 'repeating-linear-gradient(90deg, #2DD4BF 0, #2DD4BF 4px, transparent 4px, transparent 8px)',
              }}
            />
            <span style={{ color: '#AFADAD' }}>CTV Benchmark (2.8%)</span>
          </span>
        </div>
      }>
        Conversion Rate vs CTV Benchmark
      </SectionLabel>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="tombrasGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5C70D6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#5C70D6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />

          <XAxis
            dataKey="week"
            tick={{ fill: '#AFADAD', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${(v * 100).toFixed(1)}%`}
            tick={{ fill: '#AFADAD', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[0.020, 0.050]}
          />

          <Tooltip content={<CustomTooltip />} />

          <ReferenceLine
            y={0.028}
            stroke="#2DD4BF"
            strokeDasharray="5 4"
            strokeWidth={1.5}
          />

          <Area
            type="monotone"
            dataKey="tombras"
            name="Tombras CVR"
            stroke="#5C70D6"
            strokeWidth={2}
            fill="url(#tombrasGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
