// SectionLabel — uppercase muted section header with optional right slot

export default function SectionLabel({ children, right, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <span
        className="text-[11px] uppercase tracking-widest font-semibold"
        style={{ color: '#AFADAD' }}
      >
        {children}
      </span>
      {right && <div>{right}</div>}
    </div>
  )
}
