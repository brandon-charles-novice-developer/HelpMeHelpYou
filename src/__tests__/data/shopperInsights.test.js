import { shopperInsights } from '../../data/shopperInsights'
import { clients } from '../../data/clients'

const clientIds = clients.map((c) => c.id)

describe('shopperInsights data', () => {
  describe('structure', () => {
    it('has insights for all 5 clients', () => {
      clientIds.forEach((id) => {
        expect(shopperInsights).toHaveProperty(id)
      })
    })

    it('each client has all 6 modules', () => {
      const modules = ['switching', 'loyalty', 'crossPurchase', 'category', 'basket', 'propensity']
      clientIds.forEach((id) => {
        modules.forEach((mod) => {
          expect(shopperInsights[id]).toHaveProperty(mod)
        })
      })
    })

    it('each client has a clientId field', () => {
      clientIds.forEach((id) => {
        expect(shopperInsights[id].clientId).toBe(id)
      })
    })
  })

  describe('switching module', () => {
    it('has title, primary brand, competitors, and insight', () => {
      clientIds.forEach((id) => {
        const s = shopperInsights[id].switching
        expect(s.title).toBe('Switching Behavior')
        expect(s.primary).toHaveProperty('brand')
        expect(s.primary).toHaveProperty('share')
        expect(Array.isArray(s.competitors)).toBe(true)
        expect(s.competitors.length).toBeGreaterThan(0)
        expect(s.insight.length).toBeGreaterThan(0)
      })
    })

    it('competitor entries have required fields', () => {
      clientIds.forEach((id) => {
        shopperInsights[id].switching.competitors.forEach((comp) => {
          expect(comp).toHaveProperty('brand')
          expect(comp).toHaveProperty('switchedTo')
          expect(comp).toHaveProperty('switchedFrom')
          expect(comp).toHaveProperty('net')
        })
      })
    })
  })

  describe('loyalty module', () => {
    it('has segments array with 4 tiers', () => {
      clientIds.forEach((id) => {
        const l = shopperInsights[id].loyalty
        expect(l.segments).toHaveLength(4)
      })
    })

    it('segment shares sum to 1', () => {
      clientIds.forEach((id) => {
        const total = shopperInsights[id].loyalty.segments.reduce(
          (sum, s) => sum + s.share, 0
        )
        expect(total).toBeCloseTo(1, 5)
      })
    })

    it('segments have color and hhiIndex', () => {
      clientIds.forEach((id) => {
        shopperInsights[id].loyalty.segments.forEach((s) => {
          expect(s.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
          expect(s.hhiIndex).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('propensity module', () => {
    it('has 4 windows', () => {
      clientIds.forEach((id) => {
        expect(shopperInsights[id].propensity.windows).toHaveLength(4)
      })
    })

    it('windows cover standard periods', () => {
      clientIds.forEach((id) => {
        const windows = shopperInsights[id].propensity.windows.map((w) => w.window)
        expect(windows).toEqual(['10-day', '30-day', '60-day', '90-day'])
      })
    })

    it('scores are between 0 and 100', () => {
      clientIds.forEach((id) => {
        shopperInsights[id].propensity.windows.forEach((w) => {
          expect(w.score).toBeGreaterThan(0)
          expect(w.score).toBeLessThanOrEqual(100)
        })
      })
    })

    it('converters increase with longer windows', () => {
      clientIds.forEach((id) => {
        const windows = shopperInsights[id].propensity.windows
        for (let i = 1; i < windows.length; i++) {
          expect(windows[i].converters).toBeGreaterThan(windows[i - 1].converters)
        }
      })
    })
  })

  describe('basket module', () => {
    it('has associations with lift values', () => {
      clientIds.forEach((id) => {
        const b = shopperInsights[id].basket
        expect(Array.isArray(b.associations)).toBe(true)
        b.associations.forEach((a) => {
          expect(a).toHaveProperty('item')
          expect(a).toHaveProperty('coRate')
          expect(a).toHaveProperty('lift')
          expect(a.lift).toBeGreaterThan(1) // lift > 1 means above baseline
        })
      })
    })
  })

  describe('category module', () => {
    it('has data array with share and index', () => {
      clientIds.forEach((id) => {
        const cat = shopperInsights[id].category
        expect(Array.isArray(cat.data)).toBe(true)
        cat.data.forEach((d) => {
          expect(d).toHaveProperty('category')
          expect(d).toHaveProperty('share')
          expect(d).toHaveProperty('index')
          expect(d.share).toBeGreaterThan(0)
          expect(d.share).toBeLessThanOrEqual(1)
          expect(d.index).toBeGreaterThan(100) // above-average indexing
        })
      })
    })
  })

  describe('crossPurchase module', () => {
    it('has pairs with overlapRate and index', () => {
      clientIds.forEach((id) => {
        const cp = shopperInsights[id].crossPurchase
        expect(Array.isArray(cp.pairs)).toBe(true)
        cp.pairs.forEach((p) => {
          expect(p).toHaveProperty('brand')
          expect(p).toHaveProperty('overlapRate')
          expect(p).toHaveProperty('index')
          expect(p.overlapRate).toBeGreaterThan(0)
          expect(p.overlapRate).toBeLessThanOrEqual(1)
        })
      })
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The 6 modules per client create a large, deeply nested object; flattening into separate exports per module would simplify imports
 * - Each module has a `title` field that never changes per module type — this is a display concern, not data
 * - The insight strings are hand-written narrative; separating data from narrative would make the data more testable
 * - Loyalty segment colors are hardcoded per client but use the same 4-color palette — could be a shared constant
 * - The crossPurchase and basket modules have overlapping concepts (both track co-purchase behavior)
 */
