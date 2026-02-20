import { agency, agencyScoreboardKpis } from '../../data/agency'

describe('agency data — cross-field consistency', () => {
  it('KPI activeCampaigns matches agency.activeCampaigns', () => {
    expect(agency.kpis.activeCampaigns).toBe(agency.activeCampaigns)
  })

  it('KPI audienceReach matches agency.activeAudienceReach', () => {
    expect(agency.kpis.audienceReach).toBe(agency.activeAudienceReach)
  })

  it('scoreboard incremental_revenue value matches agency.kpis', () => {
    const card = agencyScoreboardKpis.find((k) => k.id === 'incremental_revenue')
    expect(card.value).toBe(agency.kpis.incrementalRevenue)
  })

  it('scoreboard blended_roas value matches agency.kpis', () => {
    const card = agencyScoreboardKpis.find((k) => k.id === 'blended_roas')
    expect(card.value).toBe(agency.kpis.blendedRoas)
  })

  it('scoreboard new_buyer_lift matches agency.kpis', () => {
    const card = agencyScoreboardKpis.find((k) => k.id === 'new_buyer_lift')
    expect(card.value).toBe(agency.kpis.newBuyerLift)
  })

  it('scoreboard active_campaigns matches agency.kpis', () => {
    const card = agencyScoreboardKpis.find((k) => k.id === 'active_campaigns')
    expect(card.value).toBe(agency.kpis.activeCampaigns)
  })

  it('scoreboard audience_reach matches agency.kpis', () => {
    const card = agencyScoreboardKpis.find((k) => k.id === 'audience_reach')
    expect(card.value).toBe(agency.kpis.audienceReach)
  })

  it('daily transactions are less than total transactions', () => {
    expect(agency.platformStats.dailyTransactions).toBeLessThan(agency.platformStats.totalTransactions)
  })

  it('daily transaction value is less than total value', () => {
    expect(agency.platformStats.dailyTransactionValue).toBeLessThan(agency.platformStats.totalTransactionValue)
  })

  it('ROAS is realistic (between 0.5x and 5x)', () => {
    expect(agency.kpis.blendedRoas).toBeGreaterThanOrEqual(0.5)
    expect(agency.kpis.blendedRoas).toBeLessThanOrEqual(5)
  })

  it('new buyer lift is a percentage (0-100)', () => {
    expect(agency.kpis.newBuyerLift).toBeGreaterThan(0)
    expect(agency.kpis.newBuyerLift).toBeLessThan(100)
  })

  it('impactBrief body is a substantial paragraph', () => {
    expect(agency.impactBrief.body.length).toBeGreaterThan(100)
  })

  it('seat initials match name', () => {
    const nameParts = agency.seat.name.split(' ')
    const expectedInitials = nameParts.map((p) => p[0]).join('')
    expect(agency.seat.initials).toBe(expectedInitials)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The cross-field consistency tests reveal that the same data is stored in multiple places (agency.kpis vs scoreboard array)
 * - This duplication is the primary source of potential bugs; a single source would eliminate this entire test category
 * - The scoreboard array could be generated from agency.kpis to guarantee consistency
 * - The seat.initials field could be derived from seat.name rather than manually specified
 * - platformStats totals vs dailies are never validated against each other in the source; these tests catch that gap
 */
