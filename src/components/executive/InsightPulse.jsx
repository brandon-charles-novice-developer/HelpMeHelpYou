import { useFadeIn } from '../../hooks/useFadeIn'
import SectionLabel from '../shared/SectionLabel'

const pulseAlerts = [
  {
    id: 'pulse-1',
    type: 'positive',
    audience: 'Q1 Cold-Season Purchasers (Ricola)',
    signal: 'Propensity spike +3.2x above annual baseline. 30-day window score: 91.',
    action: 'Expand Ricola campaign budget by 15% before peak breaks.',
    color: '#22C55E',
    icon: '↑',
  },
  {
    id: 'pulse-2',
    type: 'caution',
    audience: 'Frontier Switchers (Spirit Airlines target)',
    signal: '18% switching rate from Spirit to Frontier, up 4pts month-over-month.',
    action: 'Activate Frontier Switcher Outcome Audience for conquest.',
    color: '#F59E0B',
    icon: '⚠',
  },
  {
    id: 'pulse-3',
    type: 'positive',
    audience: 'Life Event Transitioners (Indeed)',
    signal: 'Q1 job transition index +28% vs Q3 baseline. 30-day propensity peak.',
    action: 'Indeed campaign CVR is 40% above vertical avg — increase frequency.',
    color: '#22C55E',
    icon: '↑',
  },
]

export default function InsightPulse() {
  const { ref, className } = useFadeIn()

  return (
    <div ref={ref} className={className}>
      <SectionLabel>Audience Trend Alerts</SectionLabel>

      <div className="flex flex-col gap-3">
        {pulseAlerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-card p-4 flex gap-4 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: '#252040',
              boxShadow: 'rgba(0, 0, 0, 0.15) 0px 1px 20px 0px',
              borderLeft: `3px solid ${alert.color}`,
            }}
          >
            <div
              className="text-base font-bold flex-shrink-0 mt-0.5"
              style={{ color: alert.color }}
            >
              {alert.icon}
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {alert.audience}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#AFADAD' }}>
                {alert.signal}
              </p>
              <p className="text-xs font-medium" style={{ color: alert.color }}>
                {alert.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
