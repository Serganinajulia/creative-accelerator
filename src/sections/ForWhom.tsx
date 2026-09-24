import { motion } from 'framer-motion'
import { useState } from 'react'
import texts from '../data/texts.json'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

interface TagRowProps {
  items: string[]
  direction: 'left' | 'right'
  duration?: number
  className?: string
}

function TagRow({ items, direction, duration = 25, className = '' }: TagRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Дублируем массив 3 раза для бесшовной анимации без разрывов
  const repeatedItems = [...items, ...items, ...items]

  return (
    <div
      className="overflow-hidden whitespace-nowrap py-2 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="inline-flex gap-4"
        animate={{
          x: direction === 'left' ? ['0%', '-33.33%'] : ['-33.33%', '0%'],
        }}
        transition={{
          duration: isHovered ? duration * 3 : duration, // Пауза/замедление при ховере
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {repeatedItems.map((item, i) => (
          <motion.span
            key={`${item}-${i}`}
            whileHover={{ scale: 1.08, y: -3 }}
            className={`inline-block px-5 py-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none font-medium ${className}`}
          >
            {item}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

export default function ForWhom() {
  const allIndustries: string[] = texts.forWhom.industries

  // Разбиваем массив тегов на 4 равные части
  const chunkSize = Math.ceil(allIndustries.length / 4)
  const row1 = allIndustries.slice(0, chunkSize)
  const row2 = allIndustries.slice(chunkSize, chunkSize * 2)
  const row3 = allIndustries.slice(chunkSize * 2, chunkSize * 3)
  const row4 = allIndustries.slice(chunkSize * 3)

  return (
    <section id="for-whom" className="pt-20 md:pt-28 bg-white text-dark overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Разделение на 2 равные колонки (50/50) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="flex flex-col gap-6">
            <Reveal>
              <SectionHeading>{texts.forWhom.title}</SectionHeading>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="bracket-frame text-lg leading-snug text-dark/80">{texts.forWhom.description}</p>
            </Reveal>
          </div>

          {/* ПРАВАЯ КОЛОНКА (Бегущие строки тегов) */}
          <div className="relative overflow-hidden flex flex-col justify-center gap-4">
            {/* Градиентное размытие по левому и правому краям (под цвет белого фона) */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

            <Reveal delay={0.2}>
              <div className="flex flex-col gap-4">
                {/* Ряд 1: Верхний — Светлые фоновые теги */}
                <TagRow
                  items={row1}
                  direction="left"
                  duration={35}
                  className="bg-gray-50 border-gray-200/80 text-primary/50 text-sm md:text-base hover:bg-primary hover:text-white hover:border-primary"
                />

                {/* Ряд 2: Основные акцентные теги */}
                <TagRow
                  items={row2}
                  direction="right"
                  duration={24}
                  className="bg-primary/5 border-primary/20 text-primary text-base md:text-lg font-semibold hover:bg-primary hover:text-white hover:border-primary shadow-sm"
                />

                {/* Ряд 3: Основные акцентные теги */}
                <TagRow
                  items={row3}
                  direction="left"
                  duration={28}
                  className="bg-primary/5 border-primary/20 text-primary text-base md:text-lg font-semibold hover:bg-primary hover:text-white hover:border-primary shadow-sm"
                />

                {/* Ряд 4: Нижний — Светлые фоновые теги */}
                <TagRow
                  items={row4}
                  direction="right"
                  duration={38}
                  className="bg-gray-50 border-gray-200/80  text-primary/50 text-sm md:text-base hover:bg-primary hover:text-white hover:border-primary"
                />
              </div>
            </Reveal>
          </div>

        </div>
                {/* приоритет при отборе */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex items-start gap-4 rounded-2xl bg-primary p-6 text-white md:mt-16 md:items-center md:p-8">
            <img src="/assets/general/mark.svg" alt="" className="mt-1 h-6 w-6 shrink-0 brightness-0 invert md:mt-0" />
            <p className="text-lg font-semibold leading-snug md:text-xl">{texts.forWhom.priority}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}