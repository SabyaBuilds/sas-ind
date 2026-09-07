import { rateCardRepository } from './rateCardRepository.js'

const percentOf = (amount, percent) => Math.round((amount * percent) / 100)

const applyAdjustment = (range, adjustment) => {
  if (adjustment.type === 'fixed') return range.map((value) => value + adjustment.lowPaise)
  return range.map((value) => value + percentOf(value, adjustment.percent))
}

const matchesRule = (rule, answers) => {
  const area = Number(answers.areaSqFt)
  return rule.projectCategory === answers.projectCategory
    && rule.propertyType === answers.propertyType
    && rule.zoneId === answers.pricingZone
    && rule.finishLevelId === answers.finishLevel
    && Number.isFinite(area)
    && area >= rule.minAreaSqFt
    && area <= rule.maxAreaSqFt
}

const emptyPlan = (answers = {}, reason = 'No published pricing rule matches these inputs.') => ({
  status: 'manual-review',
  reason,
  projectType: answers.projectCategory || 'Project',
  recommendedServices: [],
  nextSteps: [],
  durationWeeks: null,
  lineItems: [],
  eligibleAddons: [],
  totalPaise: null,
})

export const calculateQuote = (answers = {}, rateCard = rateCardRepository.getPublishedRateCard(), selectedAddonIds = [], { allowDraft = false } = {}) => {
  if (!rateCard || (rateCard.status !== 'published' && !allowDraft)) return emptyPlan(answers, 'A published rate card is not available.')
  const matchingRules = rateCard.rules.filter((rule) => matchesRule(rule, answers))
  if (matchingRules.length !== 1) return emptyPlan(answers, matchingRules.length ? 'Multiple published pricing rules match these inputs.' : undefined)

  const rule = matchingRules[0]
  const zone = rateCard.zones.find((item) => item.id === answers.pricingZone)
  const finish = rateCard.finishes.find((item) => item.id === answers.finishLevel)
  const area = Number(answers.areaSqFt)
  let range = [area * rule.lowRatePaisePerSqFt, area * rule.highRatePaisePerSqFt]
  const lineItems = [{ label: 'Base project cost', lowPaise: range[0], highPaise: range[1] }]

  if (zone?.multiplier && zone.multiplier !== 1) {
    const before = range
    range = range.map((value) => Math.round(value * zone.multiplier))
    lineItems.push({ label: `Location adjustment: ${zone.name}`, lowPaise: range[0] - before[0], highPaise: range[1] - before[1] })
  }
  if (finish?.multiplier && finish.multiplier !== 1) {
    const before = range
    range = range.map((value) => Math.round(value * finish.multiplier))
    lineItems.push({ label: `Finish level adjustment: ${finish.name}`, lowPaise: range[0] - before[0], highPaise: range[1] - before[1] })
  }
  const applicableAdjustments = (rule.adjustments || []).filter((adjustment) => answers[adjustment.conditionField] === adjustment.conditionValue)
  applicableAdjustments.forEach((adjustment) => {
    const before = range
    range = applyAdjustment(range, adjustment)
    lineItems.push({ label: adjustment.label, lowPaise: range[0] - before[0], highPaise: range[1] - before[1] })
  })

  const eligibleAddons = rateCard.addons.filter((addon) => (addon.eligibleCategories || []).includes(answers.projectCategory) && (addon.eligiblePropertyTypes || []).includes(answers.propertyType))
  const selectedAddons = eligibleAddons.filter((addon) => selectedAddonIds.includes(addon.id))
  selectedAddons.forEach((addon) => {
    range = [range[0] + addon.lowPricePaise, range[1] + addon.highPricePaise]
    lineItems.push({ label: `Optional add-on: ${addon.name}`, lowPaise: addon.lowPricePaise, highPaise: addon.highPricePaise, isAddon: true })
  })

  return {
    status: 'matched',
    projectType: `${answers.propertyType === 'commercial' ? 'Commercial' : 'Residential'} ${rule.projectCategory}`,
    recommendedServices: rule.services,
    nextSteps: rule.nextSteps,
    inclusions: rule.inclusions,
    exclusions: rule.exclusions,
    durationWeeks: rule.timelineWeeks,
    lineItems,
    eligibleAddons,
    selectedAddonIds: selectedAddons.map((addon) => addon.id),
    totalPaise: range,
    rateCardVersion: rateCard.version,
    matchedRuleId: rule.id,
    selectedTemplateId: rule.templateId || rule.projectCategory,
  }
}

// Re-price add-ons from the quote's saved calculation output.  This deliberately
// does not consult the current rate card: a customer returning to an older quote
// must continue to see the prices that were available when it was created.
export const recalculateSnapshotAddons = (snapshot, selectedAddonIds = []) => {
  if (!snapshot || snapshot.status !== 'matched') return snapshot
  const addonsById = new Map((snapshot.eligibleAddons || []).map((addon) => [addon.id, addon]))
  const eligibleSelectedIds = [...new Set(selectedAddonIds)].filter((id) => addonsById.has(id))
  // Prices are kept in paise, exactly as stored in the original quote snapshot.
  const withoutAddons = (snapshot.selectedAddonIds || []).reduce((range, id) => {
    const addon = addonsById.get(id)
    return addon ? [range[0] - addon.lowPricePaise, range[1] - addon.highPricePaise] : range
  }, [snapshot.totalPaise?.[0] || 0, snapshot.totalPaise?.[1] || 0])
  const totalPaise = eligibleSelectedIds.reduce((range, id) => {
    const addon = addonsById.get(id)
    return [range[0] + addon.lowPricePaise, range[1] + addon.highPricePaise]
  }, withoutAddons)
  const lineItems = (snapshot.lineItems || []).filter((item) => !item.isAddon && !item.label?.startsWith('Optional add-on:'))
  eligibleSelectedIds.forEach((id) => {
    const addon = addonsById.get(id)
    lineItems.push({ label: `Optional add-on: ${addon.name}`, lowPaise: addon.lowPricePaise, highPaise: addon.highPricePaise, isAddon: true })
  })
  return { ...snapshot, lineItems, selectedAddonIds: eligibleSelectedIds, totalPaise }
}

export const validatePricingAnswers = (answers = {}, rateCard = rateCardRepository.getPublishedRateCard()) => {
  const errors = {}
  if (!Number.isFinite(Number(answers.areaSqFt)) || Number(answers.areaSqFt) <= 0) errors.areaSqFt = 'Enter a positive project area in square feet.'
  if (!rateCard?.zones.some((zone) => zone.id === answers.pricingZone)) errors.pricingZone = 'Select a configured pricing zone.'
  if (!rateCard?.finishes.some((finish) => finish.id === answers.finishLevel)) errors.finishLevel = 'Select a configured finish level.'
  return errors
}

export const findRuleOverlaps = (rules = []) => rules.flatMap((rule, index) => rules.slice(index + 1).filter((other) => (
  rule.projectCategory === other.projectCategory
    && rule.propertyType === other.propertyType
    && rule.zoneId === other.zoneId
    && rule.finishLevelId === other.finishLevelId
    && rule.minAreaSqFt <= other.maxAreaSqFt
    && other.minAreaSqFt <= rule.maxAreaSqFt
)).map((other) => [rule.id, other.id]))
