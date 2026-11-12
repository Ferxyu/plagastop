import { Link } from 'react-router'
import type { Route } from './+types/terminos'
import { company, salesArea, SITE_URL } from '~/content/company'
import { cookies, privacy, terms, versionLabel } from '~/content/legal'
import { buildMeta } from '~/lib/seo'
import { PageHero } from '~/components/sections/PageHero'
import styles from './page.module.css'

// [Pendiente: revisión legal antes de publicar]

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: terms.title,
    description: 'Condiciones de uso del sitio web de Plagastop y de sus formularios de cotización y contacto.',
    path: terms.path,
  })

export default function Terms() {
  const domain = SITE_URL.replace(/^https?:\/\//, '')
  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Inicio', path: '/' },
          { name: 'Términos y condiciones', path: terms.path },
        ]}
        title={terms.title}
      />
      <section className="section">
        <div className={`container ${styles.prose}`}>
          <p>
            <em>Última actualización: {versionLabel(terms)}.</em>
          </p>
          <p>
            Estos términos regulan el uso del sitio web {domain} y de sus formularios de cotización y contacto. Al
            usar los formularios aceptas estos términos.
          </p>

          <h2>1. Quiénes somos</h2>
          <p>
            El sitio pertenece a {company.legalName}, con domicilio en {company.address.street},{' '}
            {company.address.area}, {company.address.city}, {company.address.region}. Contacto:{' '}
            <a href={`mailto:${salesArea.email}`}>{salesArea.email}</a>.
          </p>

          <h2>2. Uso del sitio</h2>
          <p>
            El sitio entrega información sobre los servicios de {company.name} y permite solicitar cotizaciones y
            hacer consultas. Te comprometes a usarlo de buena fe y a no realizar acciones que dañen su funcionamiento.
          </p>

          <h2>3. Solicitudes de cotización y contacto</h2>
          <ul>
            <li>Los datos que ingresas deben ser verdaderos y te pertenecen o estás autorizado para entregarlos.</li>
            <li>
              Enviar una solicitud no constituye un contrato ni una reserva de servicio. Cada servicio se acuerda en
              una propuesta comercial, con sus propias condiciones, alcance y precio.
            </li>
            <li>
              Los formularios pueden abrir una aplicación de mensajería (WhatsApp) con tus datos preparados. La
              solicitud solo nos llega si la envías desde esa aplicación.
            </li>
          </ul>

          <h2>4. Contenido del sitio</h2>
          <p>
            La información del sitio es de carácter general y referencial; puede actualizarse sin aviso previo y no
            reemplaza la evaluación técnica en terreno.
          </p>

          <h2>5. Propiedad intelectual</h2>
          <p>
            La marca, el logotipo, los textos, las fotografías y los videos del sitio pertenecen a {company.legalName}{' '}
            o se usan con autorización. No pueden reproducirse ni usarse con fines comerciales sin autorización previa
            y por escrito.
          </p>

          <h2>6. Enlaces a otros sitios</h2>
          <p>
            El sitio incluye enlaces a sitios y servicios de terceros (por ejemplo, organismos públicos, redes sociales,
            mapas o WhatsApp). {company.name} no es responsable de su contenido ni de sus políticas.
          </p>

          <h2>7. Disponibilidad</h2>
          <p>
            Procuramos que el sitio funcione de forma continua, pero puede haber interrupciones por mantención o causas
            ajenas. Si un formulario no funciona, puedes contactarnos por teléfono o correo.
          </p>

          <h2>8. Datos personales y cookies</h2>
          <p>
            El tratamiento de tus datos se rige por la <Link to={privacy.path}>{privacy.title}</Link> y el uso de
            cookies, por la <Link to={cookies.path}>{cookies.title}</Link>.
          </p>

          <h2>9. Cambios</h2>
          <p>
            Podemos actualizar estos términos. La versión vigente es la publicada en esta página, con su fecha de
            actualización; cada solicitud registra la versión que aceptaste.
          </p>

          <h2>10. Legislación aplicable</h2>
          <p>Estos términos se rigen por las leyes de la República de Chile.</p>
        </div>
      </section>
    </>
  )
}
