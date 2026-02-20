// LiveDot — pulsing green indicator used in TransactionFeed and live stats

export default function LiveDot({ size = 8, className = '' }) {
  return (
    <span
      className={`live-pulse inline-block rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: '#22C55E',
        boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)',
        flexShrink: 0,
      }}
    />
  )
}
