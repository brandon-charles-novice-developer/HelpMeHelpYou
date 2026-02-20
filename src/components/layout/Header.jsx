import ModeToggle from './ModeToggle'
import AttainLogo from './AttainLogo'

export default function Header({ mode, onModeChange }) {
  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b"
      style={{ backgroundColor: '#1E1A2E', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      {/* Left: Attain logo + OutcomeHQ wordmark */}
      <div className="flex items-center gap-4">
        <AttainLogo height={22} color="#FFFFFF" />
        <div
          className="h-5"
          style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.15)' }}
        />
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm tracking-tight">
            outcome<span style={{ color: '#5C70D6' }}>HQ</span>
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ backgroundColor: 'rgba(103,87,158,0.25)', color: '#C4B5FD' }}
          >
            Tombras
          </span>
        </div>
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
