import { useEffect, useRef, useState } from 'react'
import texts from '../data/texts.json'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import timeline from '../data/timelineProgram.json'

const scrollToSelection = () =>
  document.getElementById('selection')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export default function CriteriaSelection() {
  return (
    <>
      <CriteriaQuiz />
      <Selection />
    </>
  )
}

/* ───────── Квиз «Проверьте, подходит ли вам программа» ───────── */

function CriteriaQuiz() {
  const { title, items } = texts.criteria
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false))

  const done = checked.filter(Boolean).length
  const all = done === items.length

  // все пункты отмечены → даём секунду увидеть результат и скроллим дальше
  useEffect(() => {
    if (!all) return
    const t = setTimeout(scrollToSelection, 1000)
    return () => clearTimeout(t)
  }, [all])

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))

  return (
    <section id="criteria" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        {/* левая колонка: заголовок + прогресс */}
        <Reveal>
          <SectionHeading>{title}</SectionHeading>
          <p className="mt-4 text-dark/60">Отметьте пункты, которые про вас</p>

          <div className="mt-8">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-dark/60">Совпадений</span>
              <span className="font-bold tabular-nums text-primary">
                {done} / {items.length}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-dark/10">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
                style={{ width: `${(done / items.length) * 100}%` }}
              />
            </div>
          </div>

          <div aria-live="polite" className="mt-6 min-h-[5.5rem]">
            {all ? (
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-primary p-5 text-white">
                <div>
                  <p className="font-bold">Программа вам подходит!</p>
                  <p className="mt-1 text-sm text-white/70">Смотрите, как попасть в акселератор</p>
                </div>
                <button
                  type="button"
                  onClick={scrollToSelection}
                  className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold transition hover:scale-105"
                >
                  Дальше
                </button>
              </div>
            ) : done > 0 ? (
              <p className="text-sm text-dark/60">
                Если какой-то пункт пока не про вас — всё равно{' '}
                <a href="#application-form" className="text-primary underline underline-offset-4">
                  подайте заявку
                </a>
                , эксперты посмотрят на проект целиком.
              </p>
            ) : null}
          </div>
        </Reveal>

        {/* правая колонка: карточки-критерии */}
        <Reveal delay={0.1}>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((c, i) => {
              const on = checked[i]
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(i)}
                  className={`sm:[&:last-child:nth-child(odd)]:col-span-2 group flex h-full items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
                    on
                      ? 'border-primary bg-primary text-white'
                      : 'border-dark/10 bg-white text-dark hover:-translate-y-0.5 hover:border-primary/40'
                  }`}
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 ${
                      on ? 'scale-110 border-accent bg-accent' : 'border-dark/20 group-hover:border-primary'
                    }`}
                  >
                    {/* галочка «рисуется» через stroke-dashoffset */}
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-white">
                      <path
                        d="M3 8.5l3 3 7-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="20"
                        strokeDashoffset={on ? 0 : 20}
                        className="transition-[stroke-dashoffset] duration-300 ease-out"
                      />
                    </svg>
                  </span>
                  <span>
                    <span className="mt-1 block font-medium">{c}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────── Роадмеп «Как попасть в акселератор» ───────── */

// куски общего градиента: светло-синий → синий → фиолетовый → красно-фиолетовый → красный
const STAGE_GRADIENTS = [
  ['#7F9CE3', '#012D94'],
  ['#012D94', '#6B3AA6'],
  ['#6B3AA6', '#B8337A'],
  ['#B8337A', '#E52C2B'],
]

const STEP = 0.6 // время заливки одной полоски, сек

type Step = {
  title: string
  showDeadline?: boolean
  subtitle?: string
  description?: string
  count?: string
}

// один раз срабатывает, когда блок заходит в экран
function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -20% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, inView] as const
}

function CriteriaDropdown({
  label,
  items,
  open,
  setOpen,
}: {
  label: string
  items: string[]
  open: boolean
  setOpen: (v: boolean) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  // закрытие по клику мимо и по Esc
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, setOpen])

  return (
    <div ref={ref} className="relative mt-3 self-start">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="selection-criteria"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-dark/60 transition-colors hover:text-primary"
      >
        {label}
        <img
          src="/assets/general/arrow.svg"
          alt=""
          className={`h-3 w-3 opacity-50 transition-transform duration-300 ${
            open ? '-rotate-45' : 'rotate-[135deg]'
          }`}
        />
      </button>

      <ul
        id="selection-criteria"
        className={`absolute left-0 top-full z-20 mt-2 w-[min(22rem,calc(100vw-3rem))] origin-top-left space-y-3 rounded-2xl bg-white p-5 shadow-xl shadow-dark/10 transition duration-200 ease-out ${
          open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        {items.map((e) => (
          <li key={e} className="flex gap-3 text-sm text-dark">
            <img src="/assets/general/mark.svg" alt="" className="mt-0.5 h-4 w-4 shrink-0 grayscale opacity-30" />
            {e}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Selection() {
  const { titleAccent, title, evaluated } = texts.selection
  const steps = texts.selection.steps as Step[]
  const last = steps.length - 1
  const [ref, on] = useInView<HTMLOListElement>()
  const [criteriaOpen, setCriteriaOpen] = useState(false)

  const fade = on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
  const motion = 'transition duration-500 ease-out motion-reduce:transition-none'

  return (
    <section id="selection" className=" bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal>
          <SectionHeading>
            <span className="bracket-word bracket-word--accent">{titleAccent}</span> {title}
          </SectionHeading>
        </Reveal>

        <ol ref={ref} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const [from, to] = STAGE_GRADIENTS[i] ?? STAGE_GRADIENTS[last]
            return (
              <li
                key={s.title}
                className={`relative flex flex-col rounded-2xl bg-white ${
                  s.subtitle && criteriaOpen ? 'z-20' : ''
                }`}
              >
                {/* полоска стадии — верхний край карточки */}
                <div className="relative h-2 overflow-hidden rounded-t-2xl bg-dark/5">
                  <div
                    className={`absolute inset-0 origin-left transition-transform ease-linear motion-reduce:transition-none ${
                      on ? 'scale-x-100' : 'scale-x-0'
                    }`}
                    style={{
                      background: `linear-gradient(90deg, ${from}, ${to})`,
                      transitionDuration: `${STEP}s`,
                      transitionDelay: `${i * STEP}s`,
                    }}
                  />
                </div>

                <div
                  className={`flex flex-1 flex-col p-6 ${motion} ${fade}`}
                  style={{ transitionDelay: `${i * STEP + STEP * 0.5}s` }}
                >
                  <h3 className="text-lg font-bold text-dark">{s.title}</h3>

                  {s.showDeadline && (
                    <span className="mt-3 self-start rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">
                      до {timeline.applicationDeadline}
                    </span>
                  )}

                  {s.description && (
                    <p className="mt-2 text-sm text-dark/60">
                      {s.count
                        ? s.description.split('{count}').map((part, k, arr) => (
                            <span key={k}>
                              {part}
                              {k < arr.length - 1 && (
                                <span className="mx-0.5 align-baseline text-3xl font-bold leading-none text-accent">
                                  {s.count}
                                </span>
                              )}
                            </span>
                          ))
                        : s.description}
                    </p>
                  )}

                  {s.subtitle && (
                    <CriteriaDropdown
                      label={s.subtitle}
                      items={evaluated}
                      open={criteriaOpen}
                      setOpen={setCriteriaOpen}
                    />
                  )}
                </div>
              </li>
            )
          })}
        </ol>
        {/* CTA по центру последней колонки */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a 
            href="#application-form"
            className={`justify-self-center rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:scale-105 sm:col-start-2 lg:col-start-4 ${
              on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: on ? `${(last + 1) * STEP}s` : '0s', transitionDuration: '500ms' }}
          >
            Заполнить заявку
          </a>
        </div>
      </div>
    </section>
  )
}