import { useState } from 'react'
import texts from '../data/texts.json'
import Reveal from '../components/Reveal'

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">{texts.faq.title}</h2>
      </Reveal>
      <div className="divide-y divide-dark/10">
        {texts.faq.items.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex justify-between items-center py-4 text-left font-medium"
              >
                {item.q}
                <span className={`transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              {isOpen && <p className="pb-4 text-sm text-dark/60">{item.a}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
