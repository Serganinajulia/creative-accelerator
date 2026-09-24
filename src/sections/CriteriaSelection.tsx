import { useEffect, useState } from 'react'
import texts from '../data/texts.json'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

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
    <section id="criteria" className="mx-auto max-w-7xl px-6 py-20">
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

type Step = {
  title: string
  pill?: string
  subtitle?: string
  description?: string
  count?: string
}

function Selection() {
  const { titleAccent, title, evaluated } = texts.selection
  const steps = texts.selection.steps as Step[]
  const last = steps.length - 1
  const branchInset = 'calc((100% - 3rem) / 6)'

  return (
    <section id="selection" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
      <Reveal>
        <SectionHeading>
          <span className="bracket-word bracket-word--accent">{titleAccent}</span> {title}
        </SectionHeading>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 grid gap-10 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-0">
          <ol className="contents">
            {steps.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 lg:flex-col lg:gap-0">
                {i < last && (
                  <span
                    aria-hidden
                    className="absolute left-6 top-14 -bottom-8 w-px bg-primary/20
                      lg:left-14 lg:-right-4 lg:top-6 lg:bottom-auto lg:h-px lg:w-auto"
                  />
                )}

                <span
                  className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full font-bold text-white ${
                    i === last ? 'bg-accent' : 'bg-primary'
                  }`}
                >
                  {i + 1}
                </span>

                <div className="flex flex-1 flex-col pt-2.5 lg:pt-0">
                  <h3 className="text-lg font-bold text-dark lg:mt-6">{s.title}</h3>

                  {s.pill && (
                    <span className="mt-3 self-start rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                      {s.pill}
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
                    <>
                      <p className="mt-2 text-sm text-dark/60">{s.subtitle}:</p>

                      {/* мобильная версия: список под шагом */}
                      <ul className="mt-3 space-y-2 lg:hidden">
                        {evaluated.map((e, k) => (
                          <li
                            key={e}
                            className="flex gap-3 rounded-xl bg-primary/5 px-3 py-2.5 text-sm text-dark"
                          >
                            <span className="shrink-0 text-xs font-semibold tabular-nums text-primary/40">
                              {String(k + 1).padStart(2, '0')}
                            </span>
                            {e}
                          </li>
                        ))}
                      </ul>

                      {/* десктоп: ствол ветки */}
                      <span aria-hidden className="mx-auto mt-4 hidden w-px flex-1 bg-primary/20 lg:block" />
                    </>
                  )}

                  {i === last && (
                    <a 
                      href="#application-form"
                      className="mt-5 inline-block self-start rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:scale-105"
                    >
                      Подать заявку
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {/* десктоп: ветка + 6 критериев (3×2) под колонками 2–4 */}
          <div className="relative hidden pt-10 lg:col-span-3 lg:col-start-2 lg:grid lg:grid-cols-3 lg:gap-6">
            <span aria-hidden className="absolute top-0 h-5 w-px bg-primary/20" style={{ left: branchInset }} />
            <span
              aria-hidden
              className="absolute top-5 h-px bg-primary/20"
              style={{ left: branchInset, right: branchInset }}
            />

            {evaluated.map((e, k) => (
              <div
                key={e}
                className="relative rounded-2xl bg-primary/5 p-5 transition-colors duration-300 hover:bg-primary/10"
              >
                {k < 3 && <span aria-hidden className="absolute -top-5 left-1/2 h-5 w-px bg-primary/20" />}
                <span className="block text-xs font-semibold tabular-nums text-primary/40">
                  {String(k + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 text-sm font-medium text-dark">{e}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}