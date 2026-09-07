import { demoQuoteTemplates, demoRateCard } from './pricingSeed.js'

const STORAGE_KEY = 'sas-pricing-data-v1'
const memoryStore = { data: null }

const clone = (value) => JSON.parse(JSON.stringify(value))

const validateRateCard = (card) => {
  if (!card || !Array.isArray(card.rules) || !Array.isArray(card.zones) || !Array.isArray(card.finishes) || !Array.isArray(card.addons)) throw new Error('A rate card must include rules, zones, finish levels, and add-ons.')
  const zones = new Set(card.zones.map((zone) => zone.id))
  const finishes = new Set(card.finishes.map((finish) => finish.id))
  const ruleIds = new Set()
  card.rules.forEach((rule) => {
    if (!rule.id || ruleIds.has(rule.id)) throw new Error('Each pricing rule needs a unique ID.')
    ruleIds.add(rule.id)
    if (!zones.has(rule.zoneId) || !finishes.has(rule.finishLevelId)) throw new Error(`Rule ${rule.id} references a missing zone or finish level.`)
    if (!Number.isFinite(rule.minAreaSqFt) || !Number.isFinite(rule.maxAreaSqFt) || rule.minAreaSqFt <= 0 || rule.maxAreaSqFt < rule.minAreaSqFt) throw new Error(`Rule ${rule.id} has an invalid area band.`)
    if (!Number.isFinite(rule.lowRatePaisePerSqFt) || !Number.isFinite(rule.highRatePaisePerSqFt) || rule.lowRatePaisePerSqFt < 0 || rule.highRatePaisePerSqFt < rule.lowRatePaisePerSqFt) throw new Error(`Rule ${rule.id} has an invalid price range.`)
    if (rule.adjustments && !Array.isArray(rule.adjustments)) throw new Error(`Rule ${rule.id} adjustments must be a list.`)
  })
  const overlaps = card.rules.some((rule, index) => card.rules.slice(index + 1).some((other) => rule.projectCategory === other.projectCategory && rule.propertyType === other.propertyType && rule.zoneId === other.zoneId && rule.finishLevelId === other.finishLevelId && rule.minAreaSqFt <= other.maxAreaSqFt && other.minAreaSqFt <= rule.maxAreaSqFt))
  if (overlaps) throw new Error('Overlapping rules are not publishable because they create ambiguous customer quotes.')
}

const readStore = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return memoryStore.data || { rateCards: [clone(demoRateCard)], templates: clone(demoQuoteTemplates) }
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved) return JSON.parse(saved)

  const initial = { rateCards: [clone(demoRateCard)], templates: clone(demoQuoteTemplates) }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  return initial
}

const writeStore = (store) => {
  memoryStore.data = store
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  }
  return store
}

export const rateCardRepository = {
  getStore() {
    return clone(readStore())
  },

  saveStore(store) {
    return clone(writeStore(clone(store)))
  },

  getPublishedRateCard() {
    return readStore().rateCards.find((rateCard) => rateCard.status === 'published') || null
  },

  getRateCards() {
    return clone(readStore().rateCards)
  },

  getTemplates() {
    return clone(readStore().templates)
  },

  publishRateCard(rateCardId) {
    const store = readStore()
    const target = store.rateCards.find((rateCard) => rateCard.id === rateCardId)
    if (!target) throw new Error('Rate card not found.')
    if (target.status !== 'draft') throw new Error('Only draft rate cards can be published.')
    validateRateCard(target)
    store.rateCards = store.rateCards.map((rateCard) => ({ ...rateCard, status: rateCard.id === rateCardId ? 'published' : 'draft', publishedAt: rateCard.id === rateCardId ? new Date().toISOString() : rateCard.publishedAt }))
    return writeStore(store)
  },

  createDraftFromPublished() {
    const published = readStore().rateCards.find((rateCard) => rateCard.status === 'published')
    if (!published) throw new Error('No published rate card is available.')
    const draft = { ...clone(published), id: `${published.id}-draft-${Date.now()}`, version: `${published.version}-draft-${Date.now()}`, status: 'draft', publishedAt: null }
    const store = readStore()
    store.rateCards = [...store.rateCards, draft]
    writeStore(store)
    return draft
  },

  saveRateCard(rateCard) {
    validateRateCard(rateCard)
    const store = readStore()
    const next = { ...clone(rateCard), status: rateCard.status === 'published' ? 'draft' : rateCard.status }
    const index = store.rateCards.findIndex((item) => item.id === next.id)
    if (index >= 0) store.rateCards[index] = next
    else store.rateCards.push(next)
    writeStore(store)
    return next
  },

  validateRateCard,

  saveTemplates(templates) {
    const store = readStore()
    store.templates = clone(templates)
    writeStore(store)
    return templates
  },
}
