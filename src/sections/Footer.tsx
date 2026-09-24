import texts from '../data/texts.json'
import partners from '../data/partners.json'
import nav from '../data/nav.json'

type NavItem = { label: string; href: string; placement: string[] }

const footerNav = (nav as NavItem[]).filter((n) => n.placement.includes('footer'))

// одна сетка для верхнего и нижнего ряда, чтобы колонки совпадали
const cols = 'md:grid-cols-[1.4fr_1fr_1fr]'
// на мобиле: узкая колонка по центру, на десктопе обычная ширина
const narrow = 'mx-auto w-full max-w-xs md:mx-0 md:max-w-none'
// разделитель: горизонтальный на мобиле
const sepTop = 'border-t border-white/15 pt-10 md:border-t-0 md:pt-0'

export default function Footer() {
  const f = texts.footer
  const logos = partners.organizers.items
  const label = 'mb-4 text-xs font-semibold uppercase tracking-wide text-white/50'

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* row 1 */}
        <div className={`grid gap-10 md:gap-12 ${cols}`}>
          {/* col 1: логотип, описание, партнёры */}
          <div className={narrow}>
            <a href="#top" aria-label="Наверх" className="inline-block">
              <img
                src="/assets/general/logo.svg"
                alt="Креативная среда. Акселератор"
                className="h-14 w-auto md:h-16"
              />
            </a>
            <p className="mt-4 text-white/80">{f.tagline}</p>

            <p className={`${label} mt-10`}>Организаторы и партнёры</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
              {logos.map((p) => (
                <a 
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={p.name}
                  className="transition hover:opacity-80"
                >
                  <img src={p.logo} alt={p.name} className="h-9 w-auto" />
                </a>
              ))}
            </div>
          </div>

          {/* col 2: навигация; разделитель сверху на мобиле, слева на десктопе */}
          <div className={`${sepTop} md:border-l md:border-white/15 md:pl-12`}>
            <nav aria-label="Навигация по странице" className={narrow}>
              <p className={label}>Навигация</p>
              <ul className="space-y-2.5">
                {footerNav.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="text-white/80 transition-colors hover:text-white">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* col 3: контакты; разделитель сверху только на мобиле */}
          <div className={sepTop}>
            <div className={narrow}>
              <p className={label}>Контакты</p>
              <a 
                href={`mailto:${f.email}`}
                className="text-lg font-semibold underline-offset-4 transition hover:underline"
              >
                {f.email}
              </a>
              <dl className="mt-4 space-y-1 text-sm text-white/70">
                <div className="flex gap-2">
                  <dt>ОГРН:</dt>
                  <dd>{f.ogrn}</dd>
                </div>
                <div className="flex gap-2">
                  <dt>ИНН:</dt>
                  <dd>{f.inn}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* row 2: копирайт и документы */}
        <div
          className={`mt-12 grid gap-3 border-t border-white/15 pt-6 text-sm text-white/60 md:gap-12 ${cols}`}
        >
          <p className={narrow}>{f.copyright}</p>
          <a href={f.terms.href} className={`${narrow} transition-colors hover:text-white`}>
            {f.terms.label}
          </a>
          <a href={f.privacy.href} className={`${narrow} transition-colors hover:text-white`}>
            {f.privacy.label}
          </a>
        </div>
      </div>
    </footer>
  )
}