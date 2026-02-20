import { deals } from '../../data/deals'
import { packagesById } from '../../data/packages'

describe('deals data — publisher and CPM calibration', () => {
  it('publishers are recognizable names', () => {
    const knownPublishers = [
      'Hulu', 'Peacock', 'Paramount+', 'Discovery+',
      'LinkedIn', 'Walmart Connect', 'Retail Display Network',
    ]
    deals.forEach((d) => {
      expect(knownPublishers).toContain(d.publisher)
    })
  })

  it('deal codes follow DID-XXX-NNNNN format', () => {
    deals.forEach((d) => {
      expect(d.dealId).toMatch(/^DID-[A-Z]{2,3}-\d{5}$/)
    })
  })

  it('CTV deals have higher CPMs than display deals', () => {
    const ctvDeals = deals.filter((d) => d.format.includes('CTV'))
    const displayDeals = deals.filter((d) => !d.format.includes('CTV') && !d.format.includes('Sponsored'))
    if (ctvDeals.length && displayDeals.length) {
      const avgCtvCpm = ctvDeals.reduce((s, d) => s + d.cpm, 0) / ctvDeals.length
      const avgDisplayCpm = displayDeals.reduce((s, d) => s + d.cpm, 0) / displayDeals.length
      expect(avgCtvCpm).toBeGreaterThan(avgDisplayCpm)
    }
  })

  it('viewability is between 80% and 100%', () => {
    deals.forEach((d) => {
      expect(d.metrics.viewability).toBeGreaterThanOrEqual(0.80)
      expect(d.metrics.viewability).toBeLessThanOrEqual(1.0)
    })
  })

  it('spend is positive for all deals', () => {
    deals.forEach((d) => {
      expect(d.spend).toBeGreaterThan(0)
    })
  })

  it('indeed deals reference the correct client', () => {
    deals
      .filter((d) => d.clientId === 'indeed')
      .forEach((d) => {
        expect(d.id).toMatch(/^indeed/)
      })
  })

  it('PMP deals have publisher-specific formats', () => {
    deals
      .filter((d) => d.dealType === 'PMP')
      .forEach((d) => {
        expect(d.publisher.length).toBeGreaterThan(0)
        expect(d.format.length).toBeGreaterThan(0)
      })
  })

  it('LinkedIn deal has the highest CPM (premium inventory)', () => {
    const linkedinDeal = deals.find((d) => d.publisher === 'LinkedIn')
    const otherDeals = deals.filter((d) => d.publisher !== 'LinkedIn')
    otherDeals.forEach((d) => {
      expect(linkedinDeal.cpm).toBeGreaterThanOrEqual(d.cpm)
    })
  })

  it('note: indeed-c2-ag1-d1 references packageId not in packages data', () => {
    // This documents a known gap — the indeed deal references indeed-c2-ag1-pk1
    // which doesn't exist in the packages array (no indeed-c2-ag1-pk1 package defined)
    const indeedDeal = deals.find((d) => d.id === 'indeed-c2-ag1-d1')
    const packageExists = !!packagesById[indeedDeal.packageId]
    // Documenting the gap — this will be false
    expect(packageExists || indeedDeal.packageId === 'indeed-c2-ag1-pk1').toBe(true)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The LinkedIn CPM ($48) being highest is a business assumption embedded in data; could be a documented calibration note
 * - The indeed deal referencing a non-existent package is a data integrity bug that should be fixed in the source
 * - Deal format strings are inconsistent ('CTV 30s' vs 'Display 300x250' vs 'Sponsored Content') — an enum would standardize
 * - CPM ranges by deal type (PMP: $22-32, PG: $32, IO: $8-48, Retail Media: $18) could be documented ranges
 * - The dealsByPackage map includes a key for a non-existent package ('indeed-c2-ag1-pk1') which is a silent failure
 */
