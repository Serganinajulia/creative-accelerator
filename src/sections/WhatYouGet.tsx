import { useRef, useState } from 'react'
import texts from '../data/texts.json'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

function SpotlightCard({ title, description }: { title: string; description: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 50, y: 50 })

  function handleMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className="relative overflow-hidden rounded-3xl bg-primary text-white p-6 min-h-[180px]"
      style={{
        backgroundImage: `radial-gradient(300px circle at ${pos.x}% ${pos.y}%, rgba(229,44,43,0.35), transparent 70%)`,
      }}
    >
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
    </div>
  )
}

export default function WhatYouGet() {
  return (
    <section id="what-you-get" className="mx-auto max-w-7xl px-6 pt-10 md:pt-15">
      <Reveal>
        <SectionHeading className="mb-8">{texts.whatYouGet.title}</SectionHeading>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2">
        {texts.whatYouGet.items.map((item, i) => (
          <Reveal key={item.title + i} delay={i * 0.08}>
            <SpotlightCard title={item.title} description={item.description} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}