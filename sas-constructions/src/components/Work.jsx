import { useState } from 'react'

const projects = [
  {
    category: 'construction',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
    number: '01',
    title: 'The Courtyard House',
    location: 'North Hills',
    label: 'Construction',
  },
  {
    category: 'interiors',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
    number: '02',
    title: 'Casa No. 08',
    location: 'Riverside District',
    label: 'Interiors',
  },
  {
    category: 'renovation',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
    number: '03',
    title: 'The Quiet Renewal',
    location: 'Old Town',
    label: 'Renovation',
  },
  {
    category: 'construction',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
    number: '04',
    title: 'Form & Found',
    location: 'West End',
    label: 'Construction',
  },
]

const filters = ['all', 'construction', 'interiors', 'renovation']

function Work() {
  const [currentFilter, setCurrentFilter] = useState('all')
  const visibleProjects = currentFilter === 'all'
    ? projects
    : projects.filter((project) => project.category === currentFilter)

  return (
    <section className="work bg-paper px-[10%] py-sectionPad" id="work">
      <div className="work-head mb-[70px] flex items-end justify-between gap-[30px] max-[800px]:block">
        <div>
          <div className="section-kicker font-sans text-[13px] font-bold uppercase tracking-[0.2em] text-gold">03 &mdash; Selected work</div>
          <h2 className="mt-[55px] font-sans text-[clamp(48px,5vw,76px)] font-medium leading-[.98] tracking-[-.04em]">A few of our<br /><em className="font-serif font-medium text-gold">favourite places.</em></h2>
        </div>
        <div className="filters flex flex-wrap gap-[22px] max-[800px]:mt-[35px]" role="group" aria-label="Filter projects">
          {filters.map((filter) => (
            <button
              className={`border-0 border-b bg-transparent px-0 py-2 font-sans text-[13px] capitalize ${currentFilter === filter ? 'border-gold text-ink' : 'border-transparent text-muted'}`}
              type="button"
              key={filter}
              onClick={() => setCurrentFilter(filter)}
            >
              {filter === 'all' ? 'All work' : filter}
            </button>
          ))}
        </div>
      </div>
      <div className="project-grid grid gap-x-[25px] gap-y-[70px] min-[801px]:grid-cols-2">
        {visibleProjects.map((project) => (
          <article className="project-card" data-category={project.category} key={project.title}>
            <div className="project-image relative h-[500px] overflow-hidden bg-cover bg-center max-[800px]:h-[420px]" style={{ backgroundImage: `url('${project.image}')` }}>
              <span className="absolute left-[22px] top-5 z-[1] font-sans text-[13px] text-white">{project.number}</span>
              <a className="absolute bottom-5 right-5 z-[1] grid h-[50px] w-[50px] place-items-center bg-gold font-sans text-[23px] text-ink" href="#contact" aria-label={`Enquire about ${project.title}`}>&#8599;</a>
            </div>
            <div className="project-info flex justify-between pt-[18px]">
              <div>
                <h3 className="mb-[7px] font-sans text-2xl font-medium">{project.title}</h3>
                <p className="font-sans text-[13px] text-muted">{project.location}</p>
              </div>
              <span className="font-sans text-[13px] uppercase tracking-[0.13em] text-muted">{project.label}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Work
