import { adGroups, adGroupsById, adGroupsByCampaign } from '../../data/adGroups'
import { campaigns } from '../../data/campaigns'

describe('adGroups data', () => {
  describe('adGroups array', () => {
    it('has exactly 9 ad groups', () => {
      expect(adGroups).toHaveLength(9)
    })

    it('all ad groups have required fields', () => {
      const requiredFields = [
        'id', 'campaignId', 'clientId', 'name', 'audienceType',
        'audienceSegment', 'audienceSize', 'verificationStatus',
        'propensityWindows', 'selfReportedFilter', 'metrics',
      ]
      adGroups.forEach((ag) => {
        requiredFields.forEach((field) => {
          expect(ag).toHaveProperty(field)
        })
      })
    })

    it('all IDs are unique', () => {
      const ids = adGroups.map((ag) => ag.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('all ad groups reference valid campaign IDs', () => {
      const campaignIds = new Set(campaigns.map((c) => c.id))
      adGroups.forEach((ag) => {
        expect(campaignIds.has(ag.campaignId)).toBe(true)
      })
    })

    it('all audienceType is Outcome Audience', () => {
      adGroups.forEach((ag) => {
        expect(ag.audienceType).toBe('Outcome Audience')
      })
    })

    it('all are verified', () => {
      adGroups.forEach((ag) => {
        expect(ag.verificationStatus).toBe('verified')
      })
    })

    it('audienceSize is positive', () => {
      adGroups.forEach((ag) => {
        expect(ag.audienceSize).toBeGreaterThan(0)
      })
    })
  })

  describe('propensity windows', () => {
    it('each ad group has 4 propensity windows', () => {
      adGroups.forEach((ag) => {
        expect(ag.propensityWindows).toHaveLength(4)
      })
    })

    it('windows cover 10, 30, 60, 90 day periods', () => {
      adGroups.forEach((ag) => {
        const windows = ag.propensityWindows.map((w) => w.window)
        expect(windows).toEqual(['10-day', '30-day', '60-day', '90-day'])
      })
    })

    it('scores are between 0 and 100', () => {
      adGroups.forEach((ag) => {
        ag.propensityWindows.forEach((w) => {
          expect(w.score).toBeGreaterThan(0)
          expect(w.score).toBeLessThanOrEqual(100)
        })
      })
    })

    it('labels are valid tier names', () => {
      const validLabels = ['Low', 'Moderate', 'High', 'Very High']
      adGroups.forEach((ag) => {
        ag.propensityWindows.forEach((w) => {
          expect(validLabels).toContain(w.label)
        })
      })
    })
  })

  describe('adGroupsById map', () => {
    it('has 9 entries', () => {
      expect(Object.keys(adGroupsById)).toHaveLength(9)
    })

    it('maps IDs to correct objects', () => {
      adGroups.forEach((ag) => {
        expect(adGroupsById[ag.id]).toBe(ag)
      })
    })
  })

  describe('adGroupsByCampaign map', () => {
    it('groups ad groups by campaignId correctly', () => {
      Object.entries(adGroupsByCampaign).forEach(([campaignId, groups]) => {
        groups.forEach((ag) => {
          expect(ag.campaignId).toBe(campaignId)
        })
      })
    })

    it('total ad groups across all campaign groups is 9', () => {
      const total = Object.values(adGroupsByCampaign).reduce(
        (sum, arr) => sum + arr.length, 0
      )
      expect(total).toBe(9)
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - All ad groups have audienceType = 'Outcome Audience' and verificationStatus = 'verified'; these could be defaults
 * - propensityWindows always has 4 entries with the same window values; the window strings are redundant
 * - The clientId field on each ad group duplicates info derivable from campaignId → campaign → clientId
 * - The metrics sub-object on ad groups (conversionRate, impressions, spend) could reference campaign metrics instead
 * - The selfReportedFilter is a free-text string; structured data would be more useful for filtering
 */
