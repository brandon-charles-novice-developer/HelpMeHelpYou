import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { tooltipStyle } from '../../tokens/colors'

export default function CrossPurchaseChart({ data }) {
  const chartData = data.pairs.map((p) => ({
    brand: p.brand,
    overlap: Math.round(p.overlapRate * 100),
    index: p.index,
  }))

  return (
    <div>
      <div className="mb-4">
        <div className="text-sm font-semibold text-white mb-1">{data.title}</div>
        <p className="text-xs" style={{ color: '#AFADAD' }}>{data.insight}</p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 60, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: '#AFADAD', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 70]}
          />
          <YAxis
            type="category"
            dataKey="brand"
            tick={{ fill: '#AFADAD', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v) => [`${v}%`, 'Co-purchase Rate']}
          />
          <Bar
            dataKey="overlap"
            fill="#C4B5FD"
            radius={[0, 3, 3, 0]}
            maxBarSize={20}
            label={{
              position: 'right',
              formatter: (_, entry) => `${entry?.index}x`,
              fill: '#AFADAD',
              fontSize: 11,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
