export default function ModeToggle({ mode, onModeChange }) {
  return (
    <div className="flex items-center bg-attain-base rounded-full p-1 border border-white/10">
      <button
        onClick={() => onModeChange('executive')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          mode === 'executive'
            ? 'bg-attain-primary text-white shadow-sm'
            : 'text-attain-muted hover:text-white'
        }`}
      >
        Morning Coffee
      </button>
      <button
        onClick={() => onModeChange('manager')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          mode === 'manager'
            ? 'bg-attain-primary text-white shadow-sm'
            : 'text-attain-muted hover:text-white'
        }`}
      >
        Campaign Manager
      </button>
    </div>
  )
}
