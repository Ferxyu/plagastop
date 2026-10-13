import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { industries } from '~/content/industries'
import styles from './IndustryHoverList.module.css'

/** Lista de industrias: nombre, tipo de instalación y enlace a su página. */
export function IndustryHoverList() {
  return (
    <ul className={styles.list}>
      {industries.map((industry, i) => (
        <li key={industry.slug} data-reveal={i % 4}>
          <Link to={`/industrias/${industry.slug}`} className={styles.row} prefetch="intent">
            <span className={`${styles.index} tabular`}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.name}>{industry.name}</span>
            <span className={styles.facility}>{industry.facility}</span>
            <span className={styles.go} aria-hidden>
              <ArrowUpRight size={18} strokeWidth={2} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
