import { creatives, creativesById, creativesByDeal } from '../../data/creatives'
import { deals } from '../../data/deals'

describe('creatives data', () => {
  describe('creatives array', () => {
    it('has exactly 6 creatives', () => {
      expect(creatives).toHaveLength(6)
    })

    it('all creatives have required fields', () => {
      const requiredFields = [
        'id', 'dealId', 'clientId', 'name', 'format', 'size',
        'status', 'approvalStatus', 'flightStart', 'flightEnd',
        'impressions', 'metrics', 'tags',
      ]
      creatives.forEach((c) => {
        requiredFields.forEach((field) => {
          expect(c).toHaveProperty(field)
        })
      })
    })

    it('all IDs are unique', () => {
      const ids = creatives.map((c) => c.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('all creatives reference valid deal IDs', () => {
      const dealIds = new Set(deals.map((d) => d.id))
      creatives.forEach((c) => {
        expect(dealIds.has(c.dealId)).toBe(true)
      })
    })

    it('all creatives are active and approved', () => {
      creatives.forEach((c) => {
        expect(c.status).toBe('active')
        expect(c.approvalStatus).toBe('approved')
      })
    })

    it('tags is a non-empty array', () => {
      creatives.forEach((c) => {
        expect(Array.isArray(c.tags)).toBe(true)
        expect(c.tags.length).toBeGreaterThan(0)
      })
    })

    it('flightStart is before flightEnd', () => {
      creatives.forEach((c) => {
        expect(new Date(c.flightStart) < new Date(c.flightEnd)).toBe(true)
      })
    })

    it('impressions are positive', () => {
      creatives.forEach((c) => {
        expect(c.impressions).toBeGreaterThan(0)
      })
    })

    it('metrics have conversionRate', () => {
      creatives.forEach((c) => {
        expect(c.metrics.conversionRate).toBeGreaterThan(0)
        expect(c.metrics.conversionRate).toBeLessThan(1)
      })
    })
  })

  describe('creativesById map', () => {
    it('has 6 entries', () => {
      expect(Object.keys(creativesById)).toHaveLength(6)
    })

    it('maps IDs to correct objects', () => {
      creatives.forEach((c) => {
        expect(creativesById[c.id]).toBe(c)
      })
    })
  })

  describe('creativesByDeal map', () => {
    it('groups creatives by dealId', () => {
      Object.entries(creativesByDeal).forEach(([dealId, dealCreatives]) => {
        dealCreatives.forEach((c) => {
          expect(c.dealId).toBe(dealId)
        })
      })
    })

    it('total creatives across all groups is 6', () => {
      const total = Object.values(creativesByDeal).reduce(
        (sum, arr) => sum + arr.length, 0
      )
      expect(total).toBe(6)
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - All creatives are 'active' and 'approved' — these fields serve no purpose in a demo where nothing is inactive
 * - The metrics object shape varies (CTV has completionRate/vtr, Display has ctr/viewability, Social has ctr/engagementRate)
 * - This inconsistent shape makes rendering logic harder; a unified metrics shape would be better
 * - The tags array is useful but not used for filtering in the current codebase; could be removed or utilized
 * - CTV creatives are all 1920x1080; this redundancy could be derived from the format field
 */
