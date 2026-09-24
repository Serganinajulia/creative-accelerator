import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import nav from '../data/nav.json'
import texts from '../data/texts.json'
import timeline from '../data/timelineProgram.json'
import Logo from '../components/Logo'

type NavItem = { label: string; href: string; placement: string[] }

const headerNav = (nav as NavItem[]).filter((n) => n.placement.includes('header'))
const EASE = [0.22, 1, 0.36, 1] as const

/** плавный переход к якорю после закрытия меню */
function goTo(href: string) {
  setTimeout(() => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', href)
  }, 60)
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // шапка становится белой после начала скролла
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // пока меню открыто: страница не скроллится, Esc закрывает
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // растянули окно до десктопа — меню закрывается само
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const solid = scrolled && !open // белая шапка с тёмными элементами

  const onNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setOpen(false)
    goTo(href)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-white/95 shadow-sm backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <a href="#top" onClick={(e) => onNavClick(e, '#top')} aria-label="Креативная среда. Акселератор — наверх">
          <Logo
            className={`h-8 w-auto transition-colors duration-300 ${solid ? 'text-dark' : 'text-white'}`}
          />
        </a>

        {/* десктоп-навигация */}
        <nav aria-label="Основная навигация" className="hidden items-center gap-6 font-medium lg:flex">
          {headerNav.map((l) => (
            <a 
              key={l.href}
              href={l.href}
              className={`transition-colors ${
                solid ? 'text-dark hover:text-accent' : 'text-white/85 hover:text-white'
              }`}
            >
              {'{ '}
              {l.label}
              {' }'}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#application-form"
            className={`rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 sm:px-5 sm:text-base ${
              open ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
          >
            Подать заявку
          </a>
          <BurgerButton open={open} dark={solid} onClick={() => setOpen((o) => !o)} />
        </div>
      </div>

      <AnimatePresence>{open && <MobileMenu onNavClick={onNavClick} />}</AnimatePresence>
    </header>
  )
}

/* ---------- Кнопка-гамбургер: две линии → крестик ---------- */

function BurgerButton({ open, dark, onClick }: { open: boolean; dark: boolean; onClick: () => void }) {
  const line = dark ? 'bg-dark' : 'bg-white'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
      aria-expanded={open}
      aria-controls="mobile-menu"
      className={`group grid h-11 w-11 place-items-center rounded-full border transition-colors duration-300 lg:hidden ${
        dark ? 'border-dark/15 hover:border-dark/40' : 'border-white/30 hover:border-white/70'
      }`}
    >
      <span className="relative block h-3 w-5">
        <span
          className={`absolute right-0 h-0.5 w-5 rounded-full transition-all duration-300 ease-out ${line} ${
            open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
          }`}
        />
        <span
          className={`absolute right-0 h-0.5 rounded-full transition-all duration-300 ease-out ${line} ${
            open ? 'bottom-1/2 w-5 translate-y-1/2 -rotate-45' : 'bottom-0 w-3 group-hover:w-5'
          }`}
        />
      </span>
    </button>
  )
}

/* ---------- Полноэкранное меню ---------- */

// круг раскрывается из кнопки-гамбургера в правом верхнем углу
const CIRCLE_AT = 'at calc(100% - 46px) 38px'

function MobileMenu({
  onNavClick,
}: {
  onNavClick: (e: MouseEvent<HTMLAnchorElement>, href: string) => void
}) {
  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Меню"
      className="fixed inset-0 z-0 flex flex-col overflow-y-auto bg-primary text-white lg:hidden"
      initial={{ clipPath: `circle(0% ${CIRCLE_AT})` }}
      animate={{ clipPath: `circle(150% ${CIRCLE_AT})` }}
      exit={{ clipPath: `circle(0% ${CIRCLE_AT})` }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {/* фирменная орбита на фоне */}
      <svg
        aria-hidden
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] text-white/10"
        fill="none"
      >
        <ellipse cx="200" cy="200" rx="190" ry="80" stroke="currentColor" transform="rotate(-25 200 200)" />
        <ellipse cx="200" cy="200" rx="140" ry="140" stroke="currentColor" />
      </svg>

      <div className="relative flex flex-1 flex-col px-6 pb-8 pt-28">
        <nav aria-label="Навигация по странице">
          <ul>
            {headerNav.map((l, i) => (
              <li key={l.href} className="overflow-hidden">
                <motion.a
                  href={l.href}
                  onClick={(e) => onNavClick(e, l.href)}
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '100%', transition: { duration: 0.2 } }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.25 + i * 0.06 }}
                  className="group flex items-baseline gap-4 py-2 text-[clamp(1.625rem,6.5vw,2.75rem)] font-extrabold uppercase leading-none tracking-tight"
                >
                  <span className="text-sm font-semibold tabular-nums text-white/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="transition-colors duration-200 group-hover:text-accent">{l.label}</span>
                </motion.a>
              </li>
            ))}
          </ul>
        </nav>

        {/* низ: CTA, дедлайн, почта */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.55 }}
          className="mt-auto space-y-5 border-t border-white/15 pt-6"
        >
          <a 
            href="#application-form"
            onClick={(e) => onNavClick(e, '#application-form')}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-accent px-7 py-4 font-bold"
          >
            Подать заявку
            <img src="/assets/general/arrow.svg" alt="" className="h-4 w-4 brightness-0 invert" />
          </a>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Подача заявок — до {timeline.applicationDeadline}
            </span>
            <a href={`mailto:${texts.footer.email}`} className="transition-colors hover:text-white">
              {texts.footer.email}
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}