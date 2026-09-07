import { useState } from 'react'

function ContactForm() {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(formValues)
  }

  return (
    <section className="contact bg-paper px-[10%] py-sectionPad" id="contact">
      <div className="section-kicker font-sans text-[13px] font-bold uppercase tracking-[0.2em] text-gold">04 &mdash; Start a conversation</div>
      <div className="contact-grid mt-[52px] grid gap-[12%] min-[801px]:grid-cols-[1.15fr_.85fr]">
        <div>
          <h2 className="font-sans text-[clamp(48px,5vw,76px)] font-medium leading-[.98] tracking-[-.04em]">Let&rsquo;s make<br /><em className="font-serif font-medium text-gold">room for more.</em></h2>
          <p className="mt-0 max-w-[500px] font-sans text-lg leading-[1.7] text-muted">Tell us a little about what you&rsquo;re imagining. We&rsquo;ll get back to you within two working days.</p>
          <div className="contact-links mt-10 flex flex-col gap-[15px] font-sans text-sm">
            <a className="text-goldDeep" href="tel:+15550147892"><span className="mr-[9px]" aria-hidden="true">&#9742;</span> +1 555 014 7892</a>
            <a href="mailto:hello@sasconstructions.com">hello@sasconstructions.com</a>
            <span className="mt-2.5 text-[13px] text-muted">New York &middot; Available worldwide</span>
          </div>
        </div>
        <form className="flex flex-col gap-[25px]" onSubmit={handleSubmit}>
          <label className="font-sans text-[11px] uppercase tracking-[0.12em] text-muted">Your name<input className="block w-full border-0 border-b border-[#aaa] bg-transparent py-[13px] pb-3 text-ink outline-none focus:border-gold" name="name" type="text" placeholder="Jane Smith" value={formValues.name} onChange={handleChange} required /></label>
          <label className="font-sans text-[11px] uppercase tracking-[0.12em] text-muted">Email address<input className="block w-full border-0 border-b border-[#aaa] bg-transparent py-[13px] pb-3 text-ink outline-none focus:border-gold" name="email" type="email" placeholder="jane@example.com" value={formValues.email} onChange={handleChange} required /></label>
          <label className="font-sans text-[11px] uppercase tracking-[0.12em] text-muted">Tell us about your project<textarea className="block min-h-[75px] w-full resize-y border-0 border-b border-[#aaa] bg-transparent py-[13px] pb-3 text-ink outline-none focus:border-gold" name="message" placeholder="A new home, a considered renovation..." value={formValues.message} onChange={handleChange} required /></label>
          <button className="mt-2.5 inline-flex self-start items-center gap-[34px] border-0 bg-gold px-7 py-5 font-sans text-[13px] font-bold uppercase tracking-[0.13em] text-[#181818]" type="submit">Send enquiry <span className="text-[22px] leading-none">&#8599;</span></button>
        </form>
      </div>
    </section>
  )
}

export default ContactForm
