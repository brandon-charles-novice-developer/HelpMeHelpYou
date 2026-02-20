import { converterInsights } from '../../data/converterInsights'
import { clients } from '../../data/clients'

const clientIds = clients.map((c) => c.id)

describe('converterInsights data', () => {
  describe('structure', () => {
    it('has insights for all 5 clients', () => {
      clientIds.forEach((id) => {
        expect(converterInsights).toHaveProperty(id)
      })
    })

    it('each client has clientId, label, demographics, and psychographics', () => {
      clientIds.forEach((id) => {
        const ci = converterInsights[id]
        expect(ci.clientId).toBe(id)
        expect(ci.label).toBeDefined()
        expect(ci.label.length).toBeGreaterThan(0)
        expect(Array.isArray(ci.demographics)).toBe(true)
        expect(Array.isArray(ci.psychographics)).toBe(true)
      })
    })
  })

  describe('demographics', () => {
    it('each client has at least 3 demographic dimensions', () => {
      clientIds.forEach((id) => {
        expect(converterInsights[id].demographics.length).toBeGreaterThanOrEqual(3)
      })
    })

    it('all demographic entries have label and attain array', () => {
      clientIds.forEach((id) => {
        converterInsights[id].demographics.forEach((d) => {
          expect(d).toHaveProperty('label')
          expect(Array.isArray(d.attain)).toBe(true)
          expect(d.attain.length).toBeGreaterThan(0)
        })
      })
    })

    it('demographic segments have segment, pct, and census fields', () => {
      clientIds.forEach((id) => {
        converterInsights[id].demographics.forEach((d) => {
          d.attain.forEach((seg) => {
            expect(seg).toHaveProperty('segment')
            expect(seg).toHaveProperty('pct')
            expect(seg).toHaveProperty('census')
          })
        })
      })
    })

    it('pct values within each dimension sum to 1', () => {
      clientIds.forEach((id) => {
        converterInsights[id].demographics.forEach((d) => {
          const total = d.attain.reduce((sum, seg) => sum + seg.pct, 0)
          expect(total).toBeCloseTo(1, 5)
        })
      })
    })

    it('census values within each dimension sum to approximately 1', () => {
      clientIds.forEach((id) => {
        converterInsights[id].demographics.forEach((d) => {
          const total = d.attain.reduce((sum, seg) => sum + seg.census, 0)
          // Census values are rounded and may not sum to exactly 1.00 (tolerance of 0.02)
          expect(total).toBeCloseTo(1, 1)
        })
      })
    })

    it('pct and census values are between 0 and 1', () => {
      clientIds.forEach((id) => {
        converterInsights[id].demographics.forEach((d) => {
          d.attain.forEach((seg) => {
            expect(seg.pct).toBeGreaterThanOrEqual(0)
            expect(seg.pct).toBeLessThanOrEqual(1)
            expect(seg.census).toBeGreaterThanOrEqual(0)
            expect(seg.census).toBeLessThanOrEqual(1)
          })
        })
      })
    })
  })

  describe('psychographics', () => {
    it('each client has exactly 5 psychographic dimensions', () => {
      clientIds.forEach((id) => {
        expect(converterInsights[id].psychographics).toHaveLength(5)
      })
    })

    it('all psychographic entries have label and top array', () => {
      clientIds.forEach((id) => {
        converterInsights[id].psychographics.forEach((p) => {
          expect(p).toHaveProperty('label')
          expect(Array.isArray(p.top)).toBe(true)
          expect(p.top.length).toBe(3) // top 3 items
        })
      })
    })

    it('psychographic labels are consistent across clients', () => {
      const expectedLabels = ['Streaming', 'Social Media', 'Tech Interest', 'Memberships', 'Life Events']
      clientIds.forEach((id) => {
        const labels = converterInsights[id].psychographics.map((p) => p.label)
        expect(labels).toEqual(expectedLabels)
      })
    })

    it('top items are strings with percentage notation', () => {
      clientIds.forEach((id) => {
        converterInsights[id].psychographics.forEach((p) => {
          p.top.forEach((item) => {
            expect(typeof item).toBe('string')
            expect(item).toMatch(/\(\d+%\)/)
          })
        })
      })
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Demographics have inconsistent dimensions per client (Age/Gender/HHI for some, Age/Gender/Education for others)
 * - A standardized set of demographic dimensions would simplify comparison views
 * - Psychographic top items embed percentages in strings ('Netflix (82%)'); structured data would be more flexible
 * - The census comparison data is valuable but creates maintenance burden — should derive from a reference dataset
 * - The label field ('Verified Travel Converters') is display text; could be generated from client vertical
 */
