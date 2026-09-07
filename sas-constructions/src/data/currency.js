export const formatInr = (paise) => {
  const rupees = Math.round(Number(paise || 0) / 100)
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(rupees)
}

export const formatInrRange = (lowPaise, highPaise) => `${formatInr(lowPaise)}–${formatInr(highPaise)}`
