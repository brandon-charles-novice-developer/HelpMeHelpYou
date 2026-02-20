import { campaigns, campaignsById, campaignsByClient } from '../../data/campaigns'
import { clients } from '../../data/clients'

describe('campaigns data', () => {
  describe('campaigns array', () => {
    it('has exactly 11 campaigns', () => {
      expect(campaigns).toHaveLength(11)
    })

    it('all campaigns have required fields', () => {
      const requiredFields = [
        'id', 'clientId', 'name', 'status', 'flightStart', 'flightEnd',
        'budget', 'spent', 'pacing', 'pacingStatus', 'buyingType', 'dsp',
        'impressions', 'reach', 'frequency', 'metrics',
      ]
      campaigns.forEach((c) => {
        requiredFields.forEach((field) => {
          expect(c).toHaveProperty(field)
        })
      })
    })

    it('all IDs are unique', () => {
      const ids = campaigns.map((c) => c.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('all campaigns reference valid client IDs', () => {
      const clientIds = new Set(clients.map((c) => c.id))
      campaigns.forEach((c) => {
        expect(clientIds.has(c.clientId)).toBe(true)
      })
    })

    it('all campaigns are active', () => {
      campaigns.forEach((c) => {
        expect(c.status).toBe('active')
      })
    })

    it('spent does not exceed budget', () => {
      campaigns.forEach((c) => {
        expect(c.spent).toBeLessThanOrEqual(c.budget)
      })
    })

    it('pacing is between 0 and 1', () => {
      campaigns.forEach((c) => {
        expect(c.pacing).toBeGreaterThanOrEqual(0)
        expect(c.pacing).toBeLessThanOrEqual(1)
      })
    })

    it('pacingStatus is a valid value', () => {
      const validStatuses = ['on_track', 'slight_overpace', 'underpacing']
      campaigns.forEach((c) => {
        expect(validStatuses).toContain(c.pacingStatus)
      })
    })

    it('flightStart is before flightEnd', () => {
      campaigns.forEach((c) => {
        expect(new Date(c.flightStart) < new Date(c.flightEnd)).toBe(true)
      })
    })
  })

  describe('campaign metrics', () => {
    it('each campaign has salesLiftData', () => {
      campaigns.forEach((c) => {
        expect(Array.isArray(c.metrics.salesLiftData)).toBe(true)
        expect(c.metrics.salesLiftData.length).toBe(12)
      })
    })

    it('salesLiftData entries have correct shape', () => {
      campaigns.forEach((c) => {
        c.metrics.salesLiftData.forEach((entry) => {
          expect(entry).toHaveProperty('week')
          expect(entry).toHaveProperty('observed')
          expect(entry).toHaveProperty('expected')
          expect(entry).toHaveProperty('incremental')
        })
      })
    })

    it('salesLiftData observed >= expected (positive lift)', () => {
      campaigns.forEach((c) => {
        c.metrics.salesLiftData.forEach((entry) => {
          expect(entry.observed).toBeGreaterThanOrEqual(entry.expected)
        })
      })
    })

    it('salesLiftData incremental is close to observed - expected (rounding tolerance)', () => {
      campaigns.forEach((c) => {
        c.metrics.salesLiftData.forEach((entry) => {
          // Math.round can introduce +-1 rounding differences
          expect(Math.abs(entry.incremental - (entry.observed - entry.expected))).toBeLessThanOrEqual(1)
        })
      })
    })

    it('conversionRate is between 0 and 1', () => {
      campaigns.forEach((c) => {
        expect(c.metrics.conversionRate).toBeGreaterThan(0)
        expect(c.metrics.conversionRate).toBeLessThan(1)
      })
    })
  })

  describe('campaignsById map', () => {
    it('has 11 entries', () => {
      expect(Object.keys(campaignsById)).toHaveLength(11)
    })

    it('maps IDs to correct campaign objects', () => {
      campaigns.forEach((c) => {
        expect(campaignsById[c.id]).toBe(c)
      })
    })
  })

  describe('campaignsByClient map', () => {
    it('has 5 client keys', () => {
      expect(Object.keys(campaignsByClient)).toHaveLength(5)
    })

    it('groups campaigns by clientId correctly', () => {
      Object.entries(campaignsByClient).forEach(([clientId, clientCampaigns]) => {
        clientCampaigns.forEach((c) => {
          expect(c.clientId).toBe(clientId)
        })
      })
    })

    it('total campaigns across all client groups is 11', () => {
      const total = Object.values(campaignsByClient).reduce(
        (sum, arr) => sum + arr.length, 0
      )
      expect(total).toBe(11)
    })

    it('Kayak has 3 campaigns', () => {
      expect(campaignsByClient.kayak).toHaveLength(3)
    })

    it('other clients have 2 campaigns each', () => {
      expect(campaignsByClient.newell).toHaveLength(2)
      expect(campaignsByClient.spirit).toHaveLength(2)
      expect(campaignsByClient.ricola).toHaveLength(2)
      expect(campaignsByClient.indeed).toHaveLength(2)
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - salesLiftSeries is a private function; exporting it would allow direct unit testing of the RNG
 * - Campaign IDs follow a convention (clientId-cN) that could be enforced or auto-generated
 * - The metrics sub-object duplicates some fields from the parent client metrics
 * - pacing could be derived from spent/budget rather than stored as a separate field
 * - The frequency field is never validated against impressions/reach ratio
 */
