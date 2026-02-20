import { shopperInsights } from '../../data/shopperInsights'

describe('shopperInsights — business logic validation', () => {
  const clientIds = Object.keys(shopperInsights)

  it('switching net = switchedFrom - switchedTo', () => {
    clientIds.forEach((id) => {
      shopperInsights[id].switching.competitors.forEach((comp) => {
        expect(comp.net).toBeCloseTo(comp.switchedFrom - comp.switchedTo, 5)
      })
    })
  })

  it('primary brand share is positive and less than 1', () => {
    clientIds.forEach((id) => {
      const share = shopperInsights[id].switching.primary.share
      expect(share).toBeGreaterThan(0)
      expect(share).toBeLessThan(1)
    })
  })

  it('most clients have negative net switching (losing share)', () => {
    clientIds.forEach((id) => {
      const nets = shopperInsights[id].switching.competitors.map((c) => c.net)
      const negativeCount = nets.filter((n) => n < 0).length
      expect(negativeCount).toBeGreaterThanOrEqual(nets.length / 2)
    })
  })

  it('loyalty hhiIndex varies across segments (not all the same)', () => {
    clientIds.forEach((id) => {
      const indices = shopperInsights[id].loyalty.segments.map((s) => s.hhiIndex)
      expect(new Set(indices).size).toBeGreaterThan(1)
    })
  })

  it('basket lift values are above 1 (above baseline co-purchase rate)', () => {
    clientIds.forEach((id) => {
      shopperInsights[id].basket.associations.forEach((a) => {
        expect(a.lift).toBeGreaterThan(1)
      })
    })
  })

  it('propensity labels are consistent with relative score ordering', () => {
    const labelRank = { 'Very High': 4, 'High': 3, 'Moderate': 2, 'Low': 1 }
    clientIds.forEach((id) => {
      shopperInsights[id].propensity.windows.forEach((w) => {
        expect(labelRank).toHaveProperty(w.label)
        // Scores 90+ should be at least High
        if (w.score >= 90) expect(labelRank[w.label]).toBeGreaterThanOrEqual(3)
        // Scores below 65 should be at most Moderate
        if (w.score < 65) expect(labelRank[w.label]).toBeLessThanOrEqual(2)
      })
    })
  })

  it('crossPurchase index > 100 for all pairs (above average)', () => {
    clientIds.forEach((id) => {
      shopperInsights[id].crossPurchase.pairs.forEach((p) => {
        expect(p.index).toBeGreaterThan(100)
      })
    })
  })

  it('Ricola has highest propensity scores (cold season peak)', () => {
    const ricolaMax = Math.max(
      ...shopperInsights.ricola.propensity.windows.map((w) => w.score)
    )
    clientIds
      .filter((id) => id !== 'ricola')
      .forEach((id) => {
        const otherMax = Math.max(
          ...shopperInsights[id].propensity.windows.map((w) => w.score)
        )
        expect(ricolaMax).toBeGreaterThanOrEqual(otherMax)
      })
  })

  it('each insight string is at least 50 characters', () => {
    clientIds.forEach((id) => {
      const modules = ['switching', 'loyalty', 'crossPurchase', 'basket', 'propensity']
      modules.forEach((mod) => {
        expect(shopperInsights[id][mod].insight.length).toBeGreaterThan(50)
      })
    })
  })

  it('category module does not have an insight field (data-only)', () => {
    clientIds.forEach((id) => {
      expect(shopperInsights[id].category).not.toHaveProperty('insight')
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The net switching calculation (switchedFrom - switchedTo) could be auto-derived rather than manually stored
 * - The propensity label-to-score mapping is duplicated from adGroups; should be a shared utility
 * - Insight strings being 50+ chars is a reasonable minimum but hard to maintain — generated insights from data would be more robust
 * - The category module being the only one without an insight field is an inconsistency worth documenting
 * - Ricola having the highest propensity is a business scenario; changing data would break this test
 */
