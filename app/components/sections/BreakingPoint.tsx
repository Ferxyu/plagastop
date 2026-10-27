import type { BreakPhase } from './useBreakingPoint'
import styles from './BreakingPoint.module.css'

/** Gráfica del «punto de quiebre» (ver useBreakingPoint.ts). */

/* ---------- Geometría determinista (igual en el prerender y en el navegador) ---------- */

function seeded(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = seeded(1000)

/** Gráfica: sube en zigzag hasta el máximo y luego se desploma. Lienzo 1000 × 500. */
const RISE = (() => {
  const pts: [number, number][] = []
  for (let x = 0; x <= 760; x += 38) {
    const base = 450 - (x / 760) * 360
    pts.push([x, x === 0 ? 450 : x === 760 ? 90 : base + (rand() - 0.5) * 70])
  }
  return pts
})()
const PEAK = RISE[RISE.length - 1]
const CRASH: [number, number][] = [
  PEAK,
  [800, 150],
  [826, 128],
  [866, 300],
  [892, 276],
  [940, 470],
  [1000, 492],
]
const toPath = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y.toFixed(1)}`).join(' ')
const RISE_PATH = toPath(RISE)
const AREA_PATH = `${RISE_PATH} L760 500 L0 500 Z`
const CRASH_PATH = toPath(CRASH)

/** Gráfica del quiebre; se monta dentro de la cifra (position: relative). */
export function BreakingFx({ phase }: { phase: BreakPhase }) {
  return (
    <span className={styles.fx} data-phase={phase} aria-hidden>
      {/* Gráfica (detrás del texto) */}
      <svg className={styles.chart} viewBox="0 0 1000 500" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bp-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cce70b" stopOpacity="0.28" />
            <stop offset="1" stopColor="#cce70b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className={styles.area} d={AREA_PATH} fill="url(#bp-area)" />
        <path className={styles.rise} d={RISE_PATH} pathLength={1} />
        <path className={styles.trail} d={CRASH_PATH} pathLength={1} />
        <path className={styles.crash} d={CRASH_PATH} pathLength={1} />
      </svg>
    </span>
  )
}
