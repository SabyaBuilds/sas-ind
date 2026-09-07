import useReveal from '../hooks/useReveal'

const serviceImages = {
  build: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  interior: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
  renovation: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
}

function Services() {
  const { ref, isVisible } = useReveal()

  return (
    <section className="services bg-paperDark px-[10%] py-sectionPad" id="services">
      <div className="section-kicker font-sans text-[13px] font-bold uppercase tracking-[0.2em] text-gold">02 &mdash; What we do</div>
      <div
        ref={ref}
        className={`services-head mt-[55px] grid transform gap-[12%] transition duration-700 ease-out min-[801px]:grid-cols-[1.15fr_.85fr] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
      >
        <h2 className="font-sans text-[clamp(48px,5vw,76px)] font-medium leading-[.98] tracking-[-.04em]">From ground<br />to <em className="font-serif font-medium text-gold">gathering.</em></h2>
        <p className="max-w-[500px] font-sans text-lg leading-[1.7] text-muted">One partner, every layer of the built environment. We make the complex feel simple.</p>
      </div>
      <div className="service-grid mt-[67px] grid gap-6 min-[801px]:grid-cols-3">
        <article className="service-card relative">
          <div className="service-image h-[400px] bg-cover bg-center saturate-[.75]" style={{ backgroundImage: `url('${serviceImages.build}')` }} />
          <span className="card-number absolute left-5 top-[18px] font-sans text-[13px] tracking-[0.12em] text-white">01</span>
          <h3 className="mt-[22px] mb-2 font-sans text-2xl font-medium">New construction <span className="float-right text-goldDeep">&#8599;</span></h3>
          <p className="max-w-[300px] font-sans leading-[1.55] text-muted">Ground-up homes built around your vision, site, and life.</p>
        </article>
        <article className="service-card relative">
          <div className="service-image h-[400px] bg-cover bg-center saturate-[.75]" style={{ backgroundImage: `url('${serviceImages.interior}')` }} />
          <span className="card-number absolute left-5 top-[18px] font-sans text-[13px] tracking-[0.12em] text-white">02</span>
          <h3 className="mt-[22px] mb-2 font-sans text-2xl font-medium">Interior design <span className="float-right text-goldDeep">&#8599;</span></h3>
          <p className="max-w-[300px] font-sans leading-[1.55] text-muted">Material-rich interiors that make every day feel considered.</p>
        </article>
        <article className="service-card relative">
          <div className="service-image h-[400px] bg-cover bg-center saturate-[.75]" style={{ backgroundImage: `url('${serviceImages.renovation}')` }} />
          <span className="card-number absolute left-5 top-[18px] font-sans text-[13px] tracking-[0.12em] text-white">03</span>
          <h3 className="mt-[22px] mb-2 font-sans text-2xl font-medium">Renovation <span className="float-right text-goldDeep">&#8599;</span></h3>
          <p className="max-w-[300px] font-sans leading-[1.55] text-muted">New energy for existing spaces, with respect for what came before.</p>
        </article>
      </div>
    </section>
  )
}

export default Services
