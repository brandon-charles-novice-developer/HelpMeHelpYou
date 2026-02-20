import ModeToggle from './ModeToggle'

export default function Header({ mode, onModeChange }) {
  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b"
      style={{ backgroundColor: '#1E1A2E', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      {/* Left: OutcomeHQ wordmark */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Logomark square */}
          <div
            className="w-7 h-7 rounded flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: '#67579E' }}
          >
            HQ
          </div>
          <span className="text-white font-semibold text-base tracking-tight">
            outcome<span style={{ color: '#5C70D6' }}>HQ</span>
          </span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{ backgroundColor: 'rgba(103,87,158,0.25)', color: '#C4B5FD' }}
        >
          Tombras
        </span>
      </div>

      {/* Center: Mode toggle */}
      <ModeToggle mode={mode} onModeChange={onModeChange} />

      {/* Right: User context */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-xs font-medium text-white">Alexander Potts</div>
          <div className="text-[11px]" style={{ color: '#AFADAD' }}>
            Head of Ad Tech & Media Investment
          </div>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
          style={{ backgroundColor: '#4D4176' }}
        >
          AP
        </div>
      </div>
    </header>
  )
}
