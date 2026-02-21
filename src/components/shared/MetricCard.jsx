// MetricCard — general-purpose KPI tile used throughout the dashboard

export default function MetricCard({
  label,
  value,
  delta,
  deltaPositive,
  sublabel,
  accent = false,
  className = '',
}) {
  const deltaColor =
    deltaPositive === true
      ? '#22C55E'
      : deltaPositive === false
      ? '#EF4444'
      : '#AFADAD'

  return (
    <div
      className={`glass-card rounded-card p-5 flex flex-col gap-1 transition-all duration-200 hover:-translate-y-0.5 ${className}`}
    >
      <div
        className="text-[11px] uppercase tracking-widest font-semibold"
        style={{ color: '#AFADAD' }}
      >
        {label}
      </div>

      <div className="text-3xl font-bold text-white leading-tight mt-1">
        {value}
      </div>

      {delta && (
        <div className="text-xs font-medium mt-0.5" style={{ color: deltaColor }}>
          {delta}
        </div>
      )}

      {sublabel && (
        <div className="text-xs mt-0.5" style={{ color: '#AFADAD' }}>
          {sublabel}
        </div>
      )}
    </div>
  )
}
