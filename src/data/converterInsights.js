// Converter Insights — who actually bought
// Demographics + Psychographics per client (from In-Flight Measurement)

export const converterInsights = {
  kayak: {
    clientId: 'kayak',
    label: 'Verified Travel Converters',

    demographics: [
      { label: 'Age', attain: [
        { segment: '18–24', pct: 0.08, census: 0.14 },
        { segment: '25–34', pct: 0.26, census: 0.18 },
        { segment: '35–44', pct: 0.29, census: 0.17 },
        { segment: '45–54', pct: 0.22, census: 0.16 },
        { segment: '55+',   pct: 0.15, census: 0.35 },
      ]},
      { label: 'Gender', attain: [
        { segment: 'Female', pct: 0.54, census: 0.51 },
        { segment: 'Male', pct: 0.44, census: 0.49 },
        { segment: 'Non-binary / Other', pct: 0.02, census: 0.01 },
      ]},
      { label: 'HHI', attain: [
        { segment: '<$50K', pct: 0.12, census: 0.28 },
        { segment: '$50–$100K', pct: 0.28, census: 0.32 },
        { segment: '$100–$150K', pct: 0.32, census: 0.22 },
        { segment: '$150K+', pct: 0.28, census: 0.18 },
      ]},
      { label: 'Generation', attain: [
        { segment: 'Gen Z', pct: 0.12, census: 0.18 },
        { segment: 'Millennial', pct: 0.42, census: 0.28 },
        { segment: 'Gen X', pct: 0.31, census: 0.22 },
        { segment: 'Boomer+', pct: 0.15, census: 0.32 },
      ]},
    ],

    psychographics: [
      { label: 'Streaming', top: ['Netflix (82%)', 'Hulu (61%)', 'HBO Max (48%)'] },
      { label: 'Social Media', top: ['Instagram (74%)', 'TikTok (52%)', 'Pinterest (38%)'] },
      { label: 'Tech Interest', top: ['Early Adopter (44%)', 'Travel Apps (78%)', 'Smart Home (36%)'] },
      { label: 'Memberships', top: ['Amazon Prime (88%)', 'Costco (32%)', 'TSA PreCheck (41%)'] },
      { label: 'Life Events', top: ['Upcoming Vacation (94%)', 'Wedding / Event (28%)', 'Work Travel (41%)'] },
    ],
  },

  ricola: {
    clientId: 'ricola',
    label: 'Verified Health Purchase Converters',

    demographics: [
      { label: 'Age', attain: [
        { segment: '18–24', pct: 0.06, census: 0.14 },
        { segment: '25–34', pct: 0.18, census: 0.18 },
        { segment: '35–44', pct: 0.24, census: 0.17 },
        { segment: '45–54', pct: 0.28, census: 0.16 },
        { segment: '55+',   pct: 0.24, census: 0.35 },
      ]},
      { label: 'Gender', attain: [
        { segment: 'Female', pct: 0.62, census: 0.51 },
        { segment: 'Male', pct: 0.36, census: 0.49 },
        { segment: 'Non-binary / Other', pct: 0.02, census: 0.01 },
      ]},
      { label: 'HHI', attain: [
        { segment: '<$50K', pct: 0.22, census: 0.28 },
        { segment: '$50–$100K', pct: 0.38, census: 0.32 },
        { segment: '$100–$150K', pct: 0.26, census: 0.22 },
        { segment: '$150K+', pct: 0.14, census: 0.18 },
      ]},
      { label: 'Homeownership', attain: [
        { segment: 'Homeowner', pct: 0.58, census: 0.64 },
        { segment: 'Renter', pct: 0.42, census: 0.36 },
      ]},
    ],

    psychographics: [
      { label: 'Streaming', top: ['Netflix (68%)', 'Disney+ (44%)', 'Discovery+ (38%)'] },
      { label: 'Social Media', top: ['Facebook (61%)', 'Pinterest (48%)', 'YouTube (72%)'] },
      { label: 'Tech Interest', top: ['Health Apps (64%)', 'Smart Devices (28%)', 'Standard Adopter (58%)'] },
      { label: 'Memberships', top: ['CVS ExtraCare (82%)', 'Walgreens myWalgreens (68%)', 'Amazon Prime (74%)'] },
      { label: 'Life Events', top: ['Current Illness (84%)', 'Young Children at Home (42%)', 'Caregiver (31%)'] },
    ],
  },

  spirit: {
    clientId: 'spirit',
    label: 'Verified Flight Purchase Converters',

    demographics: [
      { label: 'Age', attain: [
        { segment: '18–24', pct: 0.22, census: 0.14 },
        { segment: '25–34', pct: 0.34, census: 0.18 },
        { segment: '35–44', pct: 0.24, census: 0.17 },
        { segment: '45–54', pct: 0.14, census: 0.16 },
        { segment: '55+',   pct: 0.06, census: 0.35 },
      ]},
      { label: 'Gender', attain: [
        { segment: 'Female', pct: 0.52, census: 0.51 },
        { segment: 'Male', pct: 0.46, census: 0.49 },
        { segment: 'Non-binary / Other', pct: 0.02, census: 0.01 },
      ]},
      { label: 'HHI', attain: [
        { segment: '<$50K', pct: 0.38, census: 0.28 },
        { segment: '$50–$100K', pct: 0.42, census: 0.32 },
        { segment: '$100–$150K', pct: 0.14, census: 0.22 },
        { segment: '$150K+', pct: 0.06, census: 0.18 },
      ]},
      { label: 'Children in HH', attain: [
        { segment: 'No children', pct: 0.58, census: 0.54 },
        { segment: 'Children present', pct: 0.42, census: 0.46 },
      ]},
    ],

    psychographics: [
      { label: 'Streaming', top: ['Netflix (72%)', 'Tubi (38%)', 'Amazon Prime Video (54%)'] },
      { label: 'Social Media', top: ['TikTok (64%)', 'Instagram (58%)', 'Snapchat (42%)'] },
      { label: 'Tech Interest', top: ['Budget Comparison Apps (78%)', 'Mobile-First (84%)', 'Price Alert Tools (62%)'] },
      { label: 'Memberships', top: ['None / Minimal (44%)', 'Amazon Prime (62%)', 'Walmart+ (28%)'] },
      { label: 'Life Events', top: ['Spring Break Trip (72%)', 'Family Visit (48%)', 'Concert / Festival (34%)'] },
    ],
  },

  newell: {
    clientId: 'newell',
    label: 'Verified Home Goods Converters',

    demographics: [
      { label: 'Age', attain: [
        { segment: '18–24', pct: 0.08, census: 0.14 },
        { segment: '25–34', pct: 0.22, census: 0.18 },
        { segment: '35–44', pct: 0.32, census: 0.17 },
        { segment: '45–54', pct: 0.24, census: 0.16 },
        { segment: '55+',   pct: 0.14, census: 0.35 },
      ]},
      { label: 'Gender', attain: [
        { segment: 'Female', pct: 0.66, census: 0.51 },
        { segment: 'Male', pct: 0.32, census: 0.49 },
        { segment: 'Non-binary / Other', pct: 0.02, census: 0.01 },
      ]},
      { label: 'Homeownership', attain: [
        { segment: 'Homeowner', pct: 0.72, census: 0.64 },
        { segment: 'Renter', pct: 0.28, census: 0.36 },
      ]},
      { label: 'Education', attain: [
        { segment: 'College+', pct: 0.62, census: 0.52 },
        { segment: 'High School / Some College', pct: 0.38, census: 0.48 },
      ]},
    ],

    psychographics: [
      { label: 'Streaming', top: ['Netflix (74%)', 'Amazon Prime Video (62%)', 'HGTV Go (48%)'] },
      { label: 'Social Media', top: ['Pinterest (72%)', 'Facebook (64%)', 'Instagram (52%)'] },
      { label: 'Tech Interest', top: ['Smart Home (44%)', 'Standard Adopter (48%)', 'Price Comparison (68%)'] },
      { label: 'Memberships', top: ['Costco (54%)', 'Amazon Prime (88%)', 'Target Circle (62%)'] },
      { label: 'Life Events', top: ['Recent Move (28%)', 'Spring Cleaning (64%)', 'Baby / Nursery Setup (18%)'] },
    ],
  },

  indeed: {
    clientId: 'indeed',
    label: 'Verified Platform Registration Converters',

    demographics: [
      { label: 'Age', attain: [
        { segment: '18–24', pct: 0.28, census: 0.14 },
        { segment: '25–34', pct: 0.36, census: 0.18 },
        { segment: '35–44', pct: 0.22, census: 0.17 },
        { segment: '45–54', pct: 0.10, census: 0.16 },
        { segment: '55+',   pct: 0.04, census: 0.35 },
      ]},
      { label: 'Gender', attain: [
        { segment: 'Female', pct: 0.52, census: 0.51 },
        { segment: 'Male', pct: 0.46, census: 0.49 },
        { segment: 'Non-binary / Other', pct: 0.02, census: 0.01 },
      ]},
      { label: 'Education', attain: [
        { segment: 'Graduate Degree', pct: 0.28, census: 0.14 },
        { segment: 'College Degree', pct: 0.44, census: 0.38 },
        { segment: 'Some College', pct: 0.22, census: 0.28 },
        { segment: 'High School', pct: 0.06, census: 0.20 },
      ]},
      { label: 'Marital Status', attain: [
        { segment: 'Single', pct: 0.52, census: 0.46 },
        { segment: 'Married', pct: 0.38, census: 0.48 },
        { segment: 'Other', pct: 0.10, census: 0.06 },
      ]},
    ],

    psychographics: [
      { label: 'Streaming', top: ['Netflix (78%)', 'LinkedIn Learning (54%)', 'YouTube (82%)'] },
      { label: 'Social Media', top: ['LinkedIn (88%)', 'Twitter/X (48%)', 'Instagram (52%)'] },
      { label: 'Tech Interest', top: ['Tech-Forward (62%)', 'Productivity Tools (74%)', 'AI / Automation (44%)'] },
      { label: 'Memberships', top: ['LinkedIn Premium (42%)', 'Amazon Prime (74%)', 'Professional Assoc. (28%)'] },
      { label: 'Life Events', top: ['Job Transition (88%)', 'Relocation (22%)', 'Graduation (18%)'] },
    ],
  },
}
