import { Link } from 'react-router'
import type { Route } from './+types/cookies'
import { company, salesArea } from '~/content/company'
import { cookies, privacy, versionLabel } from '~/content/legal'
import { buildMeta } from '~/lib/seo'
import { PageHero } from '~/components/sections/PageHero'
import styles from './page.module.css'

// [Pendiente: revisión legal antes de publicar]
// Refleja el sitio actual: sin cookies propias ni de terceros. Si se activa GTM (VITE_GTM_ID) u otra herramienta de
// medición, primero hay que agregar un aviso de consentimiento de cookies y actualizar esta política.

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: cookies.title,
    description: 'Qué cookies y almacenamiento usa el sitio web de Plagastop.',
    path: cookies.path,
  })

export default function Cookies() {
  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Inicio', path: '/' },
          { name: 'Cookies', path: cookies.path },
        ]}
        title={cookies.title}
      />
      <section className="section">
        <div className={`container ${styles.prose}`}>
          <p>
            <em>Última actualización: {versionLabel(cookies)}.</em>
          </p>

          <h2>Qué son las cookies</h2>
          <p>
            Son pequeños archivos que un sitio guarda en tu navegador para recordar información entre visitas, por
            ejemplo para medir el tráfico o mostrar publicidad.
          </p>

          <h2>Cookies de este sitio</h2>
          <p>
            Actualmente el sitio de {company.name} <strong>no usa cookies</strong>, ni propias ni de terceros, y no
            incorpora herramientas de analítica ni de publicidad que las instalen. Por eso no te pedimos que las
            aceptes.
          </p>

          <h2>Almacenamiento técnico de la sesión</h2>
          <p>
            El sitio guarda dos datos técnicos en el almacenamiento de sesión de tu navegador, que se borran solos al
            cerrar la pestaña y no te identifican:
          </p>
          <ul>
            <li>Si silenciaste el sonido del video de portada.</li>
            <li>La campaña desde la que llegaste (parámetros de la dirección como utm_source), cuando existe.</li>
          </ul>

          <h2>Servicios de terceros</h2>
          <p>
            Si abres un enlace a WhatsApp, Google Maps o nuestras redes sociales, ese servicio puede usar sus propias
            cookies según sus políticas. Las imágenes del blog se cargan desde un servidor de {company.name}, sin
            cookies.
          </p>

          <h2>Cambios</h2>
          <p>
            Si en el futuro incorporamos herramientas de medición que usen cookies, te pediremos tu consentimiento
            antes de activarlas y actualizaremos esta política. Consultas:{' '}
            <a href={`mailto:${salesArea.email}`}>{salesArea.email}</a>. Ver también la{' '}
            <Link to={privacy.path}>{privacy.title}</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
