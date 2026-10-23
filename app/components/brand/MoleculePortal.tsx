import type { CSSProperties } from 'react'
import { ISO_ATOMS, ISO_BOND, ISO_LIME, ISO_NODE, ISO_VIEWBOX } from './isotype'
import styles from './MoleculePortal.module.css'

/** Desde dónde llega cada molécula (unidades del lienzo del isotipo). */
const FROM: Record<(typeof ISO_ATOMS)[number]['id'], [number, number]> = {
  top: [-300, -220],
  left: [-420, 200],
  right: [420, 140],
}

/**
 * Portal entre la banda de multas y los servicios (se usa una sola vez): al bajar, las tres moléculas
 * se reúnen en el isotipo, nace un pulso lima y la cámara atraviesa la molécula superior, que crece
 * hasta llenar la pantalla y se abre sobre la sección siguiente. Todo va ligado al scroll con CSS
 * (animation-timeline), sin JavaScript. Decorativo: sin soporte o con movimiento reducido no ocupa espacio.
 */
export function MoleculePortal() {
  return (
    <div className={styles.portal} aria-hidden>
      <div className={styles.stage}>
        <span className={styles.ring} />
        <svg className={styles.iso} viewBox={ISO_VIEWBOX} focusable="false">
          <g stroke={ISO_LIME} strokeWidth={ISO_BOND}>
            {ISO_ATOMS.map((a) => (
              <line key={a.id} className={styles.bond} x1={ISO_NODE.x} y1={ISO_NODE.y} x2={a.cx} y2={a.cy} pathLength={1} />
            ))}
          </g>
          {ISO_ATOMS.map((a) => (
            <circle
              key={a.id}
              className={styles.atom}
              cx={a.cx}
              cy={a.cy}
              r={a.r}
              fill={ISO_LIME}
              style={{ '--dx': `${FROM[a.id][0]}px`, '--dy': `${FROM[a.id][1]}px` } as CSSProperties}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
