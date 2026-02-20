import { useFadeIn } from '../../hooks/useFadeIn'
import SectionLabel from '../shared/SectionLabel'
// Agency-level Shopper Insights — switching + propensity highlights across clients

const HIGHLIGHTS = [
  {
    clientId: 'ricola',
    clientName: 'Ricola',
    logoColor: '#009B3A',
    logo: 'R',
    type: 'switching',
    insight: 'Halls is capturing 41% of Ricola switchers. Herbal/natural positioning is the key retention lever.',
    metric: '3.2x',
    metricLabel: 'Propensity Index',
    metricColor: '#22C55E',
  },
  {
    clientId: 'spirit',
    clientName: 'Spirit Airlines',
    logoColor: '#FFEC00',
    logo: 'SX',
    type: 'switching',
    insight: '18% of Spirit\'s audience switched to Frontier in 60 days. Price-motivated defection.',
    metric: '18%',
    metricLabel: 'Switching to Frontier',
    metricColor: '#F59E0B',
  },
  {
    clientId: 'indeed',
    clientName: 'Indeed',
    logoColor: '#2557A7',
    logo: 'I',
    type: 'propensity',
    insight: 'Life event segment hits 91 propensity score in 30-day window. Job transitions cluster Q1.',
    metric: '91',
    metricLabel: '30-day Propensity',
    metricColor: '#22C55E',
  },
  {
    clientId: 'newell',
    clientName: 'Newell Brands',
    logoColor: '#003087',
    logo: 'NB',
    type: 'basket',
    insight: '34% of Rubbermaid buyers co-purchase Coleman — cross-brand audience not yet activated.',
    metric: '34%',
    metricLabel: 'Cross-purchase Rate',
    metricColor: '#5C70D6',
  },
]

function InsightTile({ item }) {
  return (
    <div
      className="rounded-card p-4 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: '#1E1A2E',
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 1px 20px 0px',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ backgroundColor: item.logoColor }}
          >
            {item.logo}
          </div>
          <span className="text-xs font-semibold text-white">{item.clientName}</span>
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold"
          style={{
            backgroundColor: 'rgba(103, 87, 158, 0.2)',
            color: '#C4B5FD',
          }}
        >
          Shopper Insights
        </span>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: '#D4D2D2' }}>
        {item.insight}
      </p>

      <div className="flex items-baseline gap-1.5 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-xl font-bold" style={{ color: item.metricColor }}>
          {item.metric}
        </span>
        <span className="text-[11px]" style={{ color: '#AFADAD' }}>{item.metricLabel}</span>
      </div>
    </div>
  )
}

export default function ShopperInsightsPanel() {
  const { ref, className } = useFadeIn()

  return (
    <div ref={ref} className={className}>
      <SectionLabel right={
        <span
          className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider"
          style={{ backgroundColor: 'rgba(103, 87, 158, 0.2)', color: '#C4B5FD' }}
        >
          Shopper Insights
        </span>
      }>
        Purchase Intelligence Highlights
      </SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        {HIGHLIGHTS.map((item) => (
          <InsightTile key={item.clientId} item={item} />
        ))}
      </div>
    </div>
  )
}
