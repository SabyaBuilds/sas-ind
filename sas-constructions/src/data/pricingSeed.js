const demoZones = [
  { id: 'metro', name: 'Metro / Tier 1', multiplier: 1, description: 'Demo admin-entered metro pricing zone.' },
  { id: 'tier-2', name: 'Tier 2 city', multiplier: 0.9, description: 'Demo admin-entered tier 2 pricing zone.' },
  { id: 'remote', name: 'Remote / rural', multiplier: 1.12, description: 'Demo admin-entered remote pricing zone.' },
]

const demoFinishes = [
  { id: 'economy', name: 'Economy', multiplier: 0.85, description: 'Demo admin-entered essential finish package.' },
  { id: 'standard', name: 'Standard', multiplier: 1, description: 'Demo admin-entered standard finish package.' },
  { id: 'premium', name: 'Premium', multiplier: 1.35, description: 'Demo admin-entered premium finish package.' },
]

const categoryLabels = {
  'New construction from scratch': 'New construction',
  'Renovation of existing structure': 'Renovation',
  'Interior design only': 'Interior design',
}

const serviceTemplates = {
  'New construction from scratch': {
    services: ['Architecture consultancy', 'Structural design', 'Interior fit-out'],
    nextSteps: ['Site survey', 'Soil testing', 'Concept design review'],
    inclusions: ['Configured construction scope', 'Project coordination'],
    exclusions: ['Government fees', 'Specialist client-supplied items'],
  },
  'Renovation of existing structure': {
    services: ['Renovation planning', 'Structural assessment'],
    nextSteps: ['Site assessment', 'Scope definition'],
    inclusions: ['Configured renovation scope', 'Project coordination'],
    exclusions: ['Hidden-condition remediation', 'Government fees'],
  },
  'Interior design only': {
    services: ['Interior design', 'Space planning', 'Material selection', 'Vendor sourcing'],
    nextSteps: ['Space planning', 'Material selection', 'Vendor sourcing'],
    inclusions: ['Configured interior design scope'],
    exclusions: ['Construction works', 'Government fees'],
  },
}

const baseRates = {
  'New construction from scratch': { personal: [2200, 3200], commercial: [2500, 3600], timeline: [20, 40] },
  'Renovation of existing structure': { personal: [1400, 2200], commercial: [1700, 2600], timeline: [8, 16] },
  'Interior design only': { personal: [650, 1100], commercial: [800, 1350], timeline: [4, 10] },
}

const buildDemoRules = () => Object.entries(baseRates).flatMap(([category, properties]) => {
  return Object.entries(properties)
    .filter(([key]) => key !== 'timeline')
    .flatMap(([propertyType, rates]) => demoZones.flatMap((zone) => demoFinishes.map((finish) => ({
      id: `${category}-${propertyType}-${zone.id}-${finish.id}`.replaceAll(' ', '-'),
      projectCategory: category,
      propertyType,
      zoneId: zone.id,
      finishLevelId: finish.id,
      minAreaSqFt: 300,
      maxAreaSqFt: 100000,
      lowRatePaisePerSqFt: rates[0] * 100,
      highRatePaisePerSqFt: rates[1] * 100,
      timelineWeeks: properties.timeline,
      adjustments: [
        ...(propertyType === 'commercial' ? [{ id: 'commercial-use', label: 'Commercial/property-use adjustment', conditionField: 'propertyType', conditionValue: 'commercial', type: 'percent', percent: 10 }] : []),
        { id: 'architecture-consultation', label: 'Architecture/design consultation adjustment', conditionField: 'needsArchitectConsult', conditionValue: 'yes', type: 'percent', percent: 5 },
      ],
      ...serviceTemplates[category],
    }))))
})

const demoAddons = [
  { id: 'soil-report', name: 'Soil report', description: 'Configured demo site soil investigation.', lowPricePaise: 350000, highPricePaise: 550000, eligibleCategories: ['New construction from scratch'], eligiblePropertyTypes: ['personal', 'commercial'] },
  { id: 'premium-lighting', name: 'Premium lighting package', description: 'Configured demo lighting upgrade.', lowPricePaise: 180000, highPricePaise: 320000, eligibleCategories: ['New construction from scratch', 'Renovation of existing structure', 'Interior design only'], eligiblePropertyTypes: ['personal', 'commercial'] },
  { id: 'smart-home', name: 'Smart home planning', description: 'Configured demo smart-home planning package.', lowPricePaise: 250000, highPricePaise: 450000, eligibleCategories: ['New construction from scratch', 'Renovation of existing structure'], eligiblePropertyTypes: ['personal'] },
]

export const demoRateCard = {
  id: 'demo-rate-card-v1',
  version: 'demo-v1',
  status: 'published',
  publishedAt: '2026-01-01T00:00:00.000Z',
  isDemoData: true,
  notes: 'Demo/admin-entered data only. Replace with approved business pricing before production use.',
  zones: demoZones,
  finishes: demoFinishes,
  rules: buildDemoRules(),
  addons: demoAddons,
}

export const demoQuoteTemplates = Object.entries(serviceTemplates).map(([category, template]) => ({
  id: category,
  name: categoryLabels[category],
  projectCategory: category,
  ...template,
}))
