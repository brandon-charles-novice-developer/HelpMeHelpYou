import { useNavigate } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'

export default function LevelHeader({ crumbs, title, subtitle, badge, actions }) {
  const navigate = useNavigate()

  return (
    <div
      className="rounded-card p-5 mb-5"
      style={{
        backgroundColor: '#252040',
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 1px 20px 0px',
      }}
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
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: '#AFADAD',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2D2750' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)' }}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}
