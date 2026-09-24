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
  description,
  icon,
}: {
  title: string
  description?: string
  icon?: IconType
}) {
  const iconConfig = icon ? ICON_CONFIG[icon] : null

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white text-dark p-6 min-h-[180px] h-full flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
      {iconConfig && (
        <motion.div
          aria-hidden
          className="absolute -bottom-10 -right-10 w-40 h-40 opacity-[0.07] pointer-events-none"
          style={{
            backgroundColor: iconConfig.color,
            WebkitMaskImage: `url(${iconConfig.src})`,
            maskImage: `url(${iconConfig.src})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
          animate={
            icon === 'snowflake'
              ? { rotate: 360 }
              : { y: [0, -10, 0] }
          }
          transition={
            icon === 'snowflake'
              ? { duration: 34, repeat: Infinity, ease: 'linear' }
              : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      )}

      <h3 className="relative font-bold text-lg md:text-xl leading-snug text-primary">{title}</h3>
      {description && <p className="relative text-dark/60 mt-2">{description}</p>}
    </div>
  )
}

export default function ShortAbout() {
  const items = texts.shortAbout.items
  const titleWords = texts.shortAbout.title.split(' ')
  const [titleFirst, ...titleRestArr] = titleWords
  const titleRest = titleRestArr.join(' ')

  // Разбиваем массив элементов под заданные роли:
  const card1 = items[0] // Верхняя левая (1/3) — без иконки
  const card2 = items[1] // Верхняя правая (2/3) — снежинка
  const card3 = items[2] // Левая объединяющая (1/3, 2 строки) — стрелка вверх
  const rightQuadItems = items.slice(3, 7) // 4 карточки правого блока — без иконок

  return (
    <section id="short-about" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading className="mb-8">
            <span className="bracket-word bracket-word--accent">{titleFirst}</span> {titleRest}
          </SectionHeading>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {card1 && (
            <Reveal delay={0}>
              <BentoCard title={card1.title} description={card1.description} />
            </Reveal>
          )}

          {card2 && (
            <Reveal delay={0.08} className="md:col-span-2">
              <BentoCard title={card2.title} description={card2.description} icon="snowflake" />
            </Reveal>
          )}

          {card3 && (
            <Reveal delay={0.16} className="md:row-span-2">
              <BentoCard title={card3.title} description={card3.description} icon="arrow" />
            </Reveal>
          )}

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {rightQuadItems.map((item, idx) => (
              <Reveal key={item.title + idx} delay={0.24 + idx * 0.08}>
                <BentoCard title={item.title} description={item.description} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}