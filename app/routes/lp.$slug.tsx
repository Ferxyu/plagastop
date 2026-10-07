import { data } from 'react-router'
import type { Route } from './+types/lp.$slug'
import { getLanding } from '~/content/landings'
import { buildMeta } from '~/lib/seo'
import { QuoteForm } from '~/components/forms/QuoteForm'
import { ContactDirectory } from '~/components/sections/ContactDirectory'
import type { RouteHandle } from '~/root'
import styles from './page.module.css'

export const handle: RouteHandle = { chrome: 'landing' }

export function loader({ params }: Route.LoaderArgs) {
  const landing = getLanding(params.slug)
  if (!landing) throw data(null, { status: 404 })
  return { slug: landing.slug }
}

export const meta: Route.MetaFunction = ({ params }) => {
  const landing = getLanding(params.slug)
  return buildMeta({
    title: landing?.headline ?? 'Plagastop',
    description: landing?.lead ?? '',
    path: `/lp/${params.slug}`,
    noindex: true,
  })
}

export default function Landing({ loaderData }: Route.ComponentProps) {
  const landing = getLanding(loaderData.slug)!
  return (
    <>
      <section className="section" style={{ paddingTop: 'var(--s-7)' }}>
        <div className={`container ${styles.quoteLayout}`}>
          <div style={{ display: 'grid', gap: 'var(--s-6)', alignContent: 'start' }}>
            <h1>{landing.headline}</h1>
            <p className="lead">{landing.lead}</p>
            <ul className={styles.reasons}>
              {landing.reasons.map((r, i) => (
                <li key={r.title}>
                  <span className="tabular" aria-hidden>
                    {i + 1}
                  </span>
                  <div>
                    <h2 style={{ fontSize: 'var(--text-h3)' }}>{r.title}</h2>
                    <p>{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <ul className={styles.facts} style={{ color: 'var(--ps-steel)' }}>
              <li>Desde 1985 en Concepción</li>
              <li>Autorizados por el SAG (Res. 2732/2021)</li>
              <li>Desde Ñuble hasta Los Lagos</li>
            </ul>
          </div>
          <div className={styles.formPanel} id="cotizar">
            <h2>Solicita tu cotización</h2>
            <QuoteForm />
          </div>
        </div>
      </section>
      <section className="section section--paper">
        <div className={`container ${styles.split}`}>
          <h2>Contacto directo</h2>
          <ContactDirectory />
        </div>
      </section>
    </>
  )
}
