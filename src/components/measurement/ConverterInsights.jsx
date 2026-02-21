import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { semantic, tooltipStyle } from '../../tokens/colors'

const DEMO_TABS = ['Age', 'Gender', 'HHI', 'Generation', 'Homeownership', 'Education', 'Children in HH', 'Marital Status']

function DemographicChart({ demoData }) {
  if (!demoData) return null

  const chartData = demoData.attain.map((d) => ({
    segment: d.segment,
    attain: Math.round(d.pct * 100),
    census: Math.round(d.census * 100),
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barGap={2}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="segment"
          tick={{ fill: semantic.muted, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          tick={{ fill: semantic.muted, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v, name) => [`${v}%`, name === 'attain' ? 'Attain Panel' : 'U.S. Census']}
        />
        <Bar dataKey="attain" fill="#C4B5FD" radius={[3, 3, 0, 0]} maxBarSize={28} name="attain" />
        <Bar dataKey="census" fill="#2DD4BF" radius={[3, 3, 0, 0]} maxBarSize={28} name="census" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function MatchLegend() {
  return (
    <div className="flex items-center gap-4 text-[11px] mb-4">
      <span className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#C4B5FD' }} />
        <span style={{ color: semantic.muted }}>Attain Panel</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#2DD4BF' }} />
        <span style={{ color: semantic.muted }}>U.S. Census</span>
      </span>
    </div>
  )
}

export default function ConverterInsights({ data }) {
  const [activeDemo, setActiveDemo] = useState(0)
  const [showingPsycho, setShowingPsycho] = useState(false)

  if (!data) return null

  const availableDemos = DEMO_TABS.filter((tab) =>
    data.demographics.some((d) => d.label === tab)
  )

  const currentDemoData = data.demographics.find((d) => d.label === availableDemos[activeDemo])

  return (
    <div
      className="glass-card rounded-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="text-[11px] uppercase tracking-widest font-semibold"
          style={{ color: semantic.muted }}
        >
          Converter Insights · {data.label}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setShowingPsycho(false)}
            className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={{
              backgroundColor: !showingPsycho ? 'rgba(103,87,158,0.45)' : 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              color: !showingPsycho ? '#FFFFFF' : semantic.muted,
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            Demographics
          </button>
          <button
            onClick={() => setShowingPsycho(true)}
            className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={{
              backgroundColor: showingPsycho ? 'rgba(103,87,158,0.45)' : 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              color: showingPsycho ? '#FFFFFF' : semantic.muted,
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            Psychographics
          </button>
        </div>
      </div>

      {!showingPsycho ? (
        <>
          {/* Demo tab selector */}
          <div className="flex gap-1 flex-wrap mb-4">
            {availableDemos.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveDemo(i)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
                style={{
                  backgroundColor: activeDemo === i ? 'rgba(103,87,158,0.3)' : 'rgba(255,255,255,0.06)',
                  color: activeDemo === i ? '#C4B5FD' : semantic.muted,
                  border: activeDemo === i ? '1px solid #67579E' : '1px solid transparent',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <MatchLegend />
          <DemographicChart demoData={currentDemoData} />
        </>
      ) : (
        <div className="flex flex-col gap-4">
          {data.psychographics.map((psych) => (
            <div key={psych.label}>
              <div
                className="text-[11px] uppercase tracking-wider font-semibold mb-2"
                style={{ color: '#67579E' }}
              >
                {psych.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {psych.top.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: 'rgba(196, 181, 253, 0.1)',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)',
                      color: '#C4B5FD',
                      border: '1px solid rgba(196,181,253,0.2)',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
