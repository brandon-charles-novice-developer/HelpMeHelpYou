// Ad Group level — Outcome Audience segments with propensity windows
// Each ad group maps to a verified purchase-based Outcome Audience

export const adGroups = [
  // Kayak Spring Travel
  {
    id: 'kayak-c1-ag1',
    campaignId: 'kayak-c1',
    clientId: 'kayak',
    name: 'Frequent Leisure Travelers — Verified',
    audienceType: 'Outcome Audience',
    audienceSegment: 'Travel Purchasers · 2+ bookings / 90 days',
    audienceSize: 2800000,
    verificationStatus: 'verified',
    propensityWindows: [
      { window: '10-day', score: 84, label: 'High' },
      { window: '30-day', score: 91, label: 'Very High' },
      { window: '60-day', score: 88, label: 'High' },
      { window: '90-day', score: 82, label: 'High' },
    ],
    selfReportedFilter: 'HHI $75K+, Age 28–55',
    metrics: { conversionRate: 0.042, impressions: 22400000, spend: 68200 },
  },
  {
    id: 'kayak-c1-ag2',
    campaignId: 'kayak-c1',
    clientId: 'kayak',
    name: 'Hotel Purchasers — Switched from Expedia',
    audienceType: 'Outcome Audience',
    audienceSegment: 'Hotel Booking Switchers · Last 60 days',
    audienceSize: 1100000,
    verificationStatus: 'verified',
    propensityWindows: [
      { window: '10-day', score: 76, label: 'High' },
      { window: '30-day', score: 82, label: 'High' },
      { window: '60-day', score: 79, label: 'High' },
      { window: '90-day', score: 71, label: 'Moderate' },
    ],
    selfReportedFilter: 'Business + Leisure, Age 30–60',
    metrics: { conversionRate: 0.039, impressions: 14200000, spend: 34800 },
  },

  // Spirit Airlines
  {
    id: 'spirit-c1-ag1',
    campaignId: 'spirit-c1',
    clientId: 'spirit',
    name: 'Budget Air Purchasers — High Frequency',
    audienceType: 'Outcome Audience',
    audienceSegment: 'Domestic Flight Purchasers · 3+ flights / year',
    audienceSize: 3400000,
    verificationStatus: 'verified',
    propensityWindows: [
      { window: '10-day', score: 88, label: 'Very High' },
      { window: '30-day', score: 85, label: 'High' },
      { window: '60-day', score: 78, label: 'High' },
      { window: '90-day', score: 72, label: 'Moderate' },
    ],
    selfReportedFilter: 'Leisure travelers, Age 21–45, HHI $40K–$90K',
    metrics: { conversionRate: 0.034, impressions: 28100000, spend: 81400 },
  },
  {
    id: 'spirit-c1-ag2',
    campaignId: 'spirit-c1',
    clientId: 'spirit',
    name: 'Frontier Switchers — Conquest',
    audienceType: 'Outcome Audience',
    audienceSegment: 'Switched to Frontier · Last 60 days',
    audienceSize: 890000,
    verificationStatus: 'verified',
    propensityWindows: [
      { window: '10-day', score: 79, label: 'High' },
      { window: '30-day', score: 74, label: 'Moderate' },
      { window: '60-day', score: 68, label: 'Moderate' },
      { window: '90-day', score: 62, label: 'Moderate' },
    ],
    selfReportedFilter: 'Price-sensitive leisure, Age 22–40',
    metrics: { conversionRate: 0.031, impressions: 14900000, spend: 42600 },
  },

  // Ricola Cold Season
  {
    id: 'ricola-c1-ag1',
    campaignId: 'ricola-c1',
    clientId: 'ricola',
    name: 'Herbal Remedy Purchasers — Peak Season',
    audienceType: 'Outcome Audience',
    audienceSegment: 'Health & Wellness Purchasers · Q4–Q1 index 3.2x',
    audienceSize: 4800000,
    verificationStatus: 'verified',
    propensityWindows: [
      { window: '10-day', score: 94, label: 'Very High' },
      { window: '30-day', score: 91, label: 'Very High' },
      { window: '60-day', score: 86, label: 'High' },
      { window: '90-day', score: 79, label: 'High' },
    ],
    selfReportedFilter: 'Health-conscious adults, Age 30–65',
    metrics: { conversionRate: 0.056, impressions: 44800000, spend: 98200 },
  },
  {
    id: 'ricola-c1-ag2',
    campaignId: 'ricola-c1',
    clientId: 'ricola',
    name: 'Halls Switchers — Conquest',
    audienceType: 'Outcome Audience',
    audienceSegment: 'Switched from Halls · Last 45 days',
    audienceSize: 1600000,
    verificationStatus: 'verified',
    propensityWindows: [
      { window: '10-day', score: 82, label: 'High' },
      { window: '30-day', score: 79, label: 'High' },
      { window: '60-day', score: 74, label: 'Moderate' },
      { window: '90-day', score: 68, label: 'Moderate' },
    ],
    selfReportedFilter: 'Pharmacy shoppers, Age 25–60',
    metrics: { conversionRate: 0.049, impressions: 19800000, spend: 41200 },
  },

  // Indeed Life Events
  {
    id: 'indeed-c1-ag1',
    campaignId: 'indeed-c1',
    clientId: 'indeed',
    name: 'Declared Job Transitioners — Active',
    audienceType: 'Outcome Audience',
    audienceSegment: 'Life Event: Job Change Signal · Last 30 days',
    audienceSize: 2200000,
    verificationStatus: 'verified',
    propensityWindows: [
      { window: '10-day', score: 86, label: 'High' },
      { window: '30-day', score: 91, label: 'Very High' },
      { window: '60-day', score: 84, label: 'High' },
      { window: '90-day', score: 76, label: 'High' },
    ],
    selfReportedFilter: 'Adults 22–50, actively seeking',
    metrics: { conversionRate: 0.046, impressions: 22100000, spend: 58400 },
  },
  {
    id: 'indeed-c2-ag1',
    campaignId: 'indeed-c2',
    clientId: 'indeed',
    name: 'SMB Owners — Hiring Intent',
    audienceType: 'Outcome Audience',
    audienceSegment: 'Small Business Purchasers · Hiring-adjacent signals',
    audienceSize: 1400000,
    verificationStatus: 'verified',
    propensityWindows: [
      { window: '10-day', score: 74, label: 'Moderate' },
      { window: '30-day', score: 81, label: 'High' },
      { window: '60-day', score: 79, label: 'High' },
      { window: '90-day', score: 73, label: 'Moderate' },
    ],
    selfReportedFilter: 'Business owners, HR decision-makers, Age 30–60',
    metrics: { conversionRate: 0.038, impressions: 11400000, spend: 28900 },
  },

  // Newell Brands
  {
    id: 'newell-c1-ag1',
    campaignId: 'newell-c1',
    clientId: 'newell',
    name: 'Home Organization Purchasers',
    audienceType: 'Outcome Audience',
    audienceSegment: 'Storage & Organization Buyers · Last 90 days',
    audienceSize: 6200000,
    verificationStatus: 'verified',
    propensityWindows: [
      { window: '10-day', score: 71, label: 'Moderate' },
      { window: '30-day', score: 78, label: 'High' },
      { window: '60-day', score: 82, label: 'High' },
      { window: '90-day', score: 80, label: 'High' },
    ],
    selfReportedFilter: 'Homeowners, Age 28–55, HHI $60K+',
    metrics: { conversionRate: 0.037, impressions: 38200000, spend: 52800 },
  },
]

export const adGroupsById = Object.fromEntries(adGroups.map((ag) => [ag.id, ag]))

export const adGroupsByCampaign = adGroups.reduce((acc, ag) => {
  if (!acc[ag.campaignId]) acc[ag.campaignId] = []
  acc[ag.campaignId].push(ag)
  return acc
}, {})
