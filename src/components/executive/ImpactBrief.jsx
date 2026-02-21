import { useFadeIn } from '../../hooks/useFadeIn'
import { agency } from '../../data/agency'

export default function ImpactBrief() {
  const { ref, className } = useFadeIn()

  return (
    <div
      ref={ref}
      className={`glass-card rounded-card p-6 ${className}`}
      style={{
        borderLeft: '3px solid #67579E',
      }}
    >
      <div
        className="text-[11px] uppercase tracking-widest font-semibold mb-3"
        style={{ color: '#67579E' }}
      >
        Morning Brief · Tombras · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>

      <h2 className="text-xl font-bold text-white mb-3">
        {agency.impactBrief.headline}
      </h2>

      <p className="text-sm leading-relaxed mb-3" style={{ color: '#D4D2D2' }}>
        {agency.impactBrief.body}
      </p>

      <div
        className="flex items-start gap-2 text-sm leading-relaxed pt-3"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', color: '#F59E0B' }}
      >
        <span className="mt-0.5 font-bold">▲</span>
        <span>{agency.impactBrief.action}</span>
      </div>
    </div>
  )
}
