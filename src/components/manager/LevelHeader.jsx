import { useNavigate } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'

export default function LevelHeader({ crumbs, title, subtitle, badge, actions }) {
  const navigate = useNavigate()

  return (
    <div
      className="glass-card rounded-card p-5 mb-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Breadcrumb crumbs={crumbs} />
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {badge && badge}
          </div>
          {subtitle && (
            <p className="text-sm" style={{ color: '#AFADAD' }}>{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
          <button
            onClick={() => navigate(-1)}
            className="glass-card px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              color: '#AFADAD',
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}
