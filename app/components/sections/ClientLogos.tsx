import type { CSSProperties } from 'react'
import { clients } from '~/content/clients'
import styles from './ClientLogos.module.css'

type Client = (typeof clients)[number]

function Row({ items, reverse, duration }: { items: Client[]; reverse?: boolean; duration: number }) {
  // Dos copias para un bucle continuo; la segunda se oculta a lectores de pantalla
  const loop = [...items, ...items]
  return (
    <div className={styles.row}>
      <ul
        className={styles.track}
        data-reverse={reverse || undefined}
        style={{ '--duration': `${duration}s` } as CSSProperties}
      >
        {loop.map((c, i) => (
          <li
            key={i}
            className={styles.tile}
            data-dark={c.dark || undefined}
            aria-hidden={i >= items.length || undefined}
          >
            <img src={c.src} alt={i < items.length ? c.name : ''} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Carrusel infinito de logos de clientes en dos filas que avanzan en sentidos opuestos. Pausa al pasar el mouse. */
export function ClientLogos() {
  const half = Math.ceil(clients.length / 2)
  return (
    <div className={styles.wrap}>
      <Row items={clients.slice(0, half)} duration={70} />
      <Row items={clients.slice(half)} duration={78} reverse />
    </div>
  )
}
