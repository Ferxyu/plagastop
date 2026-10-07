import type { ReactNode } from 'react'
import styles from './SectionHeader.module.css'

export function SectionHeader({
  title,
  lead,
  action,
  id,
  align = 'center',
}: {
  title: ReactNode
  lead?: ReactNode
  action?: ReactNode
  id?: string
  align?: 'center' | 'start' | 'split'
}) {
  return (
    <header className={`${styles.header} ${styles[align]}`} data-reveal>
      <h2 id={id}>{title}</h2>
      {(lead || action) && (
        <div className={styles.side}>
          {lead && <p className="lead">{lead}</p>}
          {action}
        </div>
      )}
    </header>
  )
}
