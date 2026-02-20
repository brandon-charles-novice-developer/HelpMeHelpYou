// OutcomeAI — 3-zone cards per client + agency-level rollup
// Format: { insight, recommendation, expectedImpact }
// Each card maps to a real Attain signal from the mock data universe

export const outcomeAICards = [
  // Agency-level (Morning Coffee view)
  {
    id: 'ai-agency-1',
    scope: 'agency',
    clientId: null,
    priority: 1,
    insight: 'Ricola\'s Q1 cold-season propensity index reached 3.2x above annual baseline — the strongest in-season signal across your entire Tombras book.',
    recommendation: 'Shift an additional 15% of Ricola\'s remaining Q1 budget from Yahoo DSP impression volume into verified converter re-engagement. The 10-day propensity window is at 94.',
    expectedImpact: '+$61K in incremental revenue | +0.4pts New Buyer CVR',
    impactPositive: true,
  },
  {
    id: 'ai-agency-2',
    scope: 'agency',
    clientId: null,
    priority: 2,
    insight: 'Kayak\'s Amazon DSP campaign is underperforming TTD by 28% on conversion rate (0.032 vs 0.041) on equivalent audience segments and CPMs.',
    recommendation: 'Shift 30% of Kayak\'s Amazon DSP budget to TTD incrementally over the next 2 weeks. Preserve Amazon DSP allocation for hotel-specific PMP deals where format advantage applies.',
    expectedImpact: '+$48K in incremental revenue | Payback in 11 days',
    impactPositive: true,
  },
  {
    id: 'ai-agency-3',
    scope: 'agency',
    clientId: null,
    priority: 3,
    insight: 'Spirit Airlines\' Frontier switching rate hit 18% in the last 60 days — accelerating 4pts month-over-month. The switching segment is price-motivated, not service-motivated.',
    recommendation: 'Activate a Frontier Switcher conquest Outcome Audience (already built — see Spirit ad groups). Pair with price-anchored CTV creative and 10-day propensity window. Do not use the brand/lifestyle creative on this segment.',
    expectedImpact: '+12% new buyer acquisition from conquest pool | Estimated +$22K net new revenue',
    impactPositive: true,
  },

  // Client-level cards
  {
    id: 'ai-kayak-1',
    scope: 'client',
    clientId: 'kayak',
    priority: 1,
    insight: 'Miami DMA is Kayak\'s highest-converting geo at 6.1% conversion rate — 60% above the campaign average of 3.8%. Spring break booking demand is compressing consideration windows.',
    recommendation: 'Apply a 1.4x bid multiplier in Miami and Orlando DMAs for the next 21 days. These DMAs represent only 11% of current impression volume but 21% of conversions.',
    expectedImpact: '+$38K incremental revenue from DMA reweight | No additional spend required',
    impactPositive: true,
  },
  {
    id: 'ai-spirit-1',
    scope: 'client',
    clientId: 'spirit',
    priority: 1,
    insight: 'Spirit\'s Lapsed Flier Win-Back campaign is underpacing at 25% of budget delivery with 7 weeks remaining. The segment shows strong 10-day propensity (88) but low impression frequency.',
    recommendation: 'Increase daily bid caps by 25% on the Win-Back campaign and expand from 3 to 5 DMAs. Add Orlando-Daytona and Atlanta to the current Miami-Fort Lauderdale geo pool.',
    expectedImpact: '+$41K in win-back revenue | Lapsed reactivation +18% if frequency reaches 5+',
    impactPositive: true,
  },
  {
    id: 'ai-ricola-1',
    scope: 'client',
    clientId: 'ricola',
    priority: 1,
    insight: 'Elderberry buyers represent 31% of Ricola\'s basket — with a 4.6x purchase lift. This audience is not currently being targeted as a standalone Outcome Audience segment.',
    recommendation: 'Build a net-new Elderberry Co-Purchase Outcome Audience segment and test it as a third ad group in the Cold & Flu Peak campaign alongside the existing Herbal Remedy and Halls Switcher segments.',
    expectedImpact: 'Projected +$28K in incremental revenue | Audience size: 1.2M verified purchasers',
    impactPositive: true,
  },
  {
    id: 'ai-newell-1',
    scope: 'client',
    clientId: 'newell',
    priority: 1,
    insight: '34% of Rubbermaid buyers also purchase Coleman — but both campaigns are running independently with no cross-brand audience coordination.',
    recommendation: 'Create a Rubbermaid-Coleman cross-brand Outcome Audience and apply it to both campaigns as a shared remarketing pool. Spring organization + outdoor prep has a natural purchase sequence.',
    expectedImpact: 'Cross-brand reach expansion: +680K incremental audience | Estimated +$34K in combined revenue',
    impactPositive: true,
  },
  {
    id: 'ai-indeed-1',
    scope: 'client',
    clientId: 'indeed',
    priority: 1,
    insight: 'Indeed\'s LinkedIn Ads deal (DID-LNK-29471) is delivering 4.1% CTR on HR decision-maker sponsored content — 5x the LinkedIn benchmark of 0.8%. Budget is nearly exhausted at 94% delivery.',
    recommendation: 'Negotiate a Q2 extension on DID-LNK-29471 before the current IO expires. The HR decision-maker segment is not replaceable at equivalent CPM from Walmart Connect or TTD.',
    expectedImpact: 'Extension retains $16.8K in high-efficiency inventory | Prevents 22% reach drop in B2B segment',
    impactPositive: true,
  },
]

export const agencyLevelCards = outcomeAICards.filter((c) => c.scope === 'agency')

export const cardsByClient = outcomeAICards
  .filter((c) => c.scope === 'client')
  .reduce((acc, c) => {
    if (!acc[c.clientId]) acc[c.clientId] = []
    acc[c.clientId].push(c)
    return acc
  }, {})
