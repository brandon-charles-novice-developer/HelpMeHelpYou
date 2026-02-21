import { useNavigate } from 'react-router-dom'
import { useFadeIn } from '../../hooks/useFadeIn'
import { clients } from '../../data/clients'
import { fmt } from '../../utils/fmt'
import SectionLabel from '../shared/SectionLabel'
import { semantic, accent } from '../../tokens/colors'

const CTV_BENCHMARK = 0.028

function PacingBar({ value }) {
  const color = value >= 0.7 ? semantic.positive : value >= 0.4 ? semantic.caution : semantic.negative
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ width: 60, backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(value * 100, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs" style={{ color }}>
        {Math.round(value * 100)}%
      </span>
    </div>
  )
}

function CvrVsBenchmark({ cvr }) {
  const delta = cvr - CTV_BENCHMARK
  const color = delta >= 0 ? semantic.positive : semantic.negative
  const sign = delta >= 0 ? '+' : ''
  return (
    <span className="text-xs font-semibold" style={{ color }}>
      {sign}{(delta * 100).toFixed(1)}pts vs 2.8% benchmark
    </span>
  )
}

export default function ClientPerformanceMap() {
  const navigate = useNavigate()
  const { ref, className } = useFadeIn()

  return (
    <div ref={ref} className={className}>
      <SectionLabel right={
        <span className="text-xs" style={{ color: semantic.muted }}>
          5 clients · Click any row to drill in
        </span>
      }>
        Client Performance
      </SectionLabel>

      <div
        className="glass-card rounded-card overflow-hidden"
      >
        {/* Table header */}
        <div
          className="grid text-[11px] uppercase tracking-widest font-semibold px-5 py-3"
          style={{
            color: semantic.muted,
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            gridTemplateColumns: '200px 1fr 1fr 1fr 1fr 140px',
          }}
        >
          <span>Client</span>
          <span>Incr. Revenue</span>
          <span>Conv. Rate</span>
          <span>New Buyer ROAS</span>
          <span>Budget Pacing</span>
          <span>Channels</span>
        </div>

        {/* Client rows */}
        {clients.map((client) => {
          const alert = client.alert
          return (
            <div key={client.id}>
              <button
                className="w-full text-left px-5 py-4 grid items-center row-hover"
                style={{
                  gridTemplateColumns: '200px 1fr 1fr 1fr 1fr 140px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                }}
                onClick={() => navigate(`/manager/${client.id}`)}
              >
                {/* Client name */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: client.logoColor }}
                  >
                    {client.logo}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{client.name}</div>
                    <div className="text-[11px]" style={{ color: semantic.muted }}>{client.vertical}</div>
                  </div>
                </div>

                {/* Revenue */}
                <div>
                  <div className="text-sm font-bold text-white">
                    {fmt(client.metrics.incrementalRevenue, '$')}
                  </div>
                  <div className="text-[11px] text-green-400">
                    {client.metrics.activeCampaigns} campaigns
                  </div>
                </div>

                {/* CVR */}
                <div>
                  <div className="text-sm font-bold text-white">
                    {(client.metrics.conversionRate * 100).toFixed(1)}%
                  </div>
                  <CvrVsBenchmark cvr={client.metrics.conversionRate} />
                </div>

                {/* ROAS */}
                <div>
                  <div className="text-sm font-bold text-white">
                    {client.metrics.newBuyerRoas.toFixed(1)}x
                  </div>
                  <div className="text-[11px]" style={{ color: semantic.muted }}>
                    New buyer ROAS
                  </div>
                </div>

                {/* Pacing */}
                <PacingBar value={0.65} />

                {/* Channels */}
                <div className="flex flex-wrap gap-1">
                  {client.channels.slice(0, 2).map((ch) => (
                    <span
                      key={ch}
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(92, 112, 214, 0.15)',
                        color: accent.blue,
                        WebkitBackdropFilter: 'blur(6px)',
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      {ch}
                    </span>
                  ))}
                  {client.channels.length > 2 && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(175, 173, 173, 0.1)',
                        color: semantic.muted,
                      }}
                    >
                      +{client.channels.length - 2}
                    </span>
                  )}
                </div>
              </button>

              {/* Alert row */}
              {alert && (
                <div
                  className="px-5 py-2.5 flex items-start gap-2 text-xs"
                  style={{
                    backgroundColor:
                      alert.type === 'positive'
                        ? 'rgba(34, 197, 94, 0.06)'
                        : 'rgba(245, 158, 11, 0.06)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <span
                    style={{
                      color: alert.type === 'positive' ? semantic.positive : semantic.caution,
                    }}
                  >
                    {alert.type === 'positive' ? '✓' : '⚠'}
                  </span>
                  <span style={{ color: '#D4D2D2' }}>{alert.message}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
