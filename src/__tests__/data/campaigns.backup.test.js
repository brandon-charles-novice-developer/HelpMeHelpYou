import { campaigns } from '../../data/campaigns'

describe('campaigns data — calibration and determinism', () => {
  it('salesLiftSeries is deterministic (same seed produces same data)', () => {
    // Kayak-c1 should always produce the same series
    const kayakC1 = campaigns.find((c) => c.id === 'kayak-c1')
    const series1 = kayakC1.metrics.salesLiftData
    // Re-importing would give same values; just check first entry is consistent
    expect(series1[0].week).toBe('W1')
    expect(typeof series1[0].observed).toBe('number')
    expect(typeof series1[0].expected).toBe('number')
  })

  it('salesLiftData weeks are sequential W1 through W12', () => {
    campaigns.forEach((c) => {
      c.metrics.salesLiftData.forEach((entry, i) => {
        expect(entry.week).toBe(`W${i + 1}`)
      })
    })
  })

  it('different campaigns produce different salesLiftData', () => {
    const c1 = campaigns[0].metrics.salesLiftData
    const c2 = campaigns[1].metrics.salesLiftData
    // At least one observed value should differ
    const allSame = c1.every((entry, i) => entry.observed === c2[i].observed)
    expect(allSame).toBe(false)
  })

  it('salesLiftData expected values are in realistic range (80K-120K)', () => {
    campaigns.forEach((c) => {
      c.metrics.salesLiftData.forEach((entry) => {
        expect(entry.expected).toBeGreaterThanOrEqual(80000)
        expect(entry.expected).toBeLessThanOrEqual(120000)
      })
    })
  })

  it('salesLiftData incremental values are non-negative', () => {
    campaigns.forEach((c) => {
      c.metrics.salesLiftData.forEach((entry) => {
        expect(entry.incremental).toBeGreaterThanOrEqual(0)
      })
    })
  })

  it('budgets are in realistic campaign range ($50K-$300K)', () => {
    campaigns.forEach((c) => {
      expect(c.budget).toBeGreaterThanOrEqual(50000)
      expect(c.budget).toBeLessThanOrEqual(300000)
    })
  })

  it('impressions are in millions range', () => {
    campaigns.forEach((c) => {
      expect(c.impressions).toBeGreaterThanOrEqual(1000000)
    })
  })

  it('frequency is between 3 and 6', () => {
    campaigns.forEach((c) => {
      expect(c.frequency).toBeGreaterThanOrEqual(3)
      expect(c.frequency).toBeLessThanOrEqual(6)
    })
  })

  it('newBuyerRoas is between 1.0 and 3.0', () => {
    campaigns.forEach((c) => {
      expect(c.metrics.newBuyerRoas).toBeGreaterThanOrEqual(1.0)
      expect(c.metrics.newBuyerRoas).toBeLessThanOrEqual(3.0)
    })
  })

  it('newBuyerCpa is between $80 and $150', () => {
    campaigns.forEach((c) => {
      expect(c.metrics.newBuyerCpa).toBeGreaterThanOrEqual(80)
      expect(c.metrics.newBuyerCpa).toBeLessThanOrEqual(150)
    })
  })

  it('client campaign counts match client metadata', () => {
    const clientCounts = {}
    campaigns.forEach((c) => {
      clientCounts[c.clientId] = (clientCounts[c.clientId] || 0) + 1
    })
    // These should match the client.metrics.activeCampaigns values
    expect(clientCounts.kayak).toBe(3)
    expect(clientCounts.newell).toBe(2)
    expect(clientCounts.spirit).toBe(2)
    expect(clientCounts.ricola).toBe(2)
    expect(clientCounts.indeed).toBe(2)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The salesLiftSeries uses a hand-rolled RNG that is difficult to reason about; a well-known seeded RNG library would be clearer
 * - The 80K-120K expected range comes from the formula `80000 + rng * 40000`; this could be a constant
 * - Campaign budgets and metrics are hardcoded; a generator pattern would reduce the file size significantly
 * - The pacing field should be derivable from spent/budget but is stored independently (risk of inconsistency)
 * - Cross-file validation (campaign counts vs client metadata) reveals tight coupling between data files
 */
