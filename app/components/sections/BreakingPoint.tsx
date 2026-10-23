import type { CSSProperties } from 'react'
import type { BreakPhase } from './useBreakingPoint'
import styles from './BreakingPoint.module.css'

/** Capas visuales del «punto de quiebre» (ver useBreakingPoint.ts). */

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
const CX = 500
const CY = 250

/** Grietas: líneas quebradas que nacen del centro de la cifra y llegan a los bordes, con ramas. */
const CRACKS = Array.from({ length: 11 }, (_, i) => {
  const angle = (i / 11) * Math.PI * 2 + (rand() - 0.5) * 0.4
  const points: [number, number][] = [[CX + Math.cos(angle) * 18, CY + Math.sin(angle) * 18]]
  let a = angle
  let dist = 18
  while (dist < 620) {
    dist += 45 + rand() * 60
    a += (rand() - 0.5) * 0.5
    points.push([CX + Math.cos(a) * dist, CY + Math.sin(a) * dist * 0.62])
  }
  const branchAt = points[2 + Math.floor(rand() * 2)]
  const ba = a + (rand() > 0.5 ? 0.7 : -0.7)
  const branch: [number, number][] = [
    branchAt,
    [branchAt[0] + Math.cos(ba) * 70, branchAt[1] + Math.sin(ba) * 44],
    [branchAt[0] + Math.cos(ba + 0.3) * 130, branchAt[1] + Math.sin(ba + 0.3) * 80],
  ]
  const d = (pts: [number, number][]) => pts.map(([x, y], j) => `${j ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return { main: d(points), branch: d(branch), delay: Math.round(rand() * 120) }
})

/** Fragmentos: astillas que salen despedidas hacia la cámara. */
const SHARDS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 + rand() * 0.5
  const dist = 160 + rand() * 260
  const pts = Array.from({ length: 3 }, () => `${Math.round(rand() * 100)}% ${Math.round(rand() * 100)}%`).join(', ')
  return {
    dx: Math.cos(a) * dist,
    dy: Math.sin(a) * dist * 0.7,
    rot: (rand() - 0.5) * 220,
    size: 26 + rand() * 60,
    clip: `polygon(${pts})`,
    delay: Math.round(rand() * 80),
  }
})

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

/** Capas visuales del quiebre; se montan dentro de la cifra (position: relative). */
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

      {/* Onda expansiva y destello */}
      <span className={styles.flash} />
      <span className={styles.wave} />

      {/* Grietas (delante del texto) */}
      <svg className={styles.cracks} viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
        {CRACKS.map((c, i) => (
          <g key={i} style={{ '--d': `${c.delay}ms` } as CSSProperties}>
            <path d={c.main} pathLength={1} />
            <path d={c.branch} pathLength={1} className={styles.branch} />
          </g>
        ))}
      </svg>

      {/* Fragmentos */}
      {SHARDS.map((s, i) => (
        <span
          key={i}
          className={styles.shard}
          style={
            {
              '--dx': `${s.dx.toFixed(0)}px`,
              '--dy': `${s.dy.toFixed(0)}px`,
              '--rot': `${s.rot.toFixed(0)}deg`,
              '--size': `${s.size.toFixed(0)}px`,
              '--clip': s.clip,
              '--d': `${s.delay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  )
}
