import { useState } from 'react'
import texts from '../data/texts.json'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null)
  const { title, titleAccent, items } = texts.faq

  return (
    <section id="faq" className="mx-auto max-w-7xl px-6 py-15 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        {/* заголовок остаётся на месте, пока листается список */}
        <div className="self-start lg:sticky lg:top-28">
          <Reveal>
            <SectionHeading>
              {title} <span className="bracket-word bracket-word--accent">{titleAccent}</span>
            </SectionHeading>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ul className="space-y-3">
            {items.map((item, i) => {
              const isOpen = open === i
              return (
                <li key={item.q} className="relative overflow-hidden rounded-2xl bg-surface">
                  {/* синяя заливка слева направо */}
                  <span
                    aria-hidden
                    className={`absolute inset-0 origin-left bg-primary transition-transform duration-500 ease-out motion-reduce:transition-none ${
                      isOpen ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />

                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className={`group relative flex w-full items-center justify-between gap-6 p-5 text-left transition-colors duration-500 md:p-6 ${
                      isOpen ? 'text-white' : 'text-dark'
                    }`}
                  >
                    <span className="text-lg font-bold md:text-xl">{item.q}</span>

                    {/* плюс → крестик */}
                    <span
                      className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-500 ${
                        isOpen
                          ? 'rotate-45 bg-accent'
                          : 'bg-white group-hover:bg-primary'
                      }`}
                    >
                      <span
                        className={`absolute h-0.5 w-4 rounded-full transition-colors duration-500 ${
                          isOpen ? 'bg-white' : 'bg-primary group-hover:bg-white'
                        }`}
                      />
                      <span
                        className={`absolute h-4 w-0.5 rounded-full transition-colors duration-500 ${
                          isOpen ? 'bg-white' : 'bg-primary group-hover:bg-white'
                        }`}
                      />
                    </span>
                  </button>

                  {/* раскрытие по высоте */}
                  <div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    className={`relative grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`max-w-2xl px-5 pb-6 text-base text-white/80 transition duration-500 md:px-6 ${
                          isOpen ? 'translate-y-0 opacity-100 delay-150' : '-translate-y-2 opacity-0'
                        }`}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}