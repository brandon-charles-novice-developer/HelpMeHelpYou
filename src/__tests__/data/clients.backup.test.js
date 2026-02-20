import { clients, clientsById } from '../../data/clients'

describe('clients data — business logic and domain validation', () => {
  it('total incremental revenue across all clients is in realistic range', () => {
    const total = clients.reduce((sum, c) => sum + c.metrics.incrementalRevenue, 0)
    // Should be in the millions range
    expect(total).toBeGreaterThan(5000000)
    expect(total).toBeLessThan(50000000)
  })

  it('total active campaigns across all clients is 11', () => {
    const total = clients.reduce((sum, c) => sum + c.metrics.activeCampaigns, 0)
    expect(total).toBe(11)
  })

  it('each client has unique name', () => {
    const names = clients.map((c) => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('each client has unique vertical', () => {
    const verticals = clients.map((c) => c.vertical)
    expect(new Set(verticals).size).toBe(verticals.length)
  })

  it('CPG clients have retailerBreakdown', () => {
    const cpgClients = clients.filter((c) => c.vertical.includes('CPG'))
    cpgClients.forEach((c) => {
      expect(c.retailerBreakdown).toBeDefined()
      expect(Array.isArray(c.retailerBreakdown)).toBe(true)
    })
  })

  it('retailer breakdown shares sum to 1', () => {
    clients
      .filter((c) => c.retailerBreakdown)
      .forEach((c) => {
        const total = c.retailerBreakdown.reduce((sum, r) => sum + r.share, 0)
        expect(total).toBeCloseTo(1, 5)
      })
  })

  it('Kayak has dspComparison data', () => {
    const kayak = clientsById.kayak
    expect(kayak.dspComparison).toBeDefined()
    expect(kayak.dspComparison).toHaveLength(2)
    kayak.dspComparison.forEach((d) => {
      expect(d).toHaveProperty('dsp')
      expect(d).toHaveProperty('cvr')
      expect(d).toHaveProperty('spend')
    })
  })

  it('alerts have valid type when present', () => {
    clients
      .filter((c) => c.alert)
      .forEach((c) => {
        expect(['caution', 'positive']).toContain(c.alert.type)
        expect(c.alert.message.length).toBeGreaterThan(0)
      })
  })

  it('newBuyerCpa is positive and realistic', () => {
    clients.forEach((c) => {
      expect(c.metrics.newBuyerCpa).toBeGreaterThan(50)
      expect(c.metrics.newBuyerCpa).toBeLessThan(500)
    })
  })

  it('newBuyerAvgTransaction is positive', () => {
    clients.forEach((c) => {
      expect(c.metrics.newBuyerAvgTransaction).toBeGreaterThan(0)
      expect(c.metrics.newBuyerAvgTransaction).toBeLessThan(200)
    })
  })

  it('conversionRate is above CTV benchmark of 2.8%', () => {
    clients.forEach((c) => {
      expect(c.metrics.conversionRate).toBeGreaterThan(0.028)
    })
  })

  it('conversionRateVsBenchmark is positive for all clients', () => {
    clients.forEach((c) => {
      expect(c.metrics.conversionRateVsBenchmark).toBeGreaterThan(0)
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The backup tests catch business-level invariants (all clients above benchmark, retailer shares sum to 1)
 * - These invariants could be enforced by a schema validator at build time rather than in tests
 * - The total campaign count (11) matching agency.activeCampaigns would be a better cross-file test
 * - Alert types could use an enum/constant to prevent typos
 * - Several metrics (newBuyerCpa, conversionRate) have implicit ranges not documented in the source
 */
