import { creatives, creativesByDeal } from '../../data/creatives'

describe('creatives data — format-specific validation', () => {
  it('CTV creatives have completionRate and vtr', () => {
    creatives
      .filter((c) => c.format.includes('CTV'))
      .forEach((c) => {
        expect(c.metrics).toHaveProperty('completionRate')
        expect(c.metrics).toHaveProperty('vtr')
        expect(c.metrics.completionRate).toBeGreaterThan(0.8)
        expect(c.metrics.completionRate).toBeLessThanOrEqual(1)
        expect(c.metrics.vtr).toBeGreaterThan(0.8)
        expect(c.metrics.vtr).toBeLessThanOrEqual(1)
      })
  })

  it('CTV creatives are 1920x1080', () => {
    creatives
      .filter((c) => c.format.includes('CTV'))
      .forEach((c) => {
        expect(c.size).toBe('1920x1080')
      })
  })

  it('Display creatives have ctr', () => {
    creatives
      .filter((c) => c.format.includes('Display'))
      .forEach((c) => {
        expect(c.metrics).toHaveProperty('ctr')
        expect(c.metrics.ctr).toBeGreaterThan(0)
      })
  })

  it('creative names are descriptive (more than 10 characters)', () => {
    creatives.forEach((c) => {
      expect(c.name.length).toBeGreaterThan(10)
    })
  })

  it('each client has at least one creative', () => {
    const clientIds = new Set(creatives.map((c) => c.clientId))
    expect(clientIds.size).toBe(5) // All 5 clients represented
  })

  it('creative IDs follow naming convention', () => {
    creatives.forEach((c) => {
      expect(c.id).toMatch(/^[a-z]+-cr\d+$/)
    })
  })

  it('one deal can have multiple creatives', () => {
    const kayakDeal = 'kayak-c1-ag1-pk1-d1'
    const dealCreatives = creativesByDeal[kayakDeal]
    expect(dealCreatives.length).toBe(2) // Two Kayak creatives on same deal
  })

  it('impressions are in realistic range for display/CTV (1M-20M)', () => {
    creatives.forEach((c) => {
      expect(c.impressions).toBeGreaterThanOrEqual(1000000)
      expect(c.impressions).toBeLessThanOrEqual(20000000)
    })
  })

  it('all tags are strings', () => {
    creatives.forEach((c) => {
      c.tags.forEach((tag) => {
        expect(typeof tag).toBe('string')
        expect(tag.length).toBeGreaterThan(0)
      })
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The format-specific metric shapes (CTV gets completionRate/vtr, Display gets ctr) add complexity
 * - A normalized metrics object with null for inapplicable fields would simplify conditional rendering
 * - Creative IDs (kayak-cr1) don't encode the full hierarchy like other entities; inconsistent convention
 * - The Sponsored Content creative (indeed-cr1) doesn't follow CTV or Display patterns — a third format type
 * - The tags array uses free-text strings; a closed set of tag constants would prevent inconsistencies
 */
