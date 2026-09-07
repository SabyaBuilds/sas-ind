function Philosophy() {
  return (
    <section className="philosophy bg-charcoal px-5 py-[145px] text-center text-white">
      <div className="quote-mark h-12 font-serif text-[75px] text-gold">&ldquo;</div>
      <blockquote className="my-[15px] text-[clamp(44px,5.3vw,76px)] font-sans leading-[1.05] tracking-[-.04em]">
        Good design is not<br />a luxury. <em className="font-serif font-medium text-gold">It is a way<br />of living better.</em>
      </blockquote>
      <p className="font-sans text-xs uppercase tracking-[0.16em] text-[#92928d]">&mdash; The SAS philosophy</p>
    </section>
  )
}

export default Philosophy
