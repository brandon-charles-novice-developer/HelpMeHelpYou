// Tombras Agency — Alexander Potts morning view rollup
// Tombras Intelligence Data (TID) platform integration with Attain

export const agency = {
  id: 'tombras',
  name: 'Tombras',
  fullName: 'The Tombras Group',
  platform: 'TID',
  seat: {
    name: 'Alexander Potts',
    title: 'Head of Ad Technology and Media Investment',
    initials: 'AP',
  },
  clientCount: 5,
  activeCampaigns: 11,
  activeAudienceReach: 4200000,

  // Morning Coffee KPIs (AgencyScoreboard)
  kpis: {
    incrementalRevenue: 8420000,        // $8.42M total incremental revenue
    blendedRoas: 1.61,                  // 1.61x blended ROAS across all clients
    newBuyerLift: 24,                   // 24% avg new buyer lift
    activeCampaigns: 11,
    audienceReach: 4200000,             // 4.2M opted-in consumers
  },

  // ImpactBrief — 3-sentence CMO summary
  impactBrief: {
    headline: 'Strong new buyer momentum across travel and CPG verticals.',
    body: 'Tombras campaigns drove $8.42M in incremental revenue this period at a 1.61x blended ROAS — outperforming the CTV industry conversion benchmark of 2.8% across 4 of 5 active clients. Ricola\'s Q1 cold-season propensity index reached 3.2x above baseline, while Indeed\'s life-event targeting is delivering new buyer CVR of 0.38% — 40% above vertical average.',
    action: 'Kayak\'s Amazon DSP allocation warrants review — TTD is outperforming by 28% on conversion rate.',
  },

  // Tombras live stats (ticking numbers baseline)
  platformStats: {
    totalTransactions: 5000014000,
    totalTransactionValue: 400000000000,
    dailyTransactions: 2340000,
    dailyTransactionValue: 27126000,
  },
}

export const agencyScoreboardKpis = [
  {
    id: 'incremental_revenue',
    label: 'Incremental Revenue',
    value: 8420000,
    format: 'currency_compact',
    delta: '+12% vs last period',
    deltaPositive: true,
  },
  {
    id: 'blended_roas',
    label: 'Blended ROAS',
    value: 1.61,
    format: 'multiplier',
    delta: '+0.14x vs last period',
    deltaPositive: true,
  },
  {
    id: 'new_buyer_lift',
    label: 'Avg New Buyer Lift',
    value: 24,
    format: 'percent',
    delta: '+3pts vs last period',
    deltaPositive: true,
  },
  {
    id: 'active_campaigns',
    label: 'Active Campaigns',
    value: 11,
    format: 'integer',
    delta: '5 clients',
    deltaPositive: null,
  },
  {
    id: 'audience_reach',
    label: 'Audience Reach',
    value: 4200000,
    format: 'integer_compact',
    delta: '4.2M opted-in',
    deltaPositive: null,
  },
]
