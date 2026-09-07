const wizardSchema = [
  {
    id: 'propertyOwnership',
    question: 'Do you already own the land/property?',
    inputType: 'single-select',
    options: ['yes', 'no'],
  },
  {
    id: 'propertyType',
    question: 'Is this for personal or commercial use?',
    inputType: 'single-select',
    required: true,
    options: ['personal', 'commercial'],
  },
  {
    id: 'projectCategory',
    question: 'What are you looking to do?',
    inputType: 'single-select',
    required: true,
    options: [
      'New construction from scratch',
      'Renovation of existing structure',
      'Interior design only',
    ],
  },
  {
    id: 'areaSqFt',
    question: 'What is the built-up/project area in square feet?',
    inputType: 'number',
    required: true,
  },
  {
    id: 'pricingZone',
    question: 'Where is the project located?',
    inputType: 'pricing-zone',
    required: true,
  },
  {
    id: 'finishLevel',
    question: 'What finish level are you considering?',
    inputType: 'finish-level',
    required: true,
  },
  {
    id: 'hasDocs',
    question: 'Do you already have land registry / property documents?',
    inputType: 'single-select',
    options: ['yes', 'no'],
  },
  {
    id: 'docUpload',
    question: 'Upload any documents you have (registry papers, sale deed, existing floor plans)',
    inputType: 'file-upload',
    optional: true,
    multiple: true,
  },
  {
    id: 'hasArchitecturalDrawings',
    question: 'Do you already have architectural drawings or a design?',
    inputType: 'single-select',
    options: ['yes', 'no', 'not sure'],
  },
  {
    id: 'needsArchitectConsult',
    question: 'Would you like architecture consultancy as part of this project?',
    inputType: 'single-select',
    options: ['yes', 'no', 'undecided'],
  },
  {
    id: 'timeline',
    question: 'When would you like to start?',
    inputType: 'single-select',
    options: ['Immediately', 'Within 3 months', 'Just exploring'],
  },
  {
    id: 'budgetRange',
    question: 'Approximate budget range',
    inputType: 'single-select',
    options: ['Under $50k', '$50k–150k', '$150k–400k', '$400k+'],
  },
  {
    id: 'contact',
    question: '',
    inputType: 'text',
    fields: [
      { id: 'name', inputType: 'text' },
      { id: 'email', inputType: 'text' },
      { id: 'phone', inputType: 'text' },
    ],
  },
]

export default wizardSchema
