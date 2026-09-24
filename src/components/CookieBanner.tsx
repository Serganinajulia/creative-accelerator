import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import texts from '../data/texts.json'

const STORAGE_KEY = 'cookie-consent'
const EASE = [0.22, 1, 0.36, 1] as const

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let accepted = false
    try {
      accepted = localStorage.getItem(STORAGE_KEY) === 'accepted'
    } catch {
      // браузер запретил хранилище (приватный режим) — просто покажем плашку
    }
    if (accepted) return
    // небольшая задержка, чтобы плашка не спорила с появлением первого экрана
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {
      // не получилось сохранить — плашка появится снова при следующем заходе
    }
    setVisible(false)
  }

  const c = texts.cookie

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Уведомление об использовании cookie"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="fixed inset-x-3 bottom-3 z-40 flex flex-col gap-4 rounded-2xl bg-white p-5 text-dark shadow-2xl shadow-dark/20 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md sm:flex-row sm:items-end"
        >
          <p className="text-sm leading-relaxed text-dark/75">
            {c.text}{' '}
            <a href="/privacy" className="text-primary underline underline-offset-2 hover:text-accent">
              {c.linkLabel}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={accept}
            className="shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {c.button}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}