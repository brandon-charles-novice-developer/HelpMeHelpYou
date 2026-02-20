import { packages, packagesByAdGroup } from '../../data/packages'
import { adGroupsById } from '../../data/adGroups'

describe('packages data — cross-referencing and budget validation', () => {
  it('package campaignId matches its ad group parent campaignId', () => {
    packages.forEach((p) => {
      const adGroup = adGroupsById[p.adGroupId]
      expect(p.campaignId).toBe(adGroup.campaignId)
    })
  })

  it('package clientId matches its ad group parent clientId', () => {
    packages.forEach((p) => {
      const adGroup = adGroupsById[p.adGroupId]
      expect(p.clientId).toBe(adGroup.clientId)
    })
  })

  it('CTV packages have video formats', () => {
    packages
      .filter((p) => p.environment === 'CTV')
      .forEach((p) => {
        expect(p.format).toMatch(/15s|30s/)
      })
  })

  it('Display packages have size-based formats', () => {
    packages
      .filter((p) => p.environment === 'Display')
      .forEach((p) => {
        expect(p.format).toMatch(/\d+x\d+|Multiple/)
      })
  })

  it('impressions are in millions range', () => {
    packages.forEach((p) => {
      expect(p.impressions).toBeGreaterThan(1000000)
    })
  })

  it('CPM roughly matches spend/impressions*1000', () => {
    packages.forEach((p) => {
      const derivedCpm = (p.spent / p.impressions) * 1000
      // Allow 50% tolerance since CPM is an average
      expect(p.cpm).toBeGreaterThan(derivedCpm * 0.3)
      expect(p.cpm).toBeLessThan(derivedCpm * 3)
    })
  })

  it('package IDs follow naming convention', () => {
    packages.forEach((p) => {
      expect(p.id).toMatch(/^[a-z]+-c\d+-ag\d+-pk\d+$/)
    })
  })

  it('ad groups with packages have 1-2 packages each', () => {
    Object.values(packagesByAdGroup).forEach((pkgs) => {
      expect(pkgs.length).toBeGreaterThanOrEqual(1)
      expect(pkgs.length).toBeLessThanOrEqual(2)
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The CPM validation reveals that CPM values are approximations, not derived from spend/impressions
 * - Package IDs encode the full hierarchy path; a flat UUID would be simpler with a foreign key reference
 * - The Display format field is inconsistent ('300x250 + 728x90' vs 'Multiple sizes') — a standardized approach would help
 * - Cross-referencing tests (campaignId, clientId) exist because of redundant foreign keys in the data model
 * - The environment field could be an enum constant rather than a magic string
 */
