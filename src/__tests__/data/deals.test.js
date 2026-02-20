import { deals, dealsById, dealsByPackage } from '../../data/deals'

describe('deals data', () => {
  describe('deals array', () => {
    it('has exactly 7 deals', () => {
      expect(deals).toHaveLength(7)
    })

    it('all deals have required fields', () => {
      const requiredFields = [
        'id', 'packageId', 'clientId', 'name', 'dealType', 'dealId',
        'publisher', 'format', 'cpm', 'impressionsBought', 'spend', 'metrics',
      ]
      deals.forEach((d) => {
        requiredFields.forEach((field) => {
          expect(d).toHaveProperty(field)
        })
      })
    })

    it('all IDs are unique', () => {
      const ids = deals.map((d) => d.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('all dealId codes are unique', () => {
      const dealCodes = deals.map((d) => d.dealId)
      expect(new Set(dealCodes).size).toBe(dealCodes.length)
    })

    it('dealType is a valid value', () => {
      const validTypes = ['PMP', 'PG', 'IO', 'Retail Media', 'Open Auction']
      deals.forEach((d) => {
        expect(validTypes).toContain(d.dealType)
      })
    })

    it('CPM is positive', () => {
      deals.forEach((d) => {
        expect(d.cpm).toBeGreaterThan(0)
      })
    })

    it('impressionsBought is positive', () => {
      deals.forEach((d) => {
        expect(d.impressionsBought).toBeGreaterThan(0)
      })
    })

    it('metrics have conversionRate and viewability', () => {
      deals.forEach((d) => {
        expect(d.metrics.conversionRate).toBeGreaterThan(0)
        expect(d.metrics.viewability).toBeGreaterThan(0)
        expect(d.metrics.viewability).toBeLessThanOrEqual(1)
      })
    })
  })

  describe('dealsById map', () => {
    it('has 7 entries', () => {
      expect(Object.keys(dealsById)).toHaveLength(7)
    })

    it('maps IDs to correct objects', () => {
      deals.forEach((d) => {
        expect(dealsById[d.id]).toBe(d)
      })
    })
  })

  describe('dealsByPackage map', () => {
    it('groups deals by packageId', () => {
      Object.entries(dealsByPackage).forEach(([packageId, pkgDeals]) => {
        pkgDeals.forEach((d) => {
          expect(d.packageId).toBe(packageId)
        })
      })
    })

    it('total deals across all groups is 7', () => {
      const total = Object.values(dealsByPackage).reduce(
        (sum, arr) => sum + arr.length, 0
      )
      expect(total).toBe(7)
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The dealId field (e.g., 'DID-HUL-74821') is a display-only identifier separate from the internal id; one could serve both purposes
 * - One deal references packageId 'indeed-c2-ag1-pk1' which does not exist in packages.js — a data integrity gap
 * - The metrics object shape varies (some have viewability, some don't in real scenarios); a consistent shape would help
 * - Deal CPMs range from $8 to $48 which is realistic but could be documented with valid ranges
 * - The dealsByPackage map uses the same groupBy pattern as every other data file — a shared utility would reduce duplication
 */
