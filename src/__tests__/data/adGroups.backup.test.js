import { adGroups, adGroupsByCampaign } from '../../data/adGroups'
import { campaignsById } from '../../data/campaigns'

describe('adGroups data — cross-referencing and calibration', () => {
  it('clientId on each ad group matches its campaign parent clientId', () => {
    adGroups.forEach((ag) => {
      const campaign = campaignsById[ag.campaignId]
      expect(ag.clientId).toBe(campaign.clientId)
    })
  })

  it('audience sizes are in realistic range (500K to 10M)', () => {
    adGroups.forEach((ag) => {
      expect(ag.audienceSize).toBeGreaterThanOrEqual(500000)
      expect(ag.audienceSize).toBeLessThanOrEqual(10000000)
    })
  })

  it('ad group metrics conversionRate is within parent campaign range', () => {
    adGroups.forEach((ag) => {
      const campaign = campaignsById[ag.campaignId]
      // Ad group CVR should be close to campaign CVR (within 50% either direction)
      expect(ag.metrics.conversionRate).toBeGreaterThan(campaign.metrics.conversionRate * 0.5)
      expect(ag.metrics.conversionRate).toBeLessThan(campaign.metrics.conversionRate * 2)
    })
  })

  it('90-day scores are generally close to 30-day scores (within 15 points)', () => {
    adGroups.forEach((ag) => {
      const w30 = ag.propensityWindows.find((w) => w.window === '30-day')
      const w90 = ag.propensityWindows.find((w) => w.window === '90-day')
      const diff = Math.abs(w30.score - w90.score)
      expect(diff).toBeLessThanOrEqual(15)
    })
  })

  it('propensity labels are consistent with relative score ordering', () => {
    const labelRank = { 'Very High': 4, 'High': 3, 'Moderate': 2, 'Low': 1 }
    adGroups.forEach((ag) => {
      ag.propensityWindows.forEach((w) => {
        // Labels should be one of the valid tiers
        expect(labelRank).toHaveProperty(w.label)
        // Higher scores should not have lower-ranked labels
        if (w.score >= 90) expect(labelRank[w.label]).toBeGreaterThanOrEqual(3)
        if (w.score < 65) expect(labelRank[w.label]).toBeLessThanOrEqual(2)
      })
    })
  })

  it('ad group IDs follow naming convention (clientId-cN-agN)', () => {
    adGroups.forEach((ag) => {
      expect(ag.id).toMatch(/^[a-z]+-c\d+-ag\d+$/)
    })
  })

  it('every campaign with ad groups has at least 1', () => {
    Object.values(adGroupsByCampaign).forEach((groups) => {
      expect(groups.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('ad group spend does not exceed parent campaign spend', () => {
    Object.entries(adGroupsByCampaign).forEach(([campaignId, groups]) => {
      const campaign = campaignsById[campaignId]
      const totalSpend = groups.reduce((sum, ag) => sum + ag.metrics.spend, 0)
      expect(totalSpend).toBeLessThanOrEqual(campaign.spent * 1.1) // 10% tolerance
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The propensity label-to-score mapping is hand-assigned with no strict threshold (score 88 is both High and Very High); a utility function would enforce consistency
 * - Cross-file references (ad group clientId must match campaign clientId) indicate redundant data
 * - The ID naming convention is implied but not enforced; a generator would guarantee consistency
 * - Ad group spend vs campaign spend tolerance test reveals that the data is hand-crafted, not derived
 * - The backup tests add value by validating relationships the primary tests skip
 */
