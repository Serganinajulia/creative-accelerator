import { useEffect } from 'react'
import Lenis from 'lenis'

let lenisInstance: Lenis | null = null
export const getLenis = () => lenisInstance

/**
 * Плавная инерционная прокрутка по всей странице.
 * Подключается один раз в App.tsx.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisInstance = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      lenisInstance = null
    }
  }, [])
}
