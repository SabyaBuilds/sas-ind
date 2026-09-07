import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import wizardSchema from '../../data/wizardSchema'
import { rateCardRepository } from '../../data/rateCardRepository'
import { validatePricingAnswers } from '../../data/quoteCalculator'

const DRAFT_KEY = 'sas-quote-wizard-draft-v1'
const fieldLabels = { name: 'Name', email: 'Email', phone: 'Phone' }

const readDraft = () => {
  if (typeof window === 'undefined') return { currentStepIndex: 0, answers: {} }
  try { return JSON.parse(window.localStorage.getItem(DRAFT_KEY) || '{"currentStepIndex":0,"answers":{}}') } catch { return { currentStepIndex: 0, answers: {} } }
}

function StepWizard() {
  const draft = readDraft()
  const [currentStepIndex, setCurrentStepIndex] = useState(draft.currentStepIndex || 0)
  const [answers, setAnswers] = useState(draft.answers || {})
  const [validationError, setValidationError] = useState('')
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const rateCard = rateCardRepository.getPublishedRateCard()
  const step = wizardSchema[currentStepIndex]
  const isFinalStep = currentStepIndex === wizardSchema.length - 1
  const progress = ((currentStepIndex + 1) / wizardSchema.length) * 100

  useEffect(() => {
    const serialisableAnswers = { ...answers }
    delete serialisableAnswers.docUpload
    window.localStorage?.setItem(DRAFT_KEY, JSON.stringify({ currentStepIndex, answers: serialisableAnswers }))
  }, [answers, currentStepIndex])

  const updateAnswer = (value) => setAnswers((currentAnswers) => ({ ...currentAnswers, [step.id]: value }))
  const updateContactField = (fieldId, value) => setAnswers((currentAnswers) => ({ ...currentAnswers, contact: { ...currentAnswers.contact, [fieldId]: value } }))
  const toggleMultiSelect = (option) => {
    const selectedOptions = answers[step.id] || []
    updateAnswer(selectedOptions.includes(option) ? selectedOptions.filter((item) => item !== option) : [...selectedOptions, option])
  }
  const handleFiles = (fileList) => updateAnswer(Array.from(fileList || []).slice(0, step.multiple ? undefined : 1))
  const handleDrop = (event) => { event.preventDefault(); handleFiles(event.dataTransfer.files) }

  const getStepError = () => {
    if (step.id === 'contact') {
      if (!answers.contact?.name || !answers.contact?.email || !answers.contact?.phone) return 'Please complete your contact details.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.contact.email.trim())) return 'Enter a valid email address.'
      if (answers.contact.phone.replace(/\D/g, '').length < 7) return 'Enter a valid phone number.'
      return ''
    }
    if (step.id === 'areaSqFt') return validatePricingAnswers(answers, rateCard).areaSqFt || ''
    if (step.id === 'pricingZone') return validatePricingAnswers(answers, rateCard).pricingZone || ''
    if (step.id === 'finishLevel') return validatePricingAnswers(answers, rateCard).finishLevel || ''
    if (step.required && !answers[step.id]) return 'Please select an option to continue.'
    return ''
  }

  const handleNext = () => {
    const error = getStepError()
    if (error) { setValidationError(error); return }
    setValidationError('')
    if (isFinalStep) {
      window.localStorage?.removeItem(DRAFT_KEY)
      navigate('/quote-result', { state: { answers } })
      return
    }
    setCurrentStepIndex((currentIndex) => currentIndex + 1)
  }

  const handleBack = () => { setValidationError(''); setCurrentStepIndex((currentIndex) => Math.max(currentIndex - 1, 0)) }

  const renderOptions = (options) => (
    <div className="grid gap-3">
      {options.map((option) => <button className={`border px-5 py-4 text-left font-sans transition ${answers[step.id] === option.id || answers[step.id] === option ? 'border-gold bg-gold text-ink' : 'border-line bg-white text-ink hover:border-gold'}`} type="button" key={option.id || option} onClick={() => updateAnswer(option.id || option)}>{option.name || option}</button>)}
    </div>
  )

  const renderStepInput = () => {
    if (step.id === 'contact') return <div className="flex flex-col gap-5">{step.fields.map((field) => <label className="flex flex-col gap-2 font-sans text-sm font-medium text-ink" key={field.id}>{fieldLabels[field.id]}<input className="border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-gold" name={field.id} type={field.id === 'email' ? 'email' : field.id === 'phone' ? 'tel' : 'text'} value={answers.contact?.[field.id] || ''} onChange={(event) => updateContactField(field.id, event.target.value)} /></label>)}</div>
    if (step.id === 'areaSqFt') return <label className="flex max-w-sm flex-col gap-2 font-sans text-sm font-medium text-ink">Area in square feet<input className="border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-gold" type="number" min="1" value={answers.areaSqFt || ''} onChange={(event) => updateAnswer(event.target.value)} /></label>
    if (step.id === 'pricingZone') return renderOptions(rateCard?.zones || [])
    if (step.id === 'finishLevel') return renderOptions(rateCard?.finishes || [])
    if (step.inputType === 'single-select' || step.inputType === 'boolean') return renderOptions(step.options || ['yes', 'no'])
    if (step.inputType === 'multi-select') return <div className="grid gap-3">{step.options.map((option) => <label className="flex items-center gap-3 border border-line bg-white px-5 py-4 font-sans text-ink" key={option}><input checked={(answers[step.id] || []).includes(option)} type="checkbox" onChange={() => toggleMultiSelect(option)} />{option}</label>)}</div>
    if (step.inputType === 'file-upload') {
      const files = answers[step.id] || []
      return <div className="min-w-0 overflow-wrap-anywhere border border-dashed border-muted bg-white p-8 text-center" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}><input ref={fileInputRef} className="sr-only" id="wizard-file-upload" type="file" multiple={step.multiple} onChange={(event) => handleFiles(event.target.files)} /><label className="cursor-pointer font-sans text-muted" htmlFor="wizard-file-upload">Drop files here or click to browse</label>{files.length > 0 && <ul className="mt-5 space-y-2 text-left font-sans text-sm text-ink">{files.map((file) => <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>)}</ul>}</div>
    }
    return null
  }

  return <section className="mx-auto max-w-3xl px-6 py-16 font-sans text-ink"><div className="mb-10 flex items-center justify-between text-sm text-muted"><span>Step {currentStepIndex + 1} of {wizardSchema.length}</span><span>{Math.round(progress)}%</span></div><div className="mb-12 h-1 bg-line" role="progressbar" aria-valuemax="100" aria-valuemin="0" aria-valuenow={Math.round(progress)}><div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} /></div><div className="min-h-[340px]"><h2 className="mb-8 font-serif text-4xl font-medium leading-tight">{step.question || 'Your contact details'}</h2>{renderStepInput()}{validationError && <p className="mt-4 text-sm text-red-700" role="alert">{validationError}</p>}</div><div className="mt-12 flex justify-between gap-4"><button className="border border-line px-6 py-3 font-sans text-sm uppercase tracking-[0.12em] text-muted disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={handleBack} disabled={currentStepIndex === 0}>Back</button><button className="bg-gold px-6 py-3 font-sans text-sm font-bold uppercase tracking-[0.12em] text-ink" type="button" onClick={handleNext}>{isFinalStep ? 'Calculate estimate' : 'Next'}</button></div></section>
}

export default StepWizard
