export default function ModeToggle({ mode, onModeChange }) {
  return (
    <div
      className="flex items-center rounded-full p-1"
      style={{
        background: 'rgba(30, 26, 46, 0.50)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        WebkitBackdropFilter: 'blur(8px)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <button
        onClick={() => onModeChange('executive')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          mode === 'executive'
            ? 'text-white shadow-sm'
            : 'text-attain-muted hover:text-white'
        }`}
        style={mode === 'executive' ? {
          background: 'rgba(103, 87, 158, 0.5)',
          WebkitBackdropFilter: 'blur(6px)',
          backdropFilter: 'blur(6px)',
        } : undefined}
      >
        Morning Coffee
      </button>
      <button
        onClick={() => onModeChange('manager')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          mode === 'manager'
            ? 'text-white shadow-sm'
            : 'text-attain-muted hover:text-white'
        }`}
        style={mode === 'manager' ? {
          background: 'rgba(103, 87, 158, 0.5)',
          WebkitBackdropFilter: 'blur(6px)',
          backdropFilter: 'blur(6px)',
        } : undefined}
      >
        Campaign Manager
      </button>
    </div>
  )
}
