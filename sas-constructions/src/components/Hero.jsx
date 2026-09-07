import useReveal from '../hooks/useReveal'

const heroImageUrl = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85'

function Hero() {
  const { ref, isVisible } = useReveal()

  return (
    <section className="relative flex min-h-[700px] h-screen items-center overflow-hidden bg-charcoal px-[10%] pt-headerH text-white" aria-labelledby="hero-title">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImageUrl}')` }} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,8,.78),rgba(5,7,8,.12)_75%),linear-gradient(0deg,rgba(5,7,8,.58),transparent_45%)]" />
      <div
        ref={ref}
        className={`relative z-[1] max-w-[710px] transform transition duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
      >
        <p className="eyebrow flex items-center gap-[25px] font-sans text-[13px] font-bold uppercase tracking-[0.2em] text-gold before:h-px before:w-12 before:bg-gold">Building with intent since 2008</p>
        <h1 id="hero-title" className="my-[43px] text-[clamp(60px,7vw,104px)] font-sans font-medium leading-[.98] tracking-[-.04em] max-[480px]:text-[56px]">Spaces that<br /><em className="font-serif font-medium text-gold">feel like home.</em></h1>
        <p className="hero-copy max-w-[510px] font-sans text-xl leading-[1.5] text-[#e5e4df]">Thoughtful construction and interior design for the way you want to live.</p>
        <div className="hero-actions mt-10 flex items-center gap-[34px] max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-[19px]">
          <a className="button button-gold inline-flex items-center gap-[34px] bg-gold px-7 py-5 font-sans text-[13px] font-bold uppercase tracking-[0.13em] text-[#181818] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f5d457]" href="#work">Explore our work <span className="text-[22px] leading-none">↗</span></a>
          <a className="play-link flex items-center gap-[14px] font-sans text-[13px] uppercase tracking-[0.12em]" href="#studio"><span className="play-icon grid h-[45px] w-[45px] place-items-center rounded-full border border-white pl-0.5 text-[11px]">▶</span> Our approach</a>
        </div>
      </div>
      <div className="hero-meta absolute bottom-[35px] left-[10%] right-[10%] z-[2] flex justify-between font-sans text-[11px] uppercase tracking-[0.15em] text-[#d8d7d1]"><span>EST. 2008</span><span>CONSTRUCTION / INTERIORS</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>
  )
}

export default Hero
