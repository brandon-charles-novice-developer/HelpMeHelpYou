import { geos, geosById, geosByCreative } from '../../data/geos'
import { creatives } from '../../data/creatives'

describe('geos data', () => {
  describe('geos array', () => {
    it('has exactly 12 geos', () => {
      expect(geos).toHaveLength(12)
    })

    it('all geos have required fields', () => {
      const requiredFields = [
        'id', 'creativeId', 'clientId', 'dma', 'dmaCode',
        'impressions', 'spend', 'metrics',
      ]
      geos.forEach((g) => {
        requiredFields.forEach((field) => {
          expect(g).toHaveProperty(field)
        })
      })
    })

    it('all IDs are unique', () => {
      const ids = geos.map((g) => g.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('all geos reference valid creative IDs', () => {
      const creativeIds = new Set(creatives.map((c) => c.id))
      geos.forEach((g) => {
        expect(creativeIds.has(g.creativeId)).toBe(true)
      })
    })

    it('DMA codes are positive integers', () => {
      geos.forEach((g) => {
        expect(Number.isInteger(g.dmaCode)).toBe(true)
        expect(g.dmaCode).toBeGreaterThan(0)
      })
    })

    it('DMA names are non-empty strings', () => {
      geos.forEach((g) => {
        expect(g.dma.length).toBeGreaterThan(0)
      })
    })

    it('impressions are positive', () => {
      geos.forEach((g) => {
        expect(g.impressions).toBeGreaterThan(0)
      })
    })

    it('spend is positive', () => {
      geos.forEach((g) => {
        expect(g.spend).toBeGreaterThan(0)
      })
    })

    it('metrics have conversionRate and newBuyerCvr', () => {
      geos.forEach((g) => {
        expect(g.metrics.conversionRate).toBeGreaterThan(0)
        expect(g.metrics.conversionRate).toBeLessThan(1)
        expect(g.metrics.newBuyerCvr).toBeGreaterThan(0)
        expect(g.metrics.newBuyerCvr).toBeLessThan(1)
      })
    })
  })

  describe('geosById map', () => {
    it('has 12 entries', () => {
      expect(Object.keys(geosById)).toHaveLength(12)
    })

    it('maps IDs to correct objects', () => {
      geos.forEach((g) => {
        expect(geosById[g.id]).toBe(g)
      })
    })
  })

  describe('geosByCreative map', () => {
    it('groups geos by creativeId', () => {
      Object.entries(geosByCreative).forEach(([creativeId, creativeGeos]) => {
        creativeGeos.forEach((g) => {
          expect(g.creativeId).toBe(creativeId)
        })
      })
    })

    it('total geos across all groups is 12', () => {
      const total = Object.values(geosByCreative).reduce(
        (sum, arr) => sum + arr.length, 0
      )
      expect(total).toBe(12)
    })

    it('Kayak creative has 5 geos', () => {
      expect(geosByCreative['kayak-cr1']).toHaveLength(5)
    })

    it('Ricola creative has 4 geos', () => {
      expect(geosByCreative['ricola-cr1']).toHaveLength(4)
    })

    it('Spirit creative has 3 geos (Florida-heavy)', () => {
      expect(geosByCreative['spirit-cr1']).toHaveLength(3)
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Only 3 of 6 creatives have geo data (12 geos total); the others (kayak-cr2, indeed-cr1, newell-cr1) are missing geos
 * - The clientId field on geos duplicates info derivable from creativeId → creative → clientId
 * - DMA codes are real Nielsen DMA codes; validating against a DMA lookup table would be more thorough
 * - The geo ID naming convention (client-crN-geoN) is consistent and useful for debugging
 * - The geosByCreative map pattern is identical to all other grouped maps — clear candidate for a shared groupBy
 */
