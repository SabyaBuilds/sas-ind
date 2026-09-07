import useReveal from '../hooks/useReveal'

function Studio() {
  const { ref, isVisible } = useReveal()

  return (
    <section className="studio bg-paper px-[10%] py-sectionPad" id="studio">
      <div className="section-kicker font-sans text-[13px] font-bold uppercase tracking-[0.2em] text-gold">01 &mdash; The studio</div>
      <div
        ref={ref}
        className={`studio-intro mt-[55px] grid transform gap-[12%] transition duration-700 ease-out min-[801px]:grid-cols-[1.15fr_.85fr] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
      >
        <h2 className="font-sans text-[clamp(48px,5vw,76px)] font-medium leading-[.98] tracking-[-.04em]">We shape the<br /><em className="font-serif font-medium text-gold">everyday extraordinary.</em></h2>
        <div>
          <p className="max-w-[500px] font-sans text-lg leading-[1.7] text-muted">SAS is a construction and interiors studio creating considered spaces for modern living. From the first sketch to the final detail, we bring clarity, craft, and calm to every project.</p>
          <a className="mt-[15px] inline-block border-b border-ink pb-2 font-sans text-xs font-bold uppercase tracking-[0.14em]" href="#contact">Meet the studio <span className="ml-5 text-lg text-goldDeep">&#8599;</span></a>
        </div>
      </div>
      <div className="stats mt-[100px] grid grid-cols-3 gap-[30px] border-t border-line pt-[27px] max-[800px]:mt-[65px]">
        <div className="min-w-0"><strong className="block font-sans text-[57px] font-normal tracking-[-.06em]">16</strong><span className="block break-words font-sans text-[13px] uppercase tracking-[0.11em] text-muted max-[800px]:text-[10px]">Years of practice</span></div>
        <div className="min-w-0"><strong className="block font-sans text-[57px] font-normal tracking-[-.06em]">84</strong><span className="block break-words font-sans text-[13px] uppercase tracking-[0.11em] text-muted max-[800px]:text-[10px]">Spaces completed</span></div>
        <div className="min-w-0"><strong className="block font-sans text-[57px] font-normal tracking-[-.06em]">01</strong><span className="block break-words font-sans text-[13px] uppercase tracking-[0.11em] text-muted max-[800px]:text-[10px]">Uncompromising standard</span></div>
      </div>
    </section>
  )
}

export default Studio
