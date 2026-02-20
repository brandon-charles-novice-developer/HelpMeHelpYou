import { useNavigate } from 'react-router-dom'

export default function Breadcrumb({ crumbs }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                /
              </span>
            )}
            {isLast ? (
              <span className="text-xs font-semibold text-white">{crumb.label}</span>
            ) : (
              <button
                onClick={() => crumb.path && navigate(crumb.path)}
                className="text-xs transition-colors duration-150"
                style={{ color: '#67579E' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#C4B5FD' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#67579E' }}
              >
                {crumb.label}
              </button>
            )}
          </span>
        )
      })}
    </div>
  )
}
