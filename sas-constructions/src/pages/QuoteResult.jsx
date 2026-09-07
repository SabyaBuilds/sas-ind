import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { calculateQuote, recalculateSnapshotAddons } from '../data/quoteCalculator'
import { formatInrRange } from '../data/currency'
import { getCustomerQuote, saveCustomerQuote, updateCustomerQuote } from '../data/quotePersistence'

const timelinePhases = [
  { label: 'Design', share: 20 },
  { label: 'Permits', share: 15 },
  { label: 'Construction/Fit-out', share: 50 },
  { label: 'Handover', share: 15 },
]

function QuoteResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryQuoteId = new URLSearchParams(location.search).get('quoteId')
  const storedQuote = queryQuoteId ? getCustomerQuote(queryQuoteId) : null
  const answers = storedQuote?.answers || location.state?.answers
  const [selectedAddonIds, setSelectedAddonIds] = useState(storedQuote?.selectedAddons || [])
  const [confirmed, setConfirmed] = useState(storedQuote?.submissionStatus === 'submitted')
  const plan = useMemo(() => {
    if (!answers) return null
    // A stored quote always uses its persisted pricing output, never today's card.
    if (storedQuote?.pricingSnapshot) return recalculateSnapshotAddons(storedQuote.pricingSnapshot, selectedAddonIds)
    return calculateQuote(answers, undefined, selectedAddonIds)
  }, [answers, selectedAddonIds, storedQuote])
  const quoteIdRef = useRef(queryQuoteId || '')

  useEffect(() => {
    if (!answers || quoteIdRef.current) return
    const saved = saveCustomerQuote({ answers, plan })
    quoteIdRef.current = saved.id
    navigate(`/quote-result?quoteId=${saved.id}`, { replace: true, state: null })
  }, [answers, navigate, plan])

  if (!answers || !plan) {
    return <main className="bg-paper px-6 py-24 font-sans text-ink"><div className="mx-auto max-w-2xl"><p className="mb-4 text-[13px] font-bold uppercase tracking-[0.2em] text-gold">Quote unavailable</p><h1 className="font-serif text-5xl font-medium">Start a new quote to see your estimate.</h1><button className="mt-10 bg-gold px-7 py-5 text-sm font-bold uppercase tracking-[0.12em] text-ink" type="button" onClick={() => navigate('/get-a-quote')}>Start a new quote</button></div></main>
  }

  const handleAddonToggle = (addonId) => setSelectedAddonIds((current) => current.includes(addonId) ? current.filter((id) => id !== addonId) : [...current, addonId])
  const handleConfirm = () => {
    updateCustomerQuote(quoteIdRef.current, { answers, plan })
    setConfirmed(true)
  }

  return <main className="bg-paper px-6 py-16 font-sans text-ink"><div className="mx-auto max-w-5xl"><button className="mb-10 border-0 bg-transparent p-0 text-sm uppercase tracking-[0.12em] text-muted" type="button" onClick={() => navigate('/get-a-quote')}>← Back to quote</button><p className="mb-4 text-[13px] font-bold uppercase tracking-[0.2em] text-gold">Preliminary estimate</p><h1 className="max-w-3xl font-serif text-5xl font-medium leading-tight">{plan.projectType}</h1>
    {plan.status !== 'matched' ? <section className="mt-14 border border-gold bg-white p-8" aria-live="polite"><h2 className="text-2xl font-medium">Custom quote required</h2><p className="mt-3 text-muted">We could not find one published rate-card rule for this combination of area, location, property type, or finish level.</p><p className="mt-3 text-muted">{plan.reason}</p><button className="mt-8 bg-gold px-7 py-5 text-sm font-bold uppercase tracking-[0.12em] text-ink" type="button" onClick={handleConfirm}>{confirmed ? 'Enquiry saved for manual review' : 'Send enquiry for manual review'}</button></section> : <>
      <div className="mt-14 grid gap-10 min-[801px]:grid-cols-[1.1fr_.9fr]"><section aria-labelledby="services-heading"><h2 className="mb-5 text-2xl font-medium" id="services-heading">Recommended services</h2><ul className="space-y-3">{plan.recommendedServices.map((service) => <li className="flex items-center gap-3 border-b border-line pb-3" key={service}><span className="grid h-6 w-6 place-items-center bg-gold text-sm" aria-hidden="true">✓</span><span>{service}</span></li>)}</ul></section><section className="border-l border-line pl-6 max-[800px]:border-l-0 max-[800px]:border-t max-[800px]:pl-0 max-[800px]:pt-8" aria-labelledby="estimate-heading"><h2 className="mb-4 text-2xl font-medium" id="estimate-heading">Estimate range</h2><p className="text-3xl font-medium text-goldDeep">{formatInrRange(plan.totalPaise[0], plan.totalPaise[1])}</p><p className="mt-3 text-sm text-muted">Final quote subject to review.</p></section></div>
      <section className="mt-16" aria-labelledby="breakdown-heading"><h2 className="mb-5 text-2xl font-medium" id="breakdown-heading">Transparent breakdown</h2><div className="divide-y divide-line border-y border-line bg-white">{plan.lineItems.map((item) => <div className="flex flex-wrap justify-between gap-4 px-4 py-4 text-sm" key={item.label}><span>{item.label}</span><span className="font-medium">{formatInrRange(item.lowPaise, item.highPaise)}</span></div>)}</div></section>
      <section className="mt-16" aria-labelledby="timeline-heading"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><h2 className="text-2xl font-medium" id="timeline-heading">Estimated timeline</h2><p className="text-sm text-muted">{plan.durationWeeks[0]}–{plan.durationWeeks[1]} weeks</p></div><div className="flex h-16 w-full overflow-hidden border border-line bg-white" aria-label="Estimated project phases">{timelinePhases.map((phase) => <div className="min-w-0 break-words flex items-center justify-center border-r border-paper px-1 text-center text-[10px] font-medium leading-tight last:border-r-0 min-[601px]:px-2 min-[601px]:text-sm" style={{ width: `${phase.share}%` }} key={phase.label}>{phase.label}</div>)}</div></section>
      <section className="mt-16" aria-labelledby="addons-heading"><h2 className="mb-5 text-2xl font-medium" id="addons-heading">Optional upgrades / add-ons</h2><div className="grid gap-4 min-[601px]:grid-cols-2">{plan.eligibleAddons.map((addon) => <label className="flex gap-3 border border-line bg-white p-5" key={addon.id}><input type="checkbox" checked={selectedAddonIds.includes(addon.id)} onChange={() => handleAddonToggle(addon.id)} /><span><strong className="block font-medium">{addon.name}</strong><span className="mt-1 block text-sm text-muted">{addon.description}</span><span className="mt-2 block text-sm text-goldDeep">Optional add-on: {formatInrRange(addon.lowPricePaise, addon.highPricePaise)}</span></span></label>)}</div></section>
      <section className="mt-16 grid gap-10 min-[801px]:grid-cols-[.9fr_1.1fr]" aria-labelledby="budget-heading"><div><h2 className="mb-4 text-2xl font-medium" id="budget-heading">Final estimate subject to review</h2><p className="text-muted">This preliminary estimate depends on survey, drawings, permits, and approved scope.</p></div><div><h2 className="mb-4 text-2xl font-medium">Suggested next steps</h2><ol className="list-decimal space-y-3 pl-5 text-muted">{plan.nextSteps.map((step) => <li className="pl-2" key={step}>{step}</li>)}</ol></div></section><button className="mt-16 bg-gold px-7 py-5 text-sm font-bold uppercase tracking-[0.12em] text-ink transition hover:bg-[#f5d457]" type="button" onClick={handleConfirm}>{confirmed ? 'Quote saved — our team will contact you' : 'Confirm & talk to our team'}</button>
    </>}
  </div></main>
}

export default QuoteResult
