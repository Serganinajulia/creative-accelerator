import { getLenis } from '../components/useSmoothScroll'

const HEADER_OFFSET = 80 // высота фиксированной шапки

// мягкий разгон и мягкое торможение
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function smoothScrollTo(href: string) {
  const el = href === '#top' ? null : document.querySelector<HTMLElement>(href)
  if (href !== '#top' && !el) return

  const to = el ? el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET : 0
  const distance = Math.abs(to - window.scrollY)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // близко — быстро, далеко — дольше, но не больше 1.4 с
  const duration = Math.min(1.4, Math.max(0.6, distance / 2500))

  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(to, { duration, easing: easeInOutCubic, immediate: reduce })
  } else {
    window.scrollTo({ top: to, behavior: reduce ? 'auto' : 'smooth' })
  }

  history.replaceState(null, '', href)
}

/** Перехватывает клики по всем ссылкам вида href="#..." на странице */
export function initAnchorScroll() {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented) return
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
    if (!link) return
    const href = link.getAttribute('href')
    if (!href || href === '#') return
    e.preventDefault()
    smoothScrollTo(href)
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}