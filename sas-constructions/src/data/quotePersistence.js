const QUOTES_KEY = 'sas-customer-quotes-v1'

const readQuotes = () => {
  if (typeof window === 'undefined' || !window.localStorage) return []
  return JSON.parse(window.localStorage.getItem(QUOTES_KEY) || '[]')
}

const serialiseAnswers = (answers) => ({
  ...answers,
  docUpload: Array.isArray(answers.docUpload) ? answers.docUpload.map((file) => ({ name: file.name, size: file.size, type: file.type, lastModified: file.lastModified })) : answers.docUpload,
})

export const saveCustomerQuote = ({ answers, plan }) => {
  const quote = {
    id: `quote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    submissionStatus: 'draft',
    customer: answers.contact || {},
    answers: serialiseAnswers(answers),
    matchedPricingRule: plan.matchedRuleId || null,
    selectedTemplate: plan.selectedTemplateId || null,
    appliedAdjustments: plan.lineItems || [],
    selectedAddons: plan.selectedAddonIds || [],
    totalLowPaise: plan.totalPaise?.[0] || null,
    totalHighPaise: plan.totalPaise?.[1] || null,
    currency: 'INR',
    rateCardVersion: plan.rateCardVersion || null,
    manualReview: plan.status !== 'matched',
    pricingSnapshot: plan,
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(QUOTES_KEY, JSON.stringify([quote, ...readQuotes()]))
  }
  return quote
}

export const getCustomerQuote = (quoteId) => readQuotes().find((quote) => quote.id === quoteId) || null
export const getCustomerQuotes = () => readQuotes()

export const updateCustomerQuote = (quoteId, { answers, plan, submitted = true }) => {
  const quotes = readQuotes()
  const existing = quotes.find((quote) => quote.id === quoteId)
  if (!existing) return null
  const updated = saveCustomerQuote({ answers, plan })
  const nextQuotes = readQuotes().filter((quote) => quote.id !== updated.id && quote.id !== quoteId)
  const snapshot = { ...updated, id: quoteId, createdAt: existing.createdAt, submissionStatus: submitted ? 'submitted' : existing.submissionStatus, confirmedAt: submitted ? new Date().toISOString() : existing.confirmedAt }
  if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(QUOTES_KEY, JSON.stringify([snapshot, ...nextQuotes]))
  return snapshot
}
