import { feedBrands, generateFeedBatch, generateFeedEntry } from '../../data/transactionFeed'

describe('transactionFeed data', () => {
  describe('feedBrands', () => {
    it('has 18 brands', () => {
      expect(feedBrands).toHaveLength(18)
    })

    it('each brand has required fields', () => {
      feedBrands.forEach((b) => {
        expect(b).toHaveProperty('name')
        expect(b).toHaveProperty('category')
        expect(b).toHaveProperty('color')
        expect(b).toHaveProperty('initial')
      })
    })

    it('all brand names are non-empty', () => {
      feedBrands.forEach((b) => {
        expect(b.name.length).toBeGreaterThan(0)
      })
    })

    it('colors are valid hex codes', () => {
      feedBrands.forEach((b) => {
        expect(b.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      })
    })

    it('initials are single characters', () => {
      feedBrands.forEach((b) => {
        expect(b.initial).toHaveLength(1)
      })
    })

    it('categories are non-empty', () => {
      feedBrands.forEach((b) => {
        expect(b.category.length).toBeGreaterThan(0)
      })
    })
  })

  describe('generateFeedBatch', () => {
    it('generates default 20 entries', () => {
      const batch = generateFeedBatch()
      expect(batch).toHaveLength(20)
    })

    it('generates custom count', () => {
      const batch = generateFeedBatch(10)
      expect(batch).toHaveLength(10)
    })

    it('entries have correct shape', () => {
      const batch = generateFeedBatch(5)
      batch.forEach((entry) => {
        expect(entry).toHaveProperty('id')
        expect(entry).toHaveProperty('brand')
        expect(entry).toHaveProperty('category')
        expect(entry).toHaveProperty('color')
        expect(entry).toHaveProperty('initial')
        expect(entry).toHaveProperty('amount')
        expect(entry).toHaveProperty('channel')
        expect(entry).toHaveProperty('ts')
      })
    })

    it('IDs are unique within a batch', () => {
      const batch = generateFeedBatch(20)
      const ids = batch.map((e) => e.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('brands come from feedBrands', () => {
      const brandNames = feedBrands.map((b) => b.name)
      const batch = generateFeedBatch(50)
      batch.forEach((entry) => {
        expect(brandNames).toContain(entry.brand)
      })
    })

    it('channels are In store or Online', () => {
      const batch = generateFeedBatch(50)
      batch.forEach((entry) => {
        expect(['In store', 'Online']).toContain(entry.channel)
      })
    })

    it('amounts come from predefined list', () => {
      const validAmounts = [
        8.49, 12.99, 18.50, 24.99, 32.00, 41.75, 52.40, 67.00, 78.99, 88.50,
        94.00, 107.25, 124.99, 138.00, 152.75, 164.00, 189.99, 211.50, 244.00, 298.00,
      ]
      const batch = generateFeedBatch(50)
      batch.forEach((entry) => {
        expect(validAmounts).toContain(entry.amount)
      })
    })

    it('is deterministic (same seed produces same batch)', () => {
      const batch1 = generateFeedBatch(10, 0)
      const batch2 = generateFeedBatch(10, 0)
      batch1.forEach((entry, i) => {
        expect(entry.brand).toBe(batch2[i].brand)
        expect(entry.amount).toBe(batch2[i].amount)
        expect(entry.channel).toBe(batch2[i].channel)
      })
    })

    it('different seed offsets produce different batches', () => {
      const batch1 = generateFeedBatch(10, 0)
      const batch2 = generateFeedBatch(10, 100)
      const allSame = batch1.every((e, i) => e.brand === batch2[i].brand)
      expect(allSame).toBe(false)
    })
  })

  describe('generateFeedEntry', () => {
    it('returns a single entry with correct shape', () => {
      const entry = generateFeedEntry()
      expect(entry).toHaveProperty('id')
      expect(entry).toHaveProperty('brand')
      expect(entry).toHaveProperty('category')
      expect(entry).toHaveProperty('color')
      expect(entry).toHaveProperty('initial')
      expect(entry).toHaveProperty('amount')
      expect(entry).toHaveProperty('channel')
      expect(entry).toHaveProperty('ts')
    })

    it('ID starts with feed-live-', () => {
      const entry = generateFeedEntry()
      expect(entry.id).toMatch(/^feed-live-\d+$/)
    })

    it('generates different entries on consecutive calls', () => {
      const e1 = generateFeedEntry()
      const e2 = generateFeedEntry()
      expect(e1.id).not.toBe(e2.id)
    })

    it('timestamp is close to current time', () => {
      const before = Date.now()
      const entry = generateFeedEntry()
      const after = Date.now()
      expect(entry.ts).toBeGreaterThanOrEqual(before)
      expect(entry.ts).toBeLessThanOrEqual(after)
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - feedBrands could be loaded from a JSON file instead of hardcoded in a JS module
 * - The amounts array is predefined but not documented why those specific values were chosen
 * - The channels array ['In store', 'In store', 'In store', 'Online', 'Online'] biases 60% in-store; this is implicit
 * - The seeded RNG is a custom implementation; a well-known PRNG like mulberry32 would be more trustworthy
 * - The _entryCount module-level variable makes generateFeedEntry stateful; this can cause test interference
 */
