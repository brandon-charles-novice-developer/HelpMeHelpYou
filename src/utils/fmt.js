export function fmt(n, type) {
  switch (type) {
    case '$':
      if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`
      if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
      return `$${n}`
    case '$full':
      return `$${n.toFixed(2)}`
    case 'x':
      return `${n.toFixed(2)}x`
    case '%':
      return `${Math.round(n)}%`
    case '#':
      if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
      return Math.round(n).toLocaleString()
    default:
      return String(n)
  }
}
