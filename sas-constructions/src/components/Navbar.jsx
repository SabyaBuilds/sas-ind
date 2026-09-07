import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => setIsOpen(false)
  const sectionLink = (section) => (location.pathname === '/' ? `#${section}` : `/#${section}`)

  // The admin portal has its own responsive header. Rendering the public,
  // absolutely-positioned site navigation there causes the two headers to overlap.
  if (location.pathname === '/admin') return null

  return (
    <>
    <header className="site-header absolute z-10 flex h-headerH w-full items-center gap-10 bg-ink px-[7.7%] text-white">
      <Link className="brand block h-[70px] w-[107px] shrink-0 overflow-hidden bg-white leading-none min-[801px]:h-[78px] min-[801px]:w-[119px]" to="/#top" aria-label="SAS Constructions home">
        <img className="block h-full w-full object-contain" src="/sas-constructions-logo.jpeg" alt="SAS Construction & Interiors" />
      </Link>
      <button
        className="menu-toggle ml-auto flex flex-col gap-1.5 border-0 bg-transparent text-white min-[801px]:hidden"
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="h-px w-[25px] bg-white" />
        <span className="h-px w-[25px] bg-white" />
      </button>
      <nav
        className={`site-nav ${isOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-headerH flex-col gap-[22px] bg-ink px-[6%] py-[25px] font-sans text-[13px] uppercase tracking-[0.12em] text-mutedLight min-[801px]:static min-[801px]:ml-auto min-[801px]:flex min-[801px]:flex-row min-[801px]:gap-[42px] min-[801px]:bg-transparent min-[801px]:p-0`}
        aria-label="Primary navigation"
      >
        <Link to={sectionLink('studio')} onClick={closeMenu}>Studio</Link>
        <Link to={sectionLink('services')} onClick={closeMenu}>Services</Link>
        <Link to={sectionLink('work')} onClick={closeMenu}>Selected work</Link>
        <Link to={sectionLink('contact')} onClick={closeMenu}>Contact</Link>
      </nav>
      <a className="header-phone hidden whitespace-nowrap font-sans text-sm tracking-[0.08em] min-[801px]:block" href="tel:+15550147892">
        <span className="mr-[9px] text-gold" aria-hidden="true">&#9742;</span> +1 555 014 7892
      </a>
      <Link className="bg-gold px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.12em] text-ink" to="/get-a-quote">Get a quote</Link>
    </header>
    {location.pathname === '/' && <Link className="fixed bottom-4 right-4 z-30 grid h-12 w-12 place-items-center rounded-full border border-gold bg-ink text-gold shadow-lg transition hover:scale-105 hover:bg-gold hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:bottom-6 sm:right-6" to="/admin" aria-label="Open Admin Control Room" title="Admin Control Room">
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56v.09h-3v-.09A1.7 1.7 0 0 0 10.68 18.66a1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7.02 15a1.7 1.7 0 0 0-1.56-1.03h-.09v-3h.09A1.7 1.7 0 0 0 7.02 9.94a1.7 1.7 0 0 0-.34-1.88l-.06-.06L8.74 5.88l.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56v-.09h3v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06L19.8 8l-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03h.09v3h-.09A1.7 1.7 0 0 0 19.4 15Z" />
      </svg>
    </Link>}
    </>
  )
}

export default Navbar
