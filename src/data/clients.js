// Tombras client roster — 5 clients with distinct buying configurations
// Each uses different DSPs, channels, and Attain solution combinations

export const clients = [
  {
    id: 'kayak',
    name: 'Kayak',
    vertical: 'Travel',
    logo: 'K',
    logoColor: '#FF690F',       // Kayak brand orange
    buyingType: 'programmatic',
    channels: ['TTD', 'Amazon DSP'],
    solutions: ['audiences', 'measurement'],
    description: 'Multi-DSP programmatic — flight and hotel booking transactions',
    status: 'active',

    // Campaign-level KPIs
    metrics: {
      conversionRate: 0.038,
      conversionRateVsBenchmark: +0.010,  // +1.0pt vs 2.8% CTV benchmark
      newBuyerCvr: 0.0028,
      newBuyerRoas: 1.7,
      newBuyerSalesDriven: 337000,
      newBuyerCpa: 118,
      newBuyerAvgTransaction: 24.50,
      onlineSplit: 0.94,
      inStoreSplit: 0.06,
      incrementalRevenue: 2140000,
      activeCampaigns: 3,
    },

    // DSP comparison for Kayak
    dspComparison: [
      { dsp: 'The Trade Desk', cvr: 0.041, spend: 185000, label: 'TTD' },
      { dsp: 'Amazon DSP', cvr: 0.032, spend: 143000, label: 'Amazon DSP' },
    ],

    // Attain alert
    alert: {
      type: 'caution',
      message: 'Amazon DSP underperforming TTD by 28% on conversion rate. Review allocation.',
    },
  },

  {
    id: 'newell',
    name: 'Newell Brands',
    vertical: 'CPG / Home',
    logo: 'NB',
    logoColor: '#003087',
    buyingType: 'managed',
    channels: ['Direct IO'],
    solutions: ['audiences', 'measurement'],
    description: 'Managed service — SKU-level (Rubbermaid, Sharpie, Coleman)',
    status: 'active',

    metrics: {
      conversionRate: 0.034,
      conversionRateVsBenchmark: +0.006,
      newBuyerCvr: 0.0022,
      newBuyerRoas: 1.4,
      newBuyerSalesDriven: 284000,
      newBuyerCpa: 131,
      newBuyerAvgTransaction: 23.10,
      onlineSplit: 0.28,
      inStoreSplit: 0.72,
      incrementalRevenue: 1620000,
      activeCampaigns: 2,
    },

    // Retailer breakdown
    retailerBreakdown: [
      { retailer: 'Walmart', share: 0.42 },
      { retailer: 'Target', share: 0.28 },
      { retailer: 'Amazon', share: 0.18 },
      { retailer: 'Other', share: 0.12 },
    ],

    alert: null,
  },

  {
    id: 'spirit',
    name: 'Spirit Airlines',
    vertical: 'Travel / Airlines',
    logo: 'SX',
    logoColor: '#FFEC00',
    buyingType: 'mixed',
    channels: ['TTD', 'Direct IO'],
    solutions: ['audiences', 'measurement'],
    description: 'Programmatic + managed service — low-cost carrier flight bookings',
    status: 'active',

    metrics: {
      conversionRate: 0.031,
      conversionRateVsBenchmark: +0.003,
      newBuyerCvr: 0.0026,
      newBuyerRoas: 1.3,
      newBuyerSalesDriven: 198000,
      newBuyerCpa: 140,
      newBuyerAvgTransaction: 22.80,
      onlineSplit: 0.91,
      inStoreSplit: 0.09,
      incrementalRevenue: 1380000,
      activeCampaigns: 2,
    },

    alert: {
      type: 'caution',
      message: '18% of target audience switched to Frontier in last 60 days. Increase loyalty segment weighting.',
    },
  },

  {
    id: 'ricola',
    name: 'Ricola',
    vertical: 'CPG / Health',
    logo: 'R',
    logoColor: '#009B3A',
    buyingType: 'programmatic',
    channels: ['Yahoo DSP'],
    solutions: ['audiences', 'measurement'],
    description: 'Single DSP programmatic — seasonal health and wellness',
    status: 'active',

    metrics: {
      conversionRate: 0.051,
      conversionRateVsBenchmark: +0.023,
      newBuyerCvr: 0.0040,
      newBuyerRoas: 2.1,
      newBuyerSalesDriven: 412000,
      newBuyerCpa: 94,
      newBuyerAvgTransaction: 26.20,
      onlineSplit: 0.35,
      inStoreSplit: 0.65,
      incrementalRevenue: 1890000,
      activeCampaigns: 2,
    },

    // Retailer breakdown
    retailerBreakdown: [
      { retailer: 'CVS', share: 0.38 },
      { retailer: 'Walgreens', share: 0.26 },
      { retailer: 'Target', share: 0.19 },
      { retailer: 'Whole Foods', share: 0.12 },
      { retailer: 'Other', share: 0.05 },
    ],

    alert: {
      type: 'positive',
      message: 'Q1 cold-season propensity index at 3.2x baseline. Top performer this period.',
    },
  },

  {
    id: 'indeed',
    name: 'Indeed',
    vertical: 'Recruitment / Tech',
    logo: 'I',
    logoColor: '#2557A7',
    buyingType: 'programmatic',
    channels: ['TTD', 'LinkedIn Ads', 'Walmart Connect'],
    solutions: ['audiences', 'measurement'],
    description: 'Programmatic + retail media — life-event targeting, B2C + B2B',
    status: 'active',

    metrics: {
      conversionRate: 0.042,
      conversionRateVsBenchmark: +0.014,
      newBuyerCvr: 0.0038,
      newBuyerRoas: 1.8,
      newBuyerSalesDriven: 294000,
      newBuyerCpa: 109,
      newBuyerAvgTransaction: 25.40,
      onlineSplit: 0.97,
      inStoreSplit: 0.03,
      incrementalRevenue: 1390000,
      activeCampaigns: 2,
    },

    alert: {
      type: 'positive',
      message: 'Life-event targeting delivering new buyer CVR of 0.38% — 40% above vertical average.',
    },
  },
]

export const clientsById = Object.fromEntries(clients.map((c) => [c.id, c]))
