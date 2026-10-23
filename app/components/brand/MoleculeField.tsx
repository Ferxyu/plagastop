import { useRef, type CSSProperties } from 'react'
import { useInView } from '~/components/motion/useInView'
import { ISO_ATOMS, ISO_BOND, ISO_LIME, ISO_NODE, ISO_VIEWBOX } from './isotype'
import styles from './MoleculeField.module.css'

/**
 * Fondo de partículas para secciones azules: isotipos pequeños y moléculas sueltas del logo que derivan
 * lento a distinta opacidad. Posiciones fijas (sin azar) para que el HTML prerenderizado y el navegador
 * coincidan. Las animaciones se pausan fuera de pantalla. Decorativo.
 */

type Kind = 'iso' | 'atom'
type Particle = { kind: Kind; x: number; y: number; size: number; o: number; dur: number; rot: number }

const LAYOUTS: Record<'scatter' | 'edges', Particle[]> = {
  // Repartidas por toda la sección (sede)
  scatter: [
    { kind: 'iso', x: 6, y: 14, size: 38, o: 0.22, dur: 26, rot: 18 },
    { kind: 'atom', x: 18, y: 72, size: 12, o: 0.35, dur: 19, rot: 0 },
    { kind: 'atom', x: 31, y: 32, size: 8, o: 0.3, dur: 23, rot: 0 },
    { kind: 'iso', x: 42, y: 86, size: 26, o: 0.18, dur: 30, rot: -24 },
    { kind: 'atom', x: 54, y: 10, size: 10, o: 0.3, dur: 21, rot: 0 },
    { kind: 'iso', x: 63, y: 48, size: 22, o: 0.14, dur: 28, rot: 40 },
    { kind: 'atom', x: 74, y: 78, size: 14, o: 0.32, dur: 17, rot: 0 },
    { kind: 'iso', x: 86, y: 22, size: 44, o: 0.2, dur: 32, rot: -12 },
    { kind: 'atom', x: 93, y: 60, size: 9, o: 0.28, dur: 24, rot: 0 },
  ],
  // Solo en los bordes laterales, repartidas parejo de arriba abajo (banda de multas)
  edges: [
    { kind: 'iso', x: 3, y: 8, size: 40, o: 0.22, dur: 26, rot: 18 },
    { kind: 'atom', x: 8, y: 30, size: 12, o: 0.34, dur: 19, rot: 0 },
    { kind: 'iso', x: 2.5, y: 52, size: 30, o: 0.18, dur: 30, rot: -24 },
    { kind: 'atom', x: 7, y: 73, size: 9, o: 0.3, dur: 23, rot: 0 },
    { kind: 'iso', x: 3.5, y: 90, size: 34, o: 0.2, dur: 28, rot: 32 },
    { kind: 'atom', x: 92, y: 10, size: 10, o: 0.3, dur: 21, rot: 0 },
    { kind: 'iso', x: 94, y: 30, size: 44, o: 0.2, dur: 32, rot: -12 },
    { kind: 'atom', x: 91, y: 52, size: 13, o: 0.34, dur: 17, rot: 0 },
    { kind: 'iso', x: 95, y: 72, size: 28, o: 0.18, dur: 27, rot: 40 },
    { kind: 'atom', x: 92.5, y: 91, size: 9, o: 0.28, dur: 24, rot: 0 },
  ],
}

function MiniIsotype() {
  return (
    <svg viewBox={ISO_VIEWBOX} className={styles.svg}>
      <g stroke={ISO_LIME} strokeWidth={ISO_BOND}>
        {ISO_ATOMS.map((a) => (
          <line key={a.id} x1={ISO_NODE.x} y1={ISO_NODE.y} x2={a.cx} y2={a.cy} />
        ))}
      </g>
      {ISO_ATOMS.map((a) => (
        <circle key={a.id} cx={a.cx} cy={a.cy} r={a.r} fill={ISO_LIME} />
      ))}
    </svg>
  )
}

export function MoleculeField({ layout = 'scatter', className }: { layout?: keyof typeof LAYOUTS; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const active = useInView(ref, { threshold: 0 })

  return (
    <div
      ref={ref}
      className={`${styles.field} ${className ?? ''}`}
      data-layout={layout}
      data-active={active || undefined}
      aria-hidden
    >
      {LAYOUTS[layout].map((p, i) => (
        <span
          key={i}
          className={p.kind === 'iso' ? styles.iso : styles.atom}
          style={
            {
              '--x': `${p.x}%`,
              '--y': `${p.y}%`,
              '--size': `${p.size}px`,
              '--o': p.o,
              '--dur': `${p.dur}s`,
              '--rot': `${p.rot}deg`,
              '--delay': `${i * -3.7}s`,
            } as CSSProperties
          }
        >
          {p.kind === 'iso' && <MiniIsotype />}
        </span>
      ))}
    </div>
  )
}
