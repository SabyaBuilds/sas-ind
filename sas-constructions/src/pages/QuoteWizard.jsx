import { useEffect, useRef } from 'react'
import StepWizard from '../components/wizard/StepWizard'

function QuoteWizard() {
  const shellRef = useRef(null)

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return undefined

    const observer = new MutationObserver(() => {
      shell.classList.remove('wizard-step-changed')
      void shell.offsetWidth
      shell.classList.add('wizard-step-changed')
    })

    observer.observe(shell, { childList: true, characterData: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <main className="wizard-page bg-paper">
      <style>{`
        @keyframes wizardPageEnter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wizard-shell {
          animation: wizardPageEnter 420ms ease-out both;
        }
        .wizard-step-changed {
          animation: wizardPageEnter 260ms ease-out both;
        }
        .wizard-shell [role='progressbar'] > div {
          transition: width 500ms ease-out;
        }
        .wizard-shell .border-dashed {
          min-width: 0;
          overflow-wrap: anywhere;
        }
        @media (prefers-reduced-motion: reduce) {
          .wizard-shell,
          .wizard-step-changed,
          .wizard-shell [role='progressbar'] > div {
            animation: none;
            transition: none;
          }
        }
      `}</style>
      <h1 className="sr-only">Let&apos;s scope your project</h1>
      <div className="wizard-shell" id="wizard-step" ref={shellRef}>
        <StepWizard />
      </div>
    </main>
  )
}

export default QuoteWizard
