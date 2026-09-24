import { motion } from 'framer-motion'
import data from '../data/timelineProgram.json'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

type StageProps = {
  number?: string
  title: string
  description?: string
  date?: string
  emphasis?: boolean
  /** цвет пилюли с датой (tailwind-классы), если нужен не стандартный бело-синий */
  pillColor?: string
  /** цвет кружка с номером (tailwind-классы) */
  numberColor?: string
}

function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide whitespace-nowrap ${className ?? ''}`}>
      {children}
    </span>
  )
}

function StageNode({ number, title, description, date, emphasis, pillColor, numberColor }: StageProps) {
  const resolvedPillColor = pillColor ?? 'bg-white text-primary'
  const resolvedNumberColor = numberColor ?? 'bg-white text-primary'
  const hasBadge = Boolean(number || date)

  return (
    <div
      className={`relative rounded-2xl p-6 md:p-7 h-full ${hasBadge ? 'pt-9' : ''} ${
        emphasis
          ? 'bg-white text-primary shadow-xl ring-1 ring-accent/20'
          : 'bg-white/10 backdrop-blur-sm text-white border border-white/15'
      }`}
    >
      {/* номер-кружок + дата — приподняты над верхней границей карточки, по центру */}
      {hasBadge && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {number && (
            <span className={`flex items-center justify-center w-10 h-10 rounded-full font-extrabold text-base shrink-0 shadow ${resolvedNumberColor}`}>
              {number}
            </span>
          )}
          {date && <Pill className={`shadow ${resolvedPillColor}`}>{date}</Pill>}
        </div>
      )}

      <h3 className="font-bold leading-snug">{title}</h3>
      {description && (
        <p className={`text-sm mt-1 ${emphasis ? 'text-dark/60' : 'text-white/70'}`}>{description}</p>
      )}
    </div>
  )
}

/** Соединительная линия — «дорисовывается» при попадании в область видимости.
    delay позволяет выстроить линии в общую последовательность появления. */
function VLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`w-px bg-white/25 origin-top ${className ?? ''}`}
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    />
  )
}

function HLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`h-px bg-white/25 origin-left ${className ?? ''}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    />
  )
}

export default function FormatProgram() {
  return (
    <section
      id="program"
      className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-black"
    >
      <div className="mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <SectionHeading light className="mb-4">
          Формат участия и этапы
          </SectionHeading>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-20 text-white/80 text-sm">
            <span className="inline-flex items-center gap-2">
              {data.format.main}
              <Pill className="bg-white text-primary">{data.format.mainMode}</Pill>
            </span>
            <span className="inline-flex items-center gap-2">
              {data.format.final}
              <Pill className="bg-accent text-white">{data.format.finalMode}</Pill>
            </span>
          </div>
        </Reveal>

        {/* Появление идёт по цепочке роадмепа: 01 → 02 → линия → Старт → линия →
            параллельные этапы по очереди → линия → Финал. Каждый следующий узел
            стартует заметно позже предыдущего, а не почти одновременно. */}
        <div className="flex flex-col items-center">
          {/* Ряд 1: Отбор → Диагностика (последовательно) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full max-w-3xl text-center">
            <Reveal delay={0} className="flex-1">
              <StageNode {...data.sequential[0]} numberColor="bg-secondary text-white" />
            </Reveal>
            <HLine className="hidden sm:block w-10 shrink-0" delay={0.15} />
            <Reveal delay={0.2} className="flex-1">
              <StageNode {...data.sequential[1]} numberColor="bg-secondary text-white" />
            </Reveal>
          </div>

          <VLine className="h-12" delay={0.35} />

          {/* Старт акселератора — отдельно, под 01/02: отсюда идёт развилка на 3 параллельных этапа */}
          <Reveal delay={0.45} className="w-full max-w-sm text-center">
            <StageNode
              number={data.kickoff.number}
              title={data.kickoff.title}
              date={data.kickoff.date}
              emphasis
              pillColor="bg-primary text-white ring-1 ring-white"
              numberColor="bg-primary text-white ring-1 ring-white"
            />
          </Reveal>

          <VLine className="h-12" delay={0.6} />

          {/* Ряд 2: развилка на 3 параллельных этапа, общая верхняя и нижняя перемычка */}
          <div className="relative w-full max-w-5xl pt-12 pb-12 text-center">
            <HLine className="hidden md:block absolute top-0 left-[16.67%] right-[16.67%]" delay={0.7} />
            <HLine className="hidden md:block absolute bottom-0 left-[16.67%] right-[16.67%]" delay={1.25} />

            <div className="grid md:grid-cols-3 gap-8">
              {data.parallel.map((stage, i) => (
                <div key={stage.title} className="relative">
                  <VLine className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 h-12" delay={0.8 + i * 0.15} />
                  <Reveal delay={0.85 + i * 0.15}>
                    <StageNode {...stage} />
                  </Reveal>
                  <VLine className="hidden md:block absolute -bottom-12 left-1/2 -translate-x-1/2 h-12" delay={1.1 + i * 0.15} />
                </div>
              ))}
            </div>
          </div>

          <VLine className="h-12" delay={1.4} />

          <Reveal delay={1.5} className="w-full max-w-sm text-center">
            <StageNode
              {...data.final}
              emphasis
              pillColor="bg-accent text-white ring-1 ring-white"
              numberColor="bg-accent text-white ring-1 ring-white"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}