import { useCountUp } from '../../hooks/useCountUp'
import { useFadeIn } from '../../hooks/useFadeIn'
import { agencyScoreboardKpis } from '../../data/agency'
import { fmt } from '../../utils/fmt'
import { bg, semantic } from '../../tokens/colors'

const FORMAT_MAP = {
  currency_compact: '$',
  multiplier: 'x',
  percent: '%',
  integer_compact: '#',
  integer: '#',
}

function KpiCard({ kpi, index }) {
  const { ref, className } = useFadeIn()

  const raw = useCountUp({
    target: kpi.value,
    duration: 1200,
    delay: index * 100,
  })

  const displayValue = fmt(raw, FORMAT_MAP[kpi.format] || '#')

  const deltaColor =
    kpi.deltaPositive === true
      ? semantic.positive
      : kpi.deltaPositive === false
      ? semantic.negative
      : semantic.muted

  return (
    <div
      ref={ref}
      className={`rounded-card p-6 flex flex-col gap-1 transition-all duration-200 hover:-translate-y-0.5 ${className}`}
      style={{
        backgroundColor: bg.card,
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 30px 0px',
      }}
    >
      <div
        className="text-[11px] uppercase tracking-widest font-semibold"
        style={{ color: semantic.muted }}
      >
        {kpi.label}
      </div>

      <div className="text-4xl font-bold text-white leading-tight mt-2 tick-number">
        {displayValue}
      </div>

      <div className="text-xs font-medium mt-1" style={{ color: deltaColor }}>
        {kpi.delta}
      </div>
    </div>
  )
}

export default function AgencyScoreboard() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {agencyScoreboardKpis.map((kpi, i) => (
        <KpiCard key={kpi.id} kpi={kpi} index={i} />
      ))}
    </div>
  )
}
