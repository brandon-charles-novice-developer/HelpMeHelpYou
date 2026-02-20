// BuyingTypeBadge — channel/buying-method label pill

const config = {
  programmatic: { label: 'Programmatic', bg: 'rgba(92, 112, 214, 0.15)', color: '#5C70D6' },
  managed:      { label: 'Managed Service', bg: 'rgba(196, 181, 253, 0.15)', color: '#C4B5FD' },
  mixed:        { label: 'Prog + Managed', bg: 'rgba(45, 212, 191, 0.15)', color: '#2DD4BF' },
  retail_media: { label: 'Retail Media', bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' },
  direct_io:    { label: 'Direct IO', bg: 'rgba(175, 173, 173, 0.15)', color: '#AFADAD' },
  pmp:          { label: 'PMP', bg: 'rgba(103, 87, 158, 0.2)', color: '#9F8FC8' },
  pg:           { label: 'PG', bg: 'rgba(103, 87, 158, 0.2)', color: '#C4B5FD' },
}

export default function BuyingTypeBadge({ type, label: labelOverride }) {
  const variant = config[type?.toLowerCase()] || config.programmatic
  const text = labelOverride ?? variant.label

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: variant.bg, color: variant.color }}
    >
      {text}
    </span>
  )
}
