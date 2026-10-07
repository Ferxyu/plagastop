import type { Route } from './+types/blog._index'
import { blog } from '~/lib/cms'
import { buildMeta } from '~/lib/seo'
import { ButtonLink } from '~/components/ui/Button'
import { PageHero } from '~/components/sections/PageHero'
import styles from './page.module.css'

export async function loader() {
  return { posts: await blog.getPosts({ limit: 12 }) }
}

export const meta: Route.MetaFunction = ({ loaderData }) =>
  buildMeta({
    title: 'Recursos sobre control de plagas',
    description: 'Guías y artículos sobre prevención y control de plagas para empresas e industrias.',
    path: '/blog',
    // Sin artículos no se indexa.
    noindex: !loaderData?.posts.length,
  })

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData
  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Inicio', path: '/' },
          { name: 'Recursos', path: '/blog' },
        ]}
        title="Recursos"
      />
      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <div className={styles.empty}>
              <h2>Pronto publicaremos guías y artículos</h2>
              <p className="lead">
                Mientras tanto, revisa nuestros servicios o consulta directamente con un especialista.
              </p>
              <ButtonLink to="/servicios" variant="secondary" arrow>
                Ver servicios
              </ButtonLink>
            </div>
          ) : (
            <ul>
              {posts.map((p) => (
                <li key={p.slug}>{p.title}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
