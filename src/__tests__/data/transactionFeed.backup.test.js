import { feedBrands, generateFeedBatch } from '../../data/transactionFeed'

describe('transactionFeed — RNG distribution and edge cases', () => {
  it('channel distribution is roughly 60% in-store, 40% online', () => {
    const batch = generateFeedBatch(200, 42)
    const inStore = batch.filter((e) => e.channel === 'In store').length
    const online = batch.filter((e) => e.channel === 'Online').length
    // Should be roughly 60/40 with some variance
    expect(inStore / batch.length).toBeGreaterThan(0.4)
    expect(inStore / batch.length).toBeLessThan(0.8)
    expect(online).toBeGreaterThan(0)
  })

  it('brand distribution covers most brands in a large batch', () => {
    const batch = generateFeedBatch(200, 99)
    const uniqueBrands = new Set(batch.map((e) => e.brand))
    // With 18 brands and 200 entries, should hit most of them
    expect(uniqueBrands.size).toBeGreaterThan(10)
  })

  it('amount distribution covers the full range', () => {
    const batch = generateFeedBatch(200, 77)
    const amounts = new Set(batch.map((e) => e.amount))
    // Should hit a good portion of the 20 predefined amounts
    expect(amounts.size).toBeGreaterThan(8)
  })

  it('timestamps in a batch are sequential (ascending)', () => {
    const batch = generateFeedBatch(20, 0)
    for (let i = 1; i < batch.length; i++) {
      expect(batch[i].ts).toBeGreaterThan(batch[i - 1].ts)
    }
  })

  it('batch IDs include seed offset for uniqueness', () => {
    const batch1 = generateFeedBatch(5, 10)
    const batch2 = generateFeedBatch(5, 20)
    batch1.forEach((e) => {
      expect(e.id).toMatch(/^feed-10-\d+$/)
    })
    batch2.forEach((e) => {
      expect(e.id).toMatch(/^feed-20-\d+$/)
    })
  })

  it('generateFeedBatch with count 0 returns empty array', () => {
    const batch = generateFeedBatch(0)
    expect(batch).toHaveLength(0)
  })

  it('generateFeedBatch with count 1 returns single entry', () => {
    const batch = generateFeedBatch(1)
    expect(batch).toHaveLength(1)
  })

  it('all brands have a recognized category', () => {
    const validCategories = [
      'Grocery', 'Food & Drink', 'General Merchandise', 'Entertainment',
      'Transportation', 'E-Commerce', 'Health & Wellness', 'Home Improvement',
      'Food Delivery', 'Apparel', 'Electronics', 'Wholesale / Grocery',
    ]
    feedBrands.forEach((b) => {
      expect(validCategories).toContain(b.category)
    })
  })

  it('RNG does not produce values outside [0, 1)', () => {
    // Indirectly tested: brands and amounts are always valid selections
    // If RNG produced negative or >= 1, array indexing would break
    const batch = generateFeedBatch(500, 0)
    batch.forEach((e) => {
      expect(e.brand).toBeDefined()
      expect(e.amount).toBeDefined()
      expect(e.channel).toBeDefined()
    })
  })

  it('large batch does not have adjacent identical entries', () => {
    const batch = generateFeedBatch(50, 0)
    for (let i = 1; i < batch.length; i++) {
      // Not all fields should be identical
      const same = batch[i].brand === batch[i - 1].brand &&
        batch[i].amount === batch[i - 1].amount &&
        batch[i].channel === batch[i - 1].channel
      // This could happen by chance, but shouldn't happen repeatedly
      if (i > 2) {
        const prevSame = batch[i - 1].brand === batch[i - 2].brand &&
          batch[i - 1].amount === batch[i - 2].amount
        expect(same && prevSame).toBe(false) // 3 identical in a row is suspicious
      }
    }
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The RNG quality is tested indirectly through distribution; a statistical test (chi-squared) would be more rigorous but overkill
 * - The channel distribution bias (60/40 in-store/online) is created by array repetition, not explicit weights — a weighted random would be clearer
 * - The _entryCount module state means generateFeedEntry tests can be order-dependent across test files
 * - The seeded RNG uses a linear congruential generator; the constants (16807, 2147483647) are from a known PRNG
 * - Edge case tests (count=0, count=1) are valuable but the function doesn't validate negative counts
 */
