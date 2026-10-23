import { useRef, type CSSProperties } from 'react'
import { useInView } from '~/components/motion/useInView'
import { ISO_ATOMS, ISO_BOND, ISO_LIME, ISO_NODE, ISO_VIEWBOX } from './isotype'
import styles from './IsotypeAssembly.module.css'

/** Desde dónde llega cada molécula (unidades del lienzo del isotipo). */
const FROM: Record<(typeof ISO_ATOMS)[number]['id'], [number, number]> = {
  top: [-420, -260],
  left: [-560, 260],
  right: [560, 120],
}

/**
 * Las tres moléculas del logo se reúnen y forman el isotipo de Plagastop: llegan desde fuera,
 * se ubican y después se dibujan los enlaces hacia el nodo. Se repite al volver a la sección.
 * Decorativo (aria-hidden). Con movimiento reducido se muestra armado.
 */
export function IsotypeAssembly({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const assembled = useInView(ref, { threshold: 0.6 })

  return (
    <svg
      ref={ref}
      className={`${styles.iso} ${className ?? ''}`}
      viewBox={ISO_VIEWBOX}
      data-on={assembled || undefined}
      aria-hidden
      focusable="false"
    >
      <g className={styles.bonds} stroke={ISO_LIME} strokeWidth={ISO_BOND} strokeLinecap="butt">
        {ISO_ATOMS.map((a, i) => (
          <line
            key={a.id}
            x1={ISO_NODE.x}
            y1={ISO_NODE.y}
            x2={a.cx}
            y2={a.cy}
            pathLength={1}
            style={{ '--i': i } as CSSProperties}
          />
        ))}
      </g>
      {ISO_ATOMS.map((a, i) => (
        <circle
          key={a.id}
          className={styles.atom}
          cx={a.cx}
          cy={a.cy}
          r={a.r}
          fill={ISO_LIME}
          style={{ '--dx': `${FROM[a.id][0]}px`, '--dy': `${FROM[a.id][1]}px`, '--i': i } as CSSProperties}
        />
      ))}
    </svg>
  )
}
