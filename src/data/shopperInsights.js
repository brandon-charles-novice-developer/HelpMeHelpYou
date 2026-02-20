// Shopper Insights — 6 modules per client
// Modules: Switching Behavior, Loyalty Segments, Cross-Purchase,
//          Category Insights, Basket Association, Purchase Propensity

export const shopperInsights = {
  kayak: {
    clientId: 'kayak',

    switching: {
      title: 'Switching Behavior',
      primary: { brand: 'Kayak', share: 0.42 },
      competitors: [
        { brand: 'Expedia', switchedTo: 0.28, switchedFrom: 0.18, net: -0.10 },
        { brand: 'Google Flights', switchedTo: 0.22, switchedFrom: 0.14, net: -0.08 },
        { brand: 'Booking.com', switchedTo: 0.12, switchedFrom: 0.08, net: -0.04 },
        { brand: 'Priceline', switchedTo: 0.10, switchedFrom: 0.12, net: +0.02 },
      ],
      insight: '28% of Kayak\'s target audience used Expedia in the last 60 days. Flight search-to-book gap widest on mobile.',
    },

    loyalty: {
      title: 'Loyalty Segments',
      segments: [
        { label: 'High-Frequency / High-Value', share: 0.22, color: '#22C55E', hhiIndex: 142 },
        { label: 'Moderate (1–2 bookings / year)', share: 0.31, color: '#5C70D6', hhiIndex: 108 },
        { label: 'Lapsed (0–6 months)', share: 0.28, color: '#F59E0B', hhiIndex: 96 },
        { label: 'Dormant (6–12 months)', share: 0.19, color: '#EF4444', hhiIndex: 82 },
      ],
      insight: 'Lapsed segment (28%) shows 10-day propensity spike — high re-engagement value at lower acquisition cost.',
    },

    crossPurchase: {
      title: 'Cross-Purchase',
      pairs: [
        { brand: 'Expedia Hotels', overlapRate: 0.44, index: 162 },
        { brand: 'Uber (Airport)', overlapRate: 0.61, index: 188 },
        { brand: 'Starbucks', overlapRate: 0.38, index: 122 },
        { brand: 'Delta SkyMiles', overlapRate: 0.29, index: 148 },
      ],
      insight: '61% of Kayak purchasers also used Uber within 48 hours — strong airport-use correlation.',
    },

    category: {
      title: 'Category Insights',
      data: [
        { category: 'OTA (Online Travel Agency)', share: 0.52, index: 168 },
        { category: 'Hotel Direct', share: 0.28, index: 114 },
        { category: 'Airline Direct', share: 0.31, index: 127 },
        { category: 'Car Rental', share: 0.18, index: 142 },
      ],
    },

    basket: {
      title: 'Basket Association',
      associations: [
        { item: 'Travel Insurance', coRate: 0.38, lift: 2.8 },
        { item: 'Airport Lounge Pass', coRate: 0.22, lift: 3.4 },
        { item: 'Premium Luggage', coRate: 0.18, lift: 2.1 },
        { item: 'Currency Exchange App', coRate: 0.14, lift: 4.2 },
      ],
      insight: 'Currency exchange app co-purchase has highest lift (4.2x) — indicator of international travel intent.',
    },

    propensity: {
      title: 'Purchase Propensity',
      windows: [
        { window: '10-day', score: 84, converters: 94000, label: 'High' },
        { window: '30-day', score: 91, converters: 248000, label: 'Very High' },
        { window: '60-day', score: 88, converters: 412000, label: 'High' },
        { window: '90-day', score: 82, converters: 584000, label: 'High' },
      ],
      insight: '30-day window captures peak booking intent — spring travel demand elevating all propensity tiers.',
    },
  },

  spirit: {
    clientId: 'spirit',

    switching: {
      title: 'Switching Behavior',
      primary: { brand: 'Spirit Airlines', share: 0.31 },
      competitors: [
        { brand: 'Frontier Airlines', switchedTo: 0.18, switchedFrom: 0.12, net: -0.06 },
        { brand: 'Southwest', switchedTo: 0.24, switchedFrom: 0.16, net: -0.08 },
        { brand: 'American Airlines', switchedTo: 0.14, switchedFrom: 0.08, net: -0.06 },
        { brand: 'United Airlines', switchedTo: 0.09, switchedFrom: 0.06, net: -0.03 },
      ],
      insight: '18% of Spirit\'s target audience switched to Frontier in the last 60 days — price-led defection, not service.',
    },

    loyalty: {
      title: 'Loyalty Segments',
      segments: [
        { label: 'High-Frequency Leisure (4+ flights)', share: 0.18, color: '#22C55E', hhiIndex: 84 },
        { label: 'Moderate (2–3 flights)', share: 0.34, color: '#5C70D6', hhiIndex: 92 },
        { label: 'Lapsed (0–6 months)', share: 0.28, color: '#F59E0B', hhiIndex: 88 },
        { label: 'Dormant (6–12 months)', share: 0.20, color: '#EF4444', hhiIndex: 76 },
      ],
      insight: 'Lapsed + Dormant segments represent 48% of audience — win-back campaign timing optimal.',
    },

    crossPurchase: {
      title: 'Cross-Purchase',
      pairs: [
        { brand: 'Airbnb', overlapRate: 0.42, index: 154 },
        { brand: 'Uber', overlapRate: 0.58, index: 172 },
        { brand: 'McDonald\'s', overlapRate: 0.48, index: 118 },
        { brand: 'FanDuel', overlapRate: 0.22, index: 188 },
      ],
      insight: 'High Uber overlap (58%) validates urban-to-airport behavioral cluster — addressable in same TTD plan.',
    },

    category: {
      title: 'Category Insights',
      data: [
        { category: 'Budget Airlines', share: 0.64, index: 224 },
        { category: 'OTA Booking', share: 0.38, index: 142 },
        { category: 'Car Rental (Budget)', share: 0.24, index: 168 },
        { category: 'Hotel (Economy)', share: 0.31, index: 138 },
      ],
    },

    basket: {
      title: 'Basket Association',
      associations: [
        { item: 'Checked Bag Add-On', coRate: 0.62, lift: 2.1 },
        { item: 'Seat Upgrade', coRate: 0.34, lift: 1.8 },
        { item: 'Travel Snacks (Gas Station)', coRate: 0.41, lift: 1.4 },
        { item: 'Budget Hotel (2-star)', coRate: 0.28, lift: 2.8 },
      ],
      insight: 'Budget hotel co-purchase (28%) with highest lift (2.8x) — bundle pricing test recommended.',
    },

    propensity: {
      title: 'Purchase Propensity',
      windows: [
        { window: '10-day', score: 88, converters: 62000, label: 'Very High' },
        { window: '30-day', score: 81, converters: 148000, label: 'High' },
        { window: '60-day', score: 74, converters: 228000, label: 'Moderate' },
        { window: '90-day', score: 68, converters: 302000, label: 'Moderate' },
      ],
      insight: '10-day window dominates — flight bookings have short consideration windows. Recency is everything.',
    },
  },

  ricola: {
    clientId: 'ricola',

    switching: {
      title: 'Switching Behavior',
      primary: { brand: 'Ricola', share: 0.29 },
      competitors: [
        { brand: 'Halls', switchedTo: 0.41, switchedFrom: 0.28, net: -0.13 },
        { brand: 'Luden\'s', switchedTo: 0.12, switchedFrom: 0.08, net: -0.04 },
        { brand: 'Cepacol', switchedTo: 0.08, switchedFrom: 0.06, net: -0.02 },
        { brand: 'Store Brand', switchedTo: 0.14, switchedFrom: 0.10, net: -0.04 },
      ],
      insight: 'Halls is the primary switch destination at 41% — menthol variants driving trade. Natural/herbal positioning is Ricola\'s differentiated claim.',
    },

    loyalty: {
      title: 'Loyalty Segments',
      segments: [
        { label: 'Seasonal Heavy (Q1 + Q4)', share: 0.28, color: '#22C55E', hhiIndex: 116 },
        { label: 'Year-Round Moderate', share: 0.24, color: '#5C70D6', hhiIndex: 108 },
        { label: 'Lapsed Seasonal', share: 0.31, color: '#F59E0B', hhiIndex: 98 },
        { label: 'Category Switchers', share: 0.17, color: '#EF4444', hhiIndex: 84 },
      ],
      insight: 'Lapsed Seasonal (31%) represents best re-activation target — cold season propensity index at 3.2x.',
    },

    crossPurchase: {
      title: 'Cross-Purchase',
      pairs: [
        { brand: 'Herbal Tea (Celestial)', overlapRate: 0.67, index: 212 },
        { brand: 'Vitamin C Supplement', overlapRate: 0.52, index: 184 },
        { brand: 'Elderberry Products', overlapRate: 0.31, index: 248 },
        { brand: 'Zinc Lozenges', overlapRate: 0.24, index: 196 },
      ],
      insight: 'Elderberry co-purchase has the highest index (248) — a wellness-forward audience segment worth targeting independently.',
    },

    category: {
      title: 'Category Insights',
      data: [
        { category: 'Throat / Cough Lozenges', share: 0.58, index: 194 },
        { category: 'Natural Remedies', share: 0.44, index: 226 },
        { category: 'Cold & Flu OTC', share: 0.38, index: 148 },
        { category: 'Immune Support', share: 0.29, index: 164 },
      ],
    },

    basket: {
      title: 'Basket Association',
      associations: [
        { item: 'Herbal Tea', coRate: 0.67, lift: 3.8 },
        { item: 'Vitamin C', coRate: 0.52, lift: 2.9 },
        { item: 'Elderberry', coRate: 0.31, lift: 4.6 },
        { item: 'NyQuil / DayQuil', coRate: 0.28, lift: 1.6 },
      ],
      insight: 'Elderberry basket association (31% rate, 4.6x lift) signals a health-forward segment willing to pay a premium.',
    },

    propensity: {
      title: 'Purchase Propensity',
      windows: [
        { window: '10-day', score: 94, converters: 128000, label: 'Very High' },
        { window: '30-day', score: 91, converters: 348000, label: 'Very High' },
        { window: '60-day', score: 82, converters: 614000, label: 'High' },
        { window: '90-day', score: 74, converters: 882000, label: 'Moderate' },
      ],
      insight: 'Q1 cold-flu season driving propensity index to 3.2x annual baseline across all windows. Peak spend period.',
    },
  },

  newell: {
    clientId: 'newell',

    switching: {
      title: 'Switching Behavior',
      primary: { brand: 'Rubbermaid', share: 0.36 },
      competitors: [
        { brand: 'Sterilite', switchedTo: 0.28, switchedFrom: 0.18, net: -0.10 },
        { brand: 'OXO', switchedTo: 0.16, switchedFrom: 0.12, net: -0.04 },
        { brand: 'IRIS USA', switchedTo: 0.12, switchedFrom: 0.08, net: -0.04 },
        { brand: 'Store Brand', switchedTo: 0.18, switchedFrom: 0.14, net: -0.04 },
      ],
      insight: 'Sterilite capturing switching volume (28%) on price. Rubbermaid\'s warranty and durability message is the retention lever.',
    },

    loyalty: {
      title: 'Loyalty Segments',
      segments: [
        { label: 'High-Value (Multi-SKU, Multi-Brand)', share: 0.24, color: '#22C55E', hhiIndex: 138 },
        { label: 'Moderate Repeat', share: 0.36, color: '#5C70D6', hhiIndex: 112 },
        { label: 'Single-Purchase Lapsed', share: 0.28, color: '#F59E0B', hhiIndex: 94 },
        { label: 'Dormant 6+ months', share: 0.12, color: '#EF4444', hhiIndex: 78 },
      ],
      insight: 'Multi-brand buyers (Rubbermaid + Coleman + Sharpie) show 34% higher LTV — cross-brand strategy is highest leverage play.',
    },

    crossPurchase: {
      title: 'Cross-Purchase',
      pairs: [
        { brand: 'Coleman', overlapRate: 0.34, index: 168 },
        { brand: 'Sharpie', overlapRate: 0.48, index: 144 },
        { brand: 'Glad Storage', overlapRate: 0.28, index: 122 },
        { brand: 'Clorox', overlapRate: 0.41, index: 116 },
      ],
      insight: '34% of Rubbermaid buyers co-purchase Coleman — spring organization campaigns can bridge outdoor prep.',
    },

    category: {
      title: 'Category Insights',
      data: [
        { category: 'Storage & Organization', share: 0.62, index: 188 },
        { category: 'Outdoor / Camping', share: 0.34, index: 148 },
        { category: 'Writing Instruments', share: 0.44, index: 124 },
        { category: 'Cleaning Supplies', share: 0.38, index: 118 },
      ],
    },

    basket: {
      title: 'Basket Association',
      associations: [
        { item: 'Coleman Cooler', coRate: 0.34, lift: 3.2 },
        { item: 'Sharpie Multi-Pack', coRate: 0.48, lift: 1.8 },
        { item: 'Ziploc Bags', coRate: 0.52, lift: 1.4 },
        { item: 'Label Maker', coRate: 0.22, lift: 4.1 },
      ],
      insight: 'Label maker co-purchase (4.1x lift) signals an organization-completionist buyer — high LTV potential.',
    },

    propensity: {
      title: 'Purchase Propensity',
      windows: [
        { window: '10-day', score: 71, converters: 84000, label: 'Moderate' },
        { window: '30-day', score: 78, converters: 224000, label: 'High' },
        { window: '60-day', score: 82, converters: 408000, label: 'High' },
        { window: '90-day', score: 80, converters: 582000, label: 'High' },
      ],
      insight: '60-day window outperforms shorter windows — home organization purchases have longer consideration cycles.',
    },
  },

  indeed: {
    clientId: 'indeed',

    switching: {
      title: 'Switching Behavior',
      primary: { brand: 'Indeed', share: 0.48 },
      competitors: [
        { brand: 'LinkedIn Jobs', switchedTo: 0.34, switchedFrom: 0.22, net: -0.12 },
        { brand: 'ZipRecruiter', switchedTo: 0.18, switchedFrom: 0.14, net: -0.04 },
        { brand: 'Glassdoor', switchedTo: 0.12, switchedFrom: 0.08, net: -0.04 },
        { brand: 'Monster', switchedTo: 0.06, switchedFrom: 0.08, net: +0.02 },
      ],
      insight: 'LinkedIn capturing 34% switching — professional network overlap. Indeed\'s volume advantage and UX are retention drivers.',
    },

    loyalty: {
      title: 'Loyalty Segments',
      segments: [
        { label: 'Active Job Seeker (Daily)', share: 0.22, color: '#22C55E', hhiIndex: 94 },
        { label: 'Passive (Weekly Check)', share: 0.38, color: '#5C70D6', hhiIndex: 108 },
        { label: 'Life Event Trigger', share: 0.28, color: '#F59E0B', hhiIndex: 124 },
        { label: 'Dormant Candidate', share: 0.12, color: '#EF4444', hhiIndex: 76 },
      ],
      insight: 'Life Event segment (28%) shows highest conversion propensity — life transitions correlate with 60-day registration spikes.',
    },

    crossPurchase: {
      title: 'Cross-Purchase',
      pairs: [
        { brand: 'LinkedIn Premium', overlapRate: 0.42, index: 194 },
        { brand: 'Coursera / Udemy', overlapRate: 0.28, index: 218 },
        { brand: 'Suit / Interview Attire', overlapRate: 0.16, index: 248 },
        { brand: 'Resume Writing Service', overlapRate: 0.12, index: 312 },
      ],
      insight: 'Resume writing service co-purchase (12% rate, 3.12x lift) is the highest-intent signal in the purchase graph.',
    },

    category: {
      title: 'Category Insights',
      data: [
        { category: 'Job Search Platform', share: 0.74, index: 188 },
        { category: 'Professional Development', share: 0.36, index: 164 },
        { category: 'Interview Prep (Books/Apps)', share: 0.24, index: 212 },
        { category: 'Career Coaching', share: 0.14, index: 248 },
      ],
    },

    basket: {
      title: 'Basket Association',
      associations: [
        { item: 'LinkedIn Premium (Monthly)', coRate: 0.42, lift: 2.8 },
        { item: 'Online Course Platform', coRate: 0.28, lift: 3.4 },
        { item: 'Business Casual Attire', coRate: 0.16, lift: 4.8 },
        { item: 'Resume Paper / Printing', coRate: 0.08, lift: 6.2 },
      ],
      insight: 'Resume paper co-purchase (6.2x lift) — the most precise signal of active, imminent job application behavior.',
    },

    propensity: {
      title: 'Purchase Propensity',
      windows: [
        { window: '10-day', score: 86, converters: 44000, label: 'High' },
        { window: '30-day', score: 91, converters: 118000, label: 'Very High' },
        { window: '60-day', score: 84, converters: 196000, label: 'High' },
        { window: '90-day', score: 76, converters: 268000, label: 'High' },
      ],
      insight: '30-day window is peak — job search intensity concentrates in 3–4 week bursts following a life event trigger.',
    },
  },
}
