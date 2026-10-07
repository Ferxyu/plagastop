import { Link } from 'react-router'
import styles from './Breadcrumbs.module.css'

export interface Crumb {
  name: string
  path: string
}

/** El schema BreadcrumbList se emite desde el meta de cada ruta (breadcrumbLd). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación" className={styles.nav}>
      <ol>
        {items.map((item, i) => (
          <li key={item.path}>
            {i < items.length - 1 ? (
              <Link to={item.path}>{item.name}</Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
