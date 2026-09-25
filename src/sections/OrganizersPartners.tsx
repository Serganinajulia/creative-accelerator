import type { CSSProperties } from 'react'
import partners from '../data/partners.json'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

type Partner = {
  name: string
  logo: string
  url: string
  /** Базовая оптическая высота лого в px — подбирается вручную, как в брендбуке */
  height: number
  /** Подпись под лого (например, роль партнёра) */
  caption?: string
}

/**
 * Высота лого = базовая высота из JSON × общий коэффициент (одинаковый для всех,
 * поэтому пропорции между лого сохраняются).
 *
 * Десктоп (lg+, все в один ряд): коэффициент 1.2.
 * Мобилка и планшет (по 2 в ряд): коэффициент «резиновый» — растёт с шириной экрана:
 *   ~375px → 1 (минимум)
 *   ~500px → ~1.05
 *   ~768px → 1.6 (максимум, держится до 1024px)
 * Коэффициент на 1vw ≈ 1.6 / 768 × 100 ≈ 0.21.
 *
 * На самых узких телефонах широкие лого (ФКИ, «Мой бизнес») упираются в ширину
 * ячейки — max-w-full их аккуратно ужимает, не давая вылезти за край.
 */
const SIZE_CLS =
  'h-[clamp(calc(var(--h)*1px),calc(var(--h)*0.21vw),calc(var(--h)*1.6px))] lg:h-[calc(var(--h)*1.2px)]'

/** Высота «полосы» = самое высокое лого, чтобы все центрировались по одной оси */
function Logo({ p, band }: { p: Partner; band: number }) {
  return (
    <li className="flex min-w-0 flex-col items-center">
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={p.name}
        style={{ '--h': band } as CSSProperties}
        className={`${SIZE_CLS} flex max-w-full items-center rounded-lg outline-none transition-opacity duration-300 hover:opacity-75 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-4 focus-visible:ring-offset-primary`}
      >
        <img
          src={p.logo}
          alt={p.name}
          loading="lazy"
          style={{ '--h': p.height } as CSSProperties}
          className={`${SIZE_CLS} w-auto max-w-full object-contain`}
        />
      </a>
      {p.caption && <span className="mt-3 text-sm text-white/60">{p.caption}</span>}
    </li>
  )
}

export default function OrganizersPartners() {
  const { section, organizers, infoPartners } = partners
  const orgItems = organizers.items as Partner[]
  const infoItems = infoPartners.items as Partner[]
  const band = Math.max(...orgItems.map((p) => p.height), ...infoItems.map((p) => p.height))

  return (
    <section id="organizers" className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-15 md:py-20">
        <Reveal>
          <SectionHeading light description={section.description} wrapperClassName="mb-14">
            {section.title}
          </SectionHeading>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
            {/* Организаторы */}
            <ul
              aria-label={organizers.title}
              className="grid flex-1 grid-cols-2 items-start gap-x-8 gap-y-10 lg:flex lg:justify-between lg:gap-8"
            >
              {orgItems.map((p) => (
                <Logo key={p.name} p={p} band={band} />
              ))}
            </ul>

            {/* Инфопартнёр: отделён чертой, роль — подписью под лого */}
            {infoItems.length > 0 && (
              <ul
                aria-label={infoPartners.title}
                className="flex justify-center gap-8 border-t border-white/15 pt-5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
              >
                {infoItems.map((p) => (
                  <Logo key={p.name} p={p} band={band} />
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}