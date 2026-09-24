import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import texts from '../data/texts.json'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

type IconType = 'snowflake' | 'arrow'

const ICON_CONFIG: Record<IconType, { src: string; color: string }> = {
  snowflake: { src: '/assets/general/mark.svg', color: 'var(--color-primary)' },
  arrow: { src: '/assets/general/arrow.svg', color: 'var(--color-accent)' },
}

function BentoCard({
  title,
  value,
  description,
  icon,
  lead = false,
  children,
}: {
  title: string
  value?: string
  description?: string
  icon?: IconType
  lead?: boolean
  children?: ReactNode
}) {
  const iconConfig = icon ? ICON_CONFIG[icon] : null

  return (
    <div className="relative flex h-full min-h-[180px] flex-col justify-center overflow-hidden rounded-3xl bg-white p-6 text-dark shadow-sm transition-shadow hover:shadow-md md:p-8">
      {iconConfig && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 opacity-[0.07]"
          style={{
            backgroundColor: iconConfig.color,
            WebkitMaskImage: `url(${iconConfig.src})`,
            maskImage: `url(${iconConfig.src})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
          animate={icon === 'snowflake' ? { rotate: 360 } : { y: [0, -10, 0] }}
          transition={
            icon === 'snowflake'
              ? { duration: 34, repeat: Infinity, ease: 'linear' }
              : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      )}

      {/* крупная цифра */}
      {value && (
        <p className="relative text-6xl font-extrabold leading-none text-primary md:text-7xl">{value}</p>
      )}

      {lead ? (
        <p className="relative text-xl font-semibold leading-snug text-primary md:text-2xl">{title}</p>
      ) : (
        <h3
          className={`relative text-lg font-bold leading-snug md:text-xl ${
            value ? 'mt-3 text-dark' : 'text-primary'
          }`}
        >
          {title}
        </h3>
      )}

      {description && <p className="relative mt-2 text-dark/60">{description}</p>}
      {children && <div className="relative mt-4">{children}</div>}
    </div>
  )
}

export default function ShortAbout() {
  const s = texts.shortAbout

  return (
    <section id="short-about" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading className="mb-8">
            {s.title} <span className="bracket-word bracket-word--accent">{s.titleAccent}</span>
          </SectionHeading>
        </Reveal>

        {/*
          ┌───────────── lead (2) ─────────────┬──── 20 ────┐
          ├── вебинары (2 строки) ──┬── трекер (2) ─────────┤
          │                         ├── кураторы ─┬─ защита ┤
        */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Reveal delay={0} className="md:col-span-2">
            <BentoCard title={s.lead} lead />
          </Reveal>

          <Reveal delay={0.08}>
            <BentoCard value={s.participants.value} title={s.participants.label} />
          </Reveal>

          <Reveal delay={0.16} className="md:row-span-2">
            <BentoCard value={s.webinars.value} title={s.webinars.label} icon="arrow">
              {s.webinars.topics.length > 0 && (
                <ul className="space-y-2 text-dark/70">
                  {s.webinars.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </BentoCard>
          </Reveal>

          <Reveal delay={0.24} className="md:col-span-2">
            <BentoCard value={s.tracker.value} title={s.tracker.label} icon="snowflake" />
          </Reveal>

          <Reveal delay={0.32}>
            <BentoCard title={s.curators} />
          </Reveal>

          <Reveal delay={0.4}>
            <BentoCard title={s.defense} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}