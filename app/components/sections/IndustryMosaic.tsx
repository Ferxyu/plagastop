import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { industries } from '~/content/industries'
import { Photo } from '~/components/ui/Photo'
import styles from './IndustryMosaic.module.css'

/** Mosaico fotográfico de industrias: cada tile lleva a su página. */
export function IndustryMosaic({ exclude }: { exclude?: string }) {
  const list = industries.filter((i) => i.slug !== exclude)
  const feature = list.length === 8
  return (
    <ul className={`${styles.mosaic} ${feature ? styles.feature : ''}`}>
      {list.map((industry, i) => (
        <li key={industry.slug} className={styles.tile} data-reveal={i % 4}>
          <Photo id={industry.photo} sizes="(min-width: 1100px) 25vw, 50vw" />
          <Link to={`/industrias/${industry.slug}`} className={styles.link} prefetch="intent">
            <span className={styles.name}>{industry.name}</span>
            <span className={styles.go} aria-hidden>
              <ArrowUpRight size={20} strokeWidth={2} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
