// Live transaction feed — rotating brand entries for the live scroll panel
// Calibrated to Attain's live dashboard reference brands

export const feedBrands = [
  { name: 'Kroger', category: 'Grocery', color: '#004990', initial: 'K' },
  { name: 'Panda Express', category: 'Food & Drink', color: '#C8102E', initial: 'P' },
  { name: 'Walmart', category: 'General Merchandise', color: '#0071CE', initial: 'W' },
  { name: 'Target', category: 'General Merchandise', color: '#CC0000', initial: 'T' },
  { name: 'FanDuel', category: 'Entertainment', color: '#1493FF', initial: 'F' },
  { name: 'Uber', category: 'Transportation', color: '#000000', initial: 'U' },
  { name: 'Starbucks', category: 'Food & Drink', color: '#00704A', initial: 'S' },
  { name: 'Chick-fil-A', category: 'Food & Drink', color: '#E4002B', initial: 'C' },
  { name: 'Amazon', category: 'E-Commerce', color: '#FF9900', initial: 'A' },
  { name: 'CVS', category: 'Health & Wellness', color: '#CC0000', initial: 'C' },
  { name: 'Home Depot', category: 'Home Improvement', color: '#F96302', initial: 'H' },
  { name: 'DoorDash', category: 'Food Delivery', color: '#FF3008', initial: 'D' },
  { name: 'Walgreens', category: 'Health & Wellness', color: '#E31837', initial: 'W' },
  { name: 'McDonald\'s', category: 'Food & Drink', color: '#FFC72C', initial: 'M' },
  { name: 'Nike', category: 'Apparel', color: '#111111', initial: 'N' },
  { name: 'Best Buy', category: 'Electronics', color: '#003087', initial: 'B' },
  { name: 'Costco', category: 'Wholesale / Grocery', color: '#005DAA', initial: 'C' },
  { name: 'TJ Maxx', category: 'Apparel', color: '#C41230', initial: 'T' },
]

const amounts = [
  8.49, 12.99, 18.50, 24.99, 32.00, 41.75, 52.40, 67.00, 78.99, 88.50,
  94.00, 107.25, 124.99, 138.00, 152.75, 164.00, 189.99, 211.50, 244.00, 298.00,
]

const channels = ['In store', 'In store', 'In store', 'Online', 'Online']

function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Generate a seeded batch of feed entries for initial render
export function generateFeedBatch(count = 20, seedOffset = 0) {
  const rand = rng(42 + seedOffset)

  return Array.from({ length: count }, (_, i) => {
    const brand = feedBrands[Math.floor(rand() * feedBrands.length)]
    const amount = amounts[Math.floor(rand() * amounts.length)]
    const channel = channels[Math.floor(rand() * channels.length)]

    return {
      id: `feed-${seedOffset}-${i}`,
      brand: brand.name,
      category: brand.category,
      color: brand.color,
      initial: brand.initial,
      amount,
      channel,
      ts: Date.now() - (count - i) * 2800,
    }
  })
}

// Generate a single new feed entry (call on interval)
let _entryCount = 1000

export function generateFeedEntry() {
  _entryCount++
  const rand = rng(_entryCount * 137 + Date.now() % 9999)
  const brand = feedBrands[Math.floor(rand() * feedBrands.length)]
  const amount = amounts[Math.floor(rand() * amounts.length)]
  const channel = channels[Math.floor(rand() * channels.length)]

  return {
    id: `feed-live-${_entryCount}`,
    brand: brand.name,
    category: brand.category,
    color: brand.color,
    initial: brand.initial,
    amount,
    channel,
    ts: Date.now(),
  }
}
