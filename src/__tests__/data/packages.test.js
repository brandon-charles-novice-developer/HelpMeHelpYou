import { packages, packagesById, packagesByAdGroup } from '../../data/packages'
import { adGroups } from '../../data/adGroups'

describe('packages data', () => {
  describe('packages array', () => {
    it('has exactly 7 packages', () => {
      expect(packages).toHaveLength(7)
    })

    it('all packages have required fields', () => {
      const requiredFields = [
        'id', 'adGroupId', 'campaignId', 'clientId', 'name',
        'environment', 'format', 'budget', 'spent', 'impressions',
        'cpm', 'metrics',
      ]
      packages.forEach((p) => {
        requiredFields.forEach((field) => {
          expect(p).toHaveProperty(field)
        })
      })
    })

    it('all IDs are unique', () => {
      const ids = packages.map((p) => p.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('all packages reference valid ad group IDs', () => {
      const adGroupIds = new Set(adGroups.map((ag) => ag.id))
      packages.forEach((p) => {
        expect(adGroupIds.has(p.adGroupId)).toBe(true)
      })
    })

    it('environment is CTV or Display', () => {
      packages.forEach((p) => {
        expect(['CTV', 'Display']).toContain(p.environment)
      })
    })

    it('spent does not exceed budget', () => {
      packages.forEach((p) => {
        expect(p.spent).toBeLessThanOrEqual(p.budget)
      })
    })

    it('CPM is positive and in realistic range', () => {
      packages.forEach((p) => {
        expect(p.cpm).toBeGreaterThan(0)
        expect(p.cpm).toBeLessThan(50)
      })
    })

    it('metrics have conversionRate', () => {
      packages.forEach((p) => {
        expect(p.metrics.conversionRate).toBeGreaterThan(0)
        expect(p.metrics.conversionRate).toBeLessThan(1)
      })
    })
  })

  describe('packagesById map', () => {
    it('has 7 entries', () => {
      expect(Object.keys(packagesById)).toHaveLength(7)
    })

    it('maps IDs to correct objects', () => {
      packages.forEach((p) => {
        expect(packagesById[p.id]).toBe(p)
      })
    })
  })

  describe('packagesByAdGroup map', () => {
    it('groups packages by adGroupId', () => {
      Object.entries(packagesByAdGroup).forEach(([adGroupId, pkgs]) => {
        pkgs.forEach((p) => {
          expect(p.adGroupId).toBe(adGroupId)
        })
      })
    })

    it('total packages across all groups is 7', () => {
      const total = Object.values(packagesByAdGroup).reduce(
        (sum, arr) => sum + arr.length, 0
      )
      expect(total).toBe(7)
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Each package redundantly stores campaignId and clientId; these are derivable from the adGroupId → adGroup → campaign
 * - The metrics object varies (some have ctr, some don't); a consistent shape would simplify rendering
 * - CPM could be derived from spend/impressions * 1000 rather than stored independently
 * - The packagesByAdGroup map creation pattern is identical to campaignsByClient — a generic groupBy utility would DRY this
 * - Only 6 packages for 9 ad groups means some ad groups have no packages — this gap is not documented
 */
