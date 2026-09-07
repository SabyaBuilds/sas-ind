function Footer() {
  return (
    <footer className="site-footer flex flex-wrap items-center justify-between gap-5 bg-charcoal px-[10%] py-[38px] font-sans text-xs text-white">
      <a className="brand flex items-center gap-2.5 text-base font-bold tracking-[0.12em]" href="#top">
        <span className="brand-mark grid h-[30px] w-[30px] rotate-45 place-items-center border border-gold font-serif text-base text-gold">S</span>
        <span>SAS<span className="text-gold">.</span></span>
      </a>
      <p className="m-0 text-mutedFooter">&copy; 2026 SAS Constructions. Built for living.</p>
      <a className="text-gold" href="https://instagram.com" target="_blank" rel="noopener">Instagram &#8599;</a>
    </footer>
  )
}

export default Footer
