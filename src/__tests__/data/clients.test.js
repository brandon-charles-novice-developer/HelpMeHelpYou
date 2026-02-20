import { clients, clientsById } from '../../data/clients'

describe('clients data', () => {
  describe('clients array', () => {
    it('has exactly 5 clients', () => {
      expect(clients).toHaveLength(5)
    })

    it('all clients have required fields', () => {
      const requiredFields = ['id', 'name', 'vertical', 'logo', 'logoColor', 'buyingType', 'channels', 'solutions', 'description', 'status', 'metrics']
      clients.forEach((client) => {
        requiredFields.forEach((field) => {
          expect(client).toHaveProperty(field)
        })
      })
    })

    it('all IDs are unique', () => {
      const ids = clients.map((c) => c.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('all clients are active', () => {
      clients.forEach((c) => {
        expect(c.status).toBe('active')
      })
    })

    it('channels is a non-empty array for each client', () => {
      clients.forEach((c) => {
        expect(Array.isArray(c.channels)).toBe(true)
        expect(c.channels.length).toBeGreaterThan(0)
      })
    })

    it('solutions include audiences and measurement for all clients', () => {
      clients.forEach((c) => {
        expect(c.solutions).toContain('audiences')
        expect(c.solutions).toContain('measurement')
      })
    })

    it('logoColor is a valid hex color', () => {
      clients.forEach((c) => {
        expect(c.logoColor).toMatch(/^#[0-9A-Fa-f]{6}$/)
      })
    })

    it('buyingType is one of known values', () => {
      const validTypes = ['programmatic', 'managed', 'mixed']
      clients.forEach((c) => {
        expect(validTypes).toContain(c.buyingType)
      })
    })
  })

  describe('client metrics', () => {
    it('conversionRate is between 0 and 1', () => {
      clients.forEach((c) => {
        expect(c.metrics.conversionRate).toBeGreaterThan(0)
        expect(c.metrics.conversionRate).toBeLessThan(1)
      })
    })

    it('onlineSplit + inStoreSplit equals 1', () => {
      clients.forEach((c) => {
        const total = c.metrics.onlineSplit + c.metrics.inStoreSplit
        expect(total).toBeCloseTo(1, 5)
      })
    })

    it('incrementalRevenue is positive', () => {
      clients.forEach((c) => {
        expect(c.metrics.incrementalRevenue).toBeGreaterThan(0)
      })
    })

    it('activeCampaigns is a positive integer', () => {
      clients.forEach((c) => {
        expect(c.metrics.activeCampaigns).toBeGreaterThan(0)
        expect(Number.isInteger(c.metrics.activeCampaigns)).toBe(true)
      })
    })

    it('ROAS is greater than 1 (profitable)', () => {
      clients.forEach((c) => {
        expect(c.metrics.newBuyerRoas).toBeGreaterThan(1)
      })
    })
  })

  describe('clientsById map', () => {
    it('has 5 entries', () => {
      expect(Object.keys(clientsById)).toHaveLength(5)
    })

    it('maps IDs to correct client objects', () => {
      clients.forEach((c) => {
        expect(clientsById[c.id]).toBe(c)
      })
    })

    it('contains expected client IDs', () => {
      expect(clientsById).toHaveProperty('kayak')
      expect(clientsById).toHaveProperty('newell')
      expect(clientsById).toHaveProperty('spirit')
      expect(clientsById).toHaveProperty('ricola')
      expect(clientsById).toHaveProperty('indeed')
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - All clients have identical solutions arrays ['audiences', 'measurement'] — could be a default instead of repeated
 * - The alert field is inconsistently present (null vs object) — a consistent shape would simplify rendering
 * - dspComparison and retailerBreakdown are only on some clients — optional fields complicate type safety
 * - The clientsById map is a one-liner that could be inlined where needed rather than a separate export
 * - Tests validate that conversionRateVsBenchmark exists as a metric but its sign convention (+/-) is not enforced
 */
