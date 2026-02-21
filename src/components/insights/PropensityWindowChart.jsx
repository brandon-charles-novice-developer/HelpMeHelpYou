import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { tooltipStyle } from '../../tokens/colors'

function scoreColor(score) {
  if (score >= 90) return '#22C55E'
  if (score >= 80) return '#5C70D6'
  if (score >= 65) return '#F59E0B'
  return '#AFADAD'
}

export default function PropensityWindowChart({ data }) {
  return (
    <div>
      <div className="mb-4">
        <div className="text-sm font-semibold text-white mb-1">{data.title}</div>
        <p className="text-xs" style={{ color: '#AFADAD' }}>{data.insight}</p>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data.windows} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="window"
            tick={{ fill: '#AFADAD', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#AFADAD', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v, _name, props) => [
              `${v} (${props.payload.label})`,
              'Propensity Score',
            ]}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={56}>
            {data.windows.map((entry, i) => (
              <Cell key={i} fill={scoreColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Converter estimates below chart */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {data.windows.map((w) => (
          <div
            key={w.window}
            className="rounded-lg p-3 text-center"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="text-[11px] font-semibold mb-1" style={{ color: '#AFADAD' }}>
              {w.window}
            </div>
            <div className="text-base font-bold" style={{ color: scoreColor(w.score) }}>
              {w.score}
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: '#AFADAD' }}>
              {w.converters.toLocaleString()} likely converters
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
