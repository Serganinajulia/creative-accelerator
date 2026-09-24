import partners from '../data/partners.json'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

type Partner = { name: string; logo: string; url: string }

function LogoGroup({ title, items }: { title: string; items: Partner[] }) {
  if (!items.length) return null
  return (
    <div>
      <p className="mb-8 max-w-3xl text-lg font-semibold text-white md:text-xl">{title}</p>
      <div className="flex flex-wrap items-center gap-x-12 gap-y-8">
        {items.map((p) => (
          <a 
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            aria-label={p.name}
            className="transition duration-300 hover:scale-105 hover:opacity-80"
          >
            <img src={p.logo} alt={p.name} className="h-14 w-auto md:h-16" />
          </a>
        ))}
      </div>
    </div>
  )
}

export default function OrganizersPartners() {
  const { organizers, infoPartners } = partners

  return (
    <section id="organizers" className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal>
          <SectionHeading className="mb-12 text-white">Организаторы и партнёры</SectionHeading>
        </Reveal>

        <div className="space-y-14">
          <Reveal delay={0.05}>
            <LogoGroup title={organizers.title} items={organizers.items} />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-t border-white/15 pt-14">
              <LogoGroup title={infoPartners.title} items={infoPartners.items} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}