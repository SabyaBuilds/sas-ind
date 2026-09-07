function Footer() {
  return (
    <footer className="site-footer flex flex-wrap items-center justify-between gap-5 bg-charcoal px-[10%] py-[38px] font-sans text-xs text-white">
      <a className="brand block h-[70px] w-[107px] shrink-0 overflow-hidden bg-white leading-none min-[801px]:h-[78px] min-[801px]:w-[119px]" href="#top">
        <img className="block h-full w-full object-contain" src="/sas-constructions-logo.jpeg" alt="SAS Construction & Interiors" />
      </a>
      <p className="m-0 text-mutedFooter">&copy; 2026 SAS Constructions. Built for living.</p>
      <a className="text-gold" href="https://instagram.com" target="_blank" rel="noopener">Instagram &#8599;</a>
    </footer>
  )
}

export default Footer
