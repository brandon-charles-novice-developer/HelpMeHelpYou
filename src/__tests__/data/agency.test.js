import { agency, agencyScoreboardKpis } from '../../data/agency'

describe('agency data', () => {
  describe('agency object', () => {
    it('has required identity fields', () => {
      expect(agency.id).toBe('tombras')
      expect(agency.name).toBe('Tombras')
      expect(agency.fullName).toBe('The Tombras Group')
      expect(agency.platform).toBe('TID')
    })

    it('has seat information', () => {
      expect(agency.seat).toEqual({
        name: 'Alexander Potts',
        title: 'Head of Ad Technology and Media Investment',
        initials: 'AP',
      })
    })

    it('has correct client and campaign counts', () => {
      expect(agency.clientCount).toBe(5)
      expect(agency.activeCampaigns).toBe(11)
    })

    it('has audience reach in realistic range', () => {
      expect(agency.activeAudienceReach).toBeGreaterThan(1000000)
      expect(agency.activeAudienceReach).toBeLessThan(100000000)
    })

    it('has KPIs with realistic values', () => {
      expect(agency.kpis.incrementalRevenue).toBeGreaterThan(0)
      expect(agency.kpis.blendedRoas).toBeGreaterThan(1)
      expect(agency.kpis.blendedRoas).toBeLessThan(10)
      expect(agency.kpis.newBuyerLift).toBeGreaterThan(0)
      expect(agency.kpis.newBuyerLift).toBeLessThan(100)
      expect(agency.kpis.activeCampaigns).toBe(11)
      expect(agency.kpis.audienceReach).toBe(4200000)
    })

    it('has impactBrief with all three fields', () => {
      expect(agency.impactBrief).toHaveProperty('headline')
      expect(agency.impactBrief).toHaveProperty('body')
      expect(agency.impactBrief).toHaveProperty('action')
      expect(agency.impactBrief.headline.length).toBeGreaterThan(0)
      expect(agency.impactBrief.body.length).toBeGreaterThan(0)
      expect(agency.impactBrief.action.length).toBeGreaterThan(0)
    })

    it('has platformStats with positive numbers', () => {
      expect(agency.platformStats.totalTransactions).toBeGreaterThan(0)
      expect(agency.platformStats.totalTransactionValue).toBeGreaterThan(0)
      expect(agency.platformStats.dailyTransactions).toBeGreaterThan(0)
      expect(agency.platformStats.dailyTransactionValue).toBeGreaterThan(0)
    })
  })

  describe('agencyScoreboardKpis', () => {
    it('is an array with 5 KPI cards', () => {
      expect(Array.isArray(agencyScoreboardKpis)).toBe(true)
      expect(agencyScoreboardKpis).toHaveLength(5)
    })

    it('each KPI has required shape', () => {
      agencyScoreboardKpis.forEach((kpi) => {
        expect(kpi).toHaveProperty('id')
        expect(kpi).toHaveProperty('label')
        expect(kpi).toHaveProperty('value')
        expect(kpi).toHaveProperty('format')
        expect(kpi).toHaveProperty('delta')
        expect(kpi).toHaveProperty('deltaPositive')
      })
    })

    it('has unique IDs', () => {
      const ids = agencyScoreboardKpis.map((k) => k.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('has valid format types', () => {
      const validFormats = ['currency_compact', 'multiplier', 'percent', 'integer', 'integer_compact']
      agencyScoreboardKpis.forEach((kpi) => {
        expect(validFormats).toContain(kpi.format)
      })
    })

    it('values are non-negative numbers', () => {
      agencyScoreboardKpis.forEach((kpi) => {
        expect(typeof kpi.value).toBe('number')
        expect(kpi.value).toBeGreaterThanOrEqual(0)
      })
    })

    it('deltaPositive is boolean or null', () => {
      agencyScoreboardKpis.forEach((kpi) => {
        expect([true, false, null]).toContain(kpi.deltaPositive)
      })
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - agency.kpis and agencyScoreboardKpis duplicate KPI values (e.g., activeCampaigns: 11 in both); one should derive from the other
 * - platformStats values are extremely large and could drift from reality; a single multiplier constant would reduce drift risk
 * - The impactBrief structure could be generated from the KPI data instead of being hand-authored
 * - agencyScoreboardKpis could use a simpler format enum instead of string-based format types
 * - Tests are straightforward shape checks; the main risk is data staleness rather than code bugs
 */
