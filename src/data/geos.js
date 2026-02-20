// Geo level — geographic performance breakdown per creative

export const geos = [
  // Kayak — Spring Getaways
  {
    id: 'kayak-cr1-geo1',
    creativeId: 'kayak-cr1',
    clientId: 'kayak',
    dma: 'New York, NY',
    dmaCode: 501,
    impressions: 1240000,
    spend: 4820,
    metrics: { conversionRate: 0.052, newBuyerCvr: 0.0034 },
  },
  {
    id: 'kayak-cr1-geo2',
    creativeId: 'kayak-cr1',
    clientId: 'kayak',
    dma: 'Los Angeles, CA',
    dmaCode: 803,
    impressions: 980000,
    spend: 3640,
    metrics: { conversionRate: 0.049, newBuyerCvr: 0.0031 },
  },
  {
    id: 'kayak-cr1-geo3',
    creativeId: 'kayak-cr1',
    clientId: 'kayak',
    dma: 'Chicago, IL',
    dmaCode: 602,
    impressions: 720000,
    spend: 2840,
    metrics: { conversionRate: 0.046, newBuyerCvr: 0.0028 },
  },
  {
    id: 'kayak-cr1-geo4',
    creativeId: 'kayak-cr1',
    clientId: 'kayak',
    dma: 'Dallas-Ft. Worth, TX',
    dmaCode: 623,
    impressions: 610000,
    spend: 2210,
    metrics: { conversionRate: 0.043, newBuyerCvr: 0.0026 },
  },
  {
    id: 'kayak-cr1-geo5',
    creativeId: 'kayak-cr1',
    clientId: 'kayak',
    dma: 'Miami-Ft. Lauderdale, FL',
    dmaCode: 528,
    impressions: 540000,
    spend: 1980,
    metrics: { conversionRate: 0.061, newBuyerCvr: 0.0041 },
  },

  // Ricola — Cold Relief
  {
    id: 'ricola-cr1-geo1',
    creativeId: 'ricola-cr1',
    clientId: 'ricola',
    dma: 'New York, NY',
    dmaCode: 501,
    impressions: 2640000,
    spend: 8120,
    metrics: { conversionRate: 0.068, newBuyerCvr: 0.0048 },
  },
  {
    id: 'ricola-cr1-geo2',
    creativeId: 'ricola-cr1',
    clientId: 'ricola',
    dma: 'Chicago, IL',
    dmaCode: 602,
    impressions: 1820000,
    spend: 5640,
    metrics: { conversionRate: 0.064, newBuyerCvr: 0.0044 },
  },
  {
    id: 'ricola-cr1-geo3',
    creativeId: 'ricola-cr1',
    clientId: 'ricola',
    dma: 'Boston, MA',
    dmaCode: 506,
    impressions: 1240000,
    spend: 3820,
    metrics: { conversionRate: 0.071, newBuyerCvr: 0.0052 },
  },
  {
    id: 'ricola-cr1-geo4',
    creativeId: 'ricola-cr1',
    clientId: 'ricola',
    dma: 'Minneapolis-St. Paul, MN',
    dmaCode: 613,
    impressions: 980000,
    spend: 2840,
    metrics: { conversionRate: 0.069, newBuyerCvr: 0.0049 },
  },

  // Spirit Airlines
  {
    id: 'spirit-cr1-geo1',
    creativeId: 'spirit-cr1',
    clientId: 'spirit',
    dma: 'Miami-Ft. Lauderdale, FL',
    dmaCode: 528,
    impressions: 2100000,
    spend: 7420,
    metrics: { conversionRate: 0.042, newBuyerCvr: 0.0032 },
  },
  {
    id: 'spirit-cr1-geo2',
    creativeId: 'spirit-cr1',
    clientId: 'spirit',
    dma: 'Orlando-Daytona Beach, FL',
    dmaCode: 534,
    impressions: 1640000,
    spend: 5910,
    metrics: { conversionRate: 0.038, newBuyerCvr: 0.0029 },
  },
  {
    id: 'spirit-cr1-geo3',
    creativeId: 'spirit-cr1',
    clientId: 'spirit',
    dma: 'Atlanta, GA',
    dmaCode: 524,
    impressions: 1280000,
    spend: 4620,
    metrics: { conversionRate: 0.034, newBuyerCvr: 0.0026 },
  },
]

export const geosById = Object.fromEntries(geos.map((g) => [g.id, g]))

export const geosByCreative = geos.reduce((acc, g) => {
  if (!acc[g.creativeId]) acc[g.creativeId] = []
  acc[g.creativeId].push(g)
  return acc
}, {})
