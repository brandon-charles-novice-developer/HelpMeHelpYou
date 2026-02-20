import { geos, geosByCreative } from '../../data/geos'
import { creativesById } from '../../data/creatives'

describe('geos data — geographic and metric calibration', () => {
  it('DMA codes are valid US DMA codes (3-digit)', () => {
    geos.forEach((g) => {
      expect(g.dmaCode).toBeGreaterThanOrEqual(200)
      expect(g.dmaCode).toBeLessThanOrEqual(900)
    })
  })

  it('New York is the highest-impression DMA for Kayak', () => {
    const kayakGeos = geos.filter((g) => g.clientId === 'kayak')
    const nyGeo = kayakGeos.find((g) => g.dmaCode === 501)
    kayakGeos.forEach((g) => {
      expect(nyGeo.impressions).toBeGreaterThanOrEqual(g.impressions)
    })
  })

  it('Miami is the highest-impression DMA for Spirit', () => {
    const spiritGeos = geos.filter((g) => g.clientId === 'spirit')
    const miamiGeo = spiritGeos.find((g) => g.dmaCode === 528)
    spiritGeos.forEach((g) => {
      expect(miamiGeo.impressions).toBeGreaterThanOrEqual(g.impressions)
    })
  })

  it('geo conversionRate is within parent creative range', () => {
    geos.forEach((g) => {
      const creative = creativesById[g.creativeId]
      // Geos can outperform or underperform the creative average, but should be close
      expect(g.metrics.conversionRate).toBeGreaterThan(creative.metrics.conversionRate * 0.5)
      expect(g.metrics.conversionRate).toBeLessThan(creative.metrics.conversionRate * 2)
    })
  })

  it('newBuyerCvr is always less than conversionRate', () => {
    geos.forEach((g) => {
      expect(g.metrics.newBuyerCvr).toBeLessThan(g.metrics.conversionRate)
    })
  })

  it('geo impressions do not exceed parent creative impressions', () => {
    Object.entries(geosByCreative).forEach(([creativeId, creativeGeos]) => {
      const creative = creativesById[creativeId]
      const totalGeoImpressions = creativeGeos.reduce((s, g) => s + g.impressions, 0)
      expect(totalGeoImpressions).toBeLessThanOrEqual(creative.impressions)
    })
  })

  it('spend is proportional to impressions (rough CPM check)', () => {
    geos.forEach((g) => {
      const impliedCpm = (g.spend / g.impressions) * 1000
      expect(impliedCpm).toBeGreaterThan(1)
      expect(impliedCpm).toBeLessThan(20)
    })
  })

  it('Florida DMAs are present for Spirit (airline hub)', () => {
    const spiritGeos = geos.filter((g) => g.clientId === 'spirit')
    const floridaDmas = spiritGeos.filter((g) =>
      g.dma.includes('FL')
    )
    expect(floridaDmas.length).toBeGreaterThanOrEqual(2)
  })

  it('geo IDs follow naming convention', () => {
    geos.forEach((g) => {
      expect(g.id).toMatch(/^[a-z]+-cr\d+-geo\d+$/)
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The geo-to-creative impression rollup reveals that geos represent a subset of impressions, not the total
 * - The DMA code validation could use a proper DMA code list rather than a range check
 * - The newBuyerCvr < conversionRate invariant is a business rule worth documenting in the source
 * - Spend/impressions ratio validation catches unrealistic data but uses loose bounds
 * - The geographic distribution (Spirit in Florida, Kayak in top DMAs) is business logic embedded in data
 */
