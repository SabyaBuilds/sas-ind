import assert from 'node:assert/strict'
import { demoRateCard } from './pricingSeed.js'
import { calculateQuote, recalculateSnapshotAddons } from './quoteCalculator.js'
import { formatInrRange } from './currency.js'

const answers = {
  projectCategory: 'New construction from scratch',
  propertyType: 'personal',
  areaSqFt: 1000,
  pricingZone: 'metro',
  finishLevel: 'standard',
  needsArchitectConsult: 'no',
}

const residential = calculateQuote(answers, demoRateCard)
assert.equal(residential.status, 'matched')
assert.deepEqual(residential.totalPaise, [220000000, 320000000])

const commercial = calculateQuote({ ...answers, propertyType: 'commercial' }, demoRateCard)
assert.equal(commercial.status, 'matched')
assert.ok(commercial.totalPaise[0] > residential.totalPaise[0])

const premiumRemote = calculateQuote({ ...answers, pricingZone: 'remote', finishLevel: 'premium' }, demoRateCard)
assert.ok(premiumRemote.totalPaise[0] > residential.totalPaise[0])

assert.equal(calculateQuote({ ...answers, areaSqFt: 300 }, demoRateCard).status, 'matched')
assert.equal(calculateQuote({ ...answers, areaSqFt: 100000 }, demoRateCard).status, 'matched')
assert.equal(calculateQuote({ ...answers, areaSqFt: 100001 }, demoRateCard).status, 'manual-review')

const addonPlan = calculateQuote(answers, demoRateCard, ['soil-report'])
assert.ok(addonPlan.totalPaise[0] > residential.totalPaise[0])
assert.deepEqual(calculateQuote({ ...answers, projectCategory: 'Interior design only' }, demoRateCard, ['soil-report']).selectedAddonIds, [])
assert.deepEqual(recalculateSnapshotAddons(addonPlan, []).totalPaise, residential.totalPaise)
assert.deepEqual(recalculateSnapshotAddons(residential, ['soil-report']).totalPaise, addonPlan.totalPaise)

const draftCard = { ...demoRateCard, status: 'draft' }
assert.equal(calculateQuote(answers, draftCard).status, 'manual-review')
assert.equal(calculateQuote(answers, draftCard, [], { allowDraft: true }).status, 'matched')
assert.equal(formatInrRange(180000000, 210000000), '₹18,00,000–₹21,00,000')

const snapshot = calculateQuote(answers, demoRateCard)
const changedCard = { ...demoRateCard, rules: demoRateCard.rules.map((rule) => ({ ...rule, lowRatePaisePerSqFt: rule.lowRatePaisePerSqFt + 100 })) }
calculateQuote(answers, changedCard)
assert.deepEqual(snapshot.totalPaise, residential.totalPaise)

console.log('quoteCalculator tests passed')
