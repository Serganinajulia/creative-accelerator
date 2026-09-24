import { useEffect, useState } from 'react'

const links = [
  { href: '#for-whom', label: 'Для кого' },
  { href: '#what-you-get', label: 'Что получите' },
  { href: '#program', label: 'Программа' },
  { href: '#speakers', label: 'Эксперты' },
  { href: '#faq', label: 'FAQ' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <a href="#top">
          <img src="/assets/general/logo.svg" alt="Креативная среда" className="h-8 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-6 font-medium">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-accent transition-colors">
              {'{'} {l.label} {'}'}
            </a>
          ))}
        </nav>

        <a
          href="#application-form"
          className="rounded-full bg-accent text-white px-5 py-2 font-semibold hover:opacity-90 transition-opacity"
        >
          Подать заявку
        </a>
      </div>
    </header>
  )
}