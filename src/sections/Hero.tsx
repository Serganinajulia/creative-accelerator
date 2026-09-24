import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import texts from '../data/texts.json'
import format from '../data/timelineProgram.json'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // параллакс: графика отстаёт от текста при скролле
  const graphicY = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section id="top" ref={ref} className="relative min-h-screen bg-primary text-white overflow-hidden pt-32">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="uppercase tracking-wide text-white/70 mb-4">{texts.hero.overline}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">{texts.hero.title}</h1>
          <p className="text-white/80 max-w-md mb-8">{texts.hero.description}</p>
          <div className="flex items-center gap-4">
            <a
              href="#application-form"
              className="rounded-full bg-accent px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
            >
              {texts.hero.cta}
            </a>
            <span className=" text-white/60">Приём заявок до {format.applicationDeadline}</span>
          </div>
        </div>

        {/* Заглушка фирменной 3D-графики — заменить на финальные ассеты дизайнера */}
        <motion.div
          style={{ y: graphicY }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative aspect-square max-w-md mx-auto"
        >
          <img src="/assets/general/general.png" alt="" className="w-full h-full object-contain" />
        </motion.div>
      </div>
    </section>
  )
}