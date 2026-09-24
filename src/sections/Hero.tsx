import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useRef, type PointerEvent } from 'react'
import texts from '../data/texts.json'
import timeline from '../data/timelineProgram.json'

const EASE = [0.22, 1, 0.36, 1] as const
// большая орбита через весь экран; центр совпадает со стрелой (1166, 590 в координатах 1440×900)
const ORBIT_PATH = 'M546,590 a620,190 0 1,0 1240,0 a620,190 0 1,0 -1240,0'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const h = texts.hero

  /* скролл: графика отстаёт от текста */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const graphicY = useTransform(scrollYProgress, [0, 1], [0, 180])

  /* мышь: стрела поворачивается к курсору */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 18 })
  const sy = useSpring(my, { stiffness: 50, damping: 18 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14])
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10])
  const shiftX = useTransform(sx, [-0.5, 0.5], [-24, 24])

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-primary text-white"
    >
      {/* большая орбита через весь экран */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g transform="rotate(-16 1166 590)">
          <ellipse cx="1166" cy="590" rx="620" ry="190" fill="none" stroke="white" strokeOpacity="0.12" />
          <circle r="7" fill="#E52C2B">
            <animateMotion dur="22s" repeatCount="indefinite" path={ORBIT_PATH} />
          </circle>
          <circle r="4" fill="white" fillOpacity="0.8">
            <animateMotion dur="22s" begin="-11s" repeatCount="indefinite" path={ORBIT_PATH} />
          </circle>
        </g>
      </svg>
      {/* приглушаем стрелу под текстом: чем уже экран, тем сильнее */}
      {/* приглушаем стрелу под текстом: чем уже экран, тем сильнее */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-tl from-transparent via-primary/80 to-primary sm:via-primary/70 md:via-primary/60 lg:hidden"
      />
      {/* контейнер — только текст */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-28 md:pt-32">
        <div className="lg:max-w-[50%]">
          <h1 className="font-extrabold uppercase tracking-tight">
            {h.titleLines.map((text) => (
              <span key={text} className="block text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[0.95]">
                {text}
              </span>
            ))}
            <span className="mt-4 block text-[clamp(1.125rem,2.2vw,1.875rem)] font-semibold tracking-[0.25em] text-white/55">
              {h.titleSub}
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-white/85">{h.subtitle}</p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a 
              href="#application-form"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 font-bold text-white transition hover:scale-[1.03]"
            >
              {h.cta}
              <img
                src="/assets/general/arrow.svg"
                alt=""
                className="h-4 w-4 brightness-0 invert transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-4 py-2.5 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {h.deadlinePrefix} {timeline.applicationDeadline}
            </span>
          </div>
        </div>
      </div>

      {/* 3D-графика: уходит за правый нижний край экрана */}
      <motion.div
        style={{ y: graphicY }}
        className="pointer-events-none absolute max-w-none [--hero-w:calc(74vw_+_200px)] lg:[--hero-w:max(820px,64vw)] w-[var(--hero-w)] right-[calc(var(--hero-w)*-0.2)] bottom-[calc(var(--hero-w)*-0.15)]">        <motion.div
          aria-hidden
          className="absolute inset-[15%] rounded-full bg-[radial-gradient(circle,#E52C2B_0%,transparent_70%)] opacity-40 blur-3xl"
          animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-[25%] -translate-x-1/4 rounded-full bg-[radial-gradient(circle,#7F9CE3_0%,transparent_70%)] opacity-40 blur-3xl"
          animate={reduce ? undefined : { scale: [1.1, 0.95, 1.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* поворот к курсору */}
        <motion.div style={{ rotateX, rotateY, x: shiftX, transformPerspective: 1000 }} className="relative">
          {/* появление + парение и покачивание (картинка и шарики вместе) */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={
              reduce
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: 1, y: [0, -16, 0], rotate: [0, 2.5, 0] }
            }
            transition={{
              opacity: { duration: 1.2, ease: EASE, delay: 0.3 },
              scale: { duration: 1.2, ease: EASE, delay: 0.3 },
              y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="relative"
          >
            <img
              src="/assets/general/general.png"
              alt=""
              draggable={false}
              className="relative w-full select-none"
            />
            {!reduce && <RollingSpheres />}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ---------- Шарики, катающиеся по орбитам вокруг стрелы ---------- */
/* координаты в процентах от картинки (viewBox 0–100) */

const ORBITS = [
  // почти круглая орбита
  { d: 'M5,50 a45,45 0 1,0 90,0 a45,45 0 1,0 -90,0', rotate: 0 },
  // наклонённая эллиптическая
  { d: 'M2,50 a48,38 0 1,0 96,0 a48,38 0 1,0 -96,0', rotate: -28 },
]

const SPHERES = [
  { orbit: 0, r: 2.2, fill: 'url(#sphere-red)', dur: 18, begin: 0 },
  { orbit: 0, r: 1.4, fill: 'url(#sphere-white)', dur: 18, begin: -9 },
  { orbit: 1, r: 1.8, fill: 'url(#sphere-blue)', dur: 26, begin: -4 },
  { orbit: 1, r: 1.3, fill: 'url(#sphere-white)', dur: 26, begin: -17 },
  { orbit: 1, r: 2, fill: 'url(#sphere-red)', dur: 26, begin: -11 },
]

function RollingSpheres() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    >
      <defs>
        {/* объём: блик сверху-слева, тень к краю */}
        <radialGradient id="sphere-red" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFB3B3" />
          <stop offset="45%" stopColor="#E52C2B" />
          <stop offset="100%" stopColor="#7A0F0F" />
        </radialGradient>
        <radialGradient id="sphere-blue" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#B9C8FF" />
          <stop offset="45%" stopColor="#2A55D8" />
          <stop offset="100%" stopColor="#0E1F5C" />
        </radialGradient>
        <radialGradient id="sphere-white" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#DCE3F2" />
          <stop offset="100%" stopColor="#8E9BB8" />
        </radialGradient>
      </defs>

      {ORBITS.map((o, i) => (
        <g key={i} transform={`rotate(${o.rotate} 50 50)`}>
          {SPHERES.filter((s) => s.orbit === i).map((s, k) => (
            <circle key={k} r={s.r} fill={s.fill}>
              <animateMotion
                dur={`${s.dur}s`}
                begin={`${s.begin}s`}
                repeatCount="indefinite"
                path={o.d}
              />
            </circle>
          ))}
        </g>
      ))}
    </svg>
  )
}