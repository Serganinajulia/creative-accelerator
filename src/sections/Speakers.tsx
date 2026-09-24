import { useCallback, useEffect, useRef, useState } from 'react'
import speakers from '../data/speakers.json'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

type Role = 'speaker' | 'tracker'
type Tab = Role | 'all'

type Person = {
  id: string | number
  name: string
  description: string
  photo: string
  roles: Role[]
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'speaker', label: 'Спикеры' },
  { id: 'tracker', label: 'Трекеры' },
]
const ROLE_LABEL: Record<Role, string> = { speaker: 'Спикер', tracker: 'Трекер' }
const GAP = 12 // = gap-3
const ARROW_SRC = '/assets/general/arrow.svg'

export default function Speakers() {
  const [tab, setTab] = useState<Tab>('all')

  const [activeId, setActiveId] = useState<Person['id'] | null>(null)
  const [edges, setEdges] = useState({ prev: false, next: false })
  const trackRef = useRef<HTMLDivElement>(null)

  const people = (speakers as Person[]).filter(
    (p) => tab === 'all' || p.roles.includes(tab)
  )
  const updateEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setEdges({
      prev: el.scrollLeft > 4,
      next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    })
  }, [])

  // при смене таба возвращаемся в начало и пересчитываем стрелки
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: 0 })
    setActiveId(null)
    updateEdges()
    const ro = new ResizeObserver(updateEdges)
    ro.observe(el)
    return () => ro.disconnect()
  }, [tab, updateEdges])

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return
    el.scrollBy({ left: dir * (card.offsetWidth + GAP), behavior: 'smooth' })
  }

  return (
    <section id="speakers" className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading>
            Эксперты и{' '}
            <span className="bracket-word bracket-word--accent">трекеры</span>
          </SectionHeading>

          <div className="flex items-center gap-3">
            {/* табы-пилюли */}
            <div className="flex gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-pressed={tab === t.id}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    tab === t.id
                      ? 'bg-primary text-white'
                      : 'border border-dark/15 text-dark hover:border-primary hover:text-primary'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* стрелки */}
            <div className="flex gap-2">
              <ArrowButton dir={-1} disabled={!edges.prev} onClick={() => scrollByCard(-1)} />
              <ArrowButton dir={1} disabled={!edges.next} onClick={() => scrollByCard(1)} />
            </div>
          </div>
        </div>
      </Reveal>

      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {people.map((p) => (
          <article
            key={p.id}
            data-active={activeId === p.id}
            onClick={() => setActiveId((id) => (id === p.id ? null : p.id))}
            className="group shrink-0 snap-start cursor-pointer w-[78%] sm:w-[calc((100%-12px)/2)] lg:w-[calc((100%-36px)/4)]"
          >
            {/* фото: дуотон → цвет */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-primary">
              <img
                src={p.photo}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover grayscale transition duration-700 ease-out
                  group-hover:scale-105 group-hover:grayscale-0
                  group-data-[active=true]:scale-105 group-data-[active=true]:grayscale-0"
              />
              {/* синяя плёнка дуотона */}
              <div
                className="pointer-events-none absolute inset-0 bg-primary mix-blend-multiply transition-opacity duration-700
                  group-hover:opacity-0 group-data-[active=true]:opacity-0"
              />
              {/* красный кружок со стрелкой выезжает из угла */}
              <span
                className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-accent
                  translate-x-3 -translate-y-3 scale-50 opacity-0 transition duration-500 ease-out
                  group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100
                  group-data-[active=true]:translate-x-0 group-data-[active=true]:translate-y-0
                  group-data-[active=true]:scale-100 group-data-[active=true]:opacity-100"
              >
                <img src={ARROW_SRC} alt="" className="h-4 w-4 -rotate-180 brightness-0 invert" />
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-dark transition-colors group-hover:text-primary group-data-[active=true]:text-primary">
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-dark/60">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.roles.map((r) => (
                  <span
                    key={r}
                    className="rounded-full border border-dark/15 px-3 py-1 text-xs text-dark/70"
                  >
                    {ROLE_LABEL[r]}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ArrowButton({
  dir,
  disabled,
  onClick,
}: {
  dir: 1 | -1
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={dir === -1 ? 'Назад' : 'Вперёд'}
      disabled={disabled}
      onClick={onClick}
      className="grid h-12 w-12 place-items-center rounded-full bg-accent transition
        hover:scale-105 disabled:cursor-default disabled:opacity-30 disabled:hover:scale-100"
    >
      <img
        src={ARROW_SRC}
        alt=""
        className={`h-5 w-5 brightness-0 invert ${dir === -1 ? '-rotate-[135deg]' : 'rotate-45'}`}
      />
    </button>
  )
}