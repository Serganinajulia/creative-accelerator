import partners from '../data/partners.json'
import Reveal from '../components/Reveal'

function LogoRow({ title, items }: { title: string; items: { name: string; logo: string; url: string }[] }) {
  if (!items.length) return null
  return (
    <div className="mb-10">
      <p className="uppercase tracking-wide text-dark/50 mb-4">{title}</p>
      <div className="flex flex-wrap gap-8 items-center">
        {items.map((p) => (
          <a key={p.name} href={p.url} target="_blank" rel="noreferrer" title={p.name}>
            <img src={p.logo} alt={p.name} className="h-10 w-auto grayscale hover:grayscale-0 transition-all" />
          </a>
        ))}
      </div>
    </div>
  )
}

export default function OrganizersPartners() {
  return (
    <section id="organizers" className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-10">Организаторы и партнёры</h2>
      </Reveal>
      <Reveal>
        <LogoRow title="Организаторы" items={partners.organizers} />
      </Reveal>
      <Reveal delay={0.05}>
        <LogoRow title="Партнёры проекта" items={partners.projectPartners} />
      </Reveal>
      <Reveal delay={0.1}>
        <LogoRow title="Информационные партнёры" items={partners.infoPartners} />
      </Reveal>
      <Reveal delay={0.15}>
        <LogoRow title="Информационные ресурсы" items={partners.infoResources} />
      </Reveal>
    </section>
  )
}
