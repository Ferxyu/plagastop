import type { Route } from './+types/industrias._index'
import { breadcrumbLd, buildMeta } from '~/lib/seo'
import { PageHero } from '~/components/sections/PageHero'
import { IndustryMosaic } from '~/components/sections/IndustryMosaic'
import { ClosingCta } from '~/components/sections/ClosingCta'

const crumbs = [
  { name: 'Inicio', path: '/' },
  { name: 'Industrias', path: '/industrias' },
]

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Control de plagas por industria',
    description:
      'Control de plagas para industria alimentaria, bodegas y centros logísticos, restaurantes, puertos, agroindustria, forestal, plantas industriales y comercio.',
    path: '/industrias',
    jsonLd: [breadcrumbLd(crumbs)],
  })

export default function Industries() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        image="patio-contenedores"
        title="Control de plagas para cada industria"
        lead="Cada tipo de instalación tiene sus propios riesgos. Elige tu rubro y revisa cómo trabajamos en él."
      />
      <section className="section">
        <div className="container">
          <IndustryMosaic />
        </div>
      </section>
      <ClosingCta />
    </>
  )
}
