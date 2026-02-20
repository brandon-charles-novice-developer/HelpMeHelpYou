// StatusBadge — campaign/pacing/alert status pill

const variants = {
  active:           { bg: 'rgba(34, 197, 94, 0.15)',  color: '#22C55E',  label: 'Active' },
  on_track:         { bg: 'rgba(34, 197, 94, 0.15)',  color: '#22C55E',  label: 'On Track' },
  positive:         { bg: 'rgba(34, 197, 94, 0.15)',  color: '#22C55E',  label: null },
  paused:           { bg: 'rgba(175, 173, 173, 0.15)', color: '#AFADAD', label: 'Paused' },
  underpacing:      { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B',  label: 'Underpacing' },
  slight_overpace:  { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B',  label: 'Overpacing' },
  caution:          { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B',  label: null },
  ended:            { bg: 'rgba(239, 68, 68, 0.15)',  color: '#EF4444',  label: 'Ended' },
  negative:         { bg: 'rgba(239, 68, 68, 0.15)',  color: '#EF4444',  label: null },
  verified:         { bg: 'rgba(92, 112, 214, 0.15)', color: '#5C70D6',  label: 'Verified' },
  approved:         { bg: 'rgba(92, 112, 214, 0.15)', color: '#5C70D6',  label: 'Approved' },
}

export default function StatusBadge({ status, label: labelOverride, size = 'sm' }) {
  const variant = variants[status] || variants.active
  const text = labelOverride ?? variant.label ?? status

  const padding = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wider ${padding}`}
      style={{ backgroundColor: variant.bg, color: variant.color }}
    >
      {text}
    </span>
  )
}
