import { Link } from 'react-router'
import type { Route } from './+types/privacidad'
import { company, salesArea } from '~/content/company'
import { cookies, privacy, terms, versionLabel } from '~/content/legal'
import { FORM_METHOD } from '~/lib/forms'
import { buildMeta } from '~/lib/seo'
import { PageHero } from '~/components/sections/PageHero'
import styles from './page.module.css'

// [Pendiente: revisión legal antes de publicar]

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: privacy.title,
    description: 'Cómo Plagastop trata los datos personales que recibe a través de este sitio.',
    path: privacy.path,
  })

export default function Privacy() {
  const viaWhatsApp = FORM_METHOD === 'whatsapp'
  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Inicio', path: '/' },
          { name: 'Privacidad', path: privacy.path },
        ]}
        title={privacy.title}
      />
      <section className="section">
        <div className={`container ${styles.prose}`}>
          <p>
            <em>Última actualización: {versionLabel(privacy)}.</em>
          </p>
          <p>
            {company.legalName} trata los datos personales que entregas a través de los formularios de
            este sitio con el único fin de responder tus solicitudes de cotización y consultas, conforme a la
            legislación chilena sobre protección de datos personales.
          </p>

          <h2>Responsable</h2>
          <p>
            {company.legalName}, {company.address.street}, {company.address.area}, {company.address.city},{' '}
            {company.address.region}. Contacto: <a href={`mailto:${salesArea.email}`}>{salesArea.email}</a>.
          </p>

          <h2>Qué datos recibimos</h2>
          <ul>
            <li>Datos de contacto: nombre, empresa, cargo, correo y teléfono.</li>
            <li>Información de tu solicitud: tipo de instalación, servicio, ubicación, urgencia y mensaje.</li>
            <li>
              Registro de tu consentimiento: la fecha y hora en que aceptaste los{' '}
              <Link to={terms.path}>{terms.title}</Link> y esta política, y la versión de cada documento.
            </li>
            {!viaWhatsApp && <li>Origen de la visita (por ejemplo, la campaña desde la que llegaste), cuando existe.</li>}
          </ul>

          <h2>Cómo nos llegan</h2>
          {viaWhatsApp ? (
            <>
              <p>
                Al completar un formulario, el sitio prepara un mensaje con tus datos y abre WhatsApp. El sitio no
                guarda esos datos ni los envía a ningún servidor: solo nos llegan si presionas Enviar en WhatsApp,
                desde tu propia cuenta, al número del Área Comercial.
              </p>
              <p>
                WhatsApp es un servicio de Meta. El mensaje viaja a través de WhatsApp y queda sujeto también a sus
                condiciones y a su política de privacidad. Si prefieres no usar WhatsApp, puedes escribirnos al
                correo o llamarnos.
              </p>
            </>
          ) : (
            <p>
              Al enviar un formulario, tus datos se transmiten a nuestro servidor y se nos envían por correo
              electrónico. Como respaldo ante fallas de envío, el servidor conserva una copia de cada solicitud por
              un máximo de 7 días y luego la elimina automáticamente.
            </p>
          )}

          <h2>Para qué los usamos</h2>
          <p>
            Para contactarte, preparar una propuesta y coordinar los servicios que solicites. Los tratamos sobre la
            base de tu consentimiento, que entregas al marcar las casillas del formulario. No vendemos ni cedemos tus
            datos a terceros para fines comerciales.
          </p>

          <h2>Registro de tu consentimiento</h2>
          <p>
            Para poder acreditar que aceptaste, cada solicitud incluye la fecha y hora de aceptación de los{' '}
            {terms.title} y de esta política, con la versión de cada documento. Conservamos ese registro junto con tu
            solicitud.
          </p>

          <h2>Cuánto tiempo los conservamos</h2>
          <p>
            El tiempo necesario para responder tu solicitud y gestionar la relación comercial que se origine, o hasta
            que solicites su eliminación, salvo que la ley nos exija conservarlos por más tiempo.
          </p>

          <h2>Tus derechos</h2>
          <p>
            Puedes solicitar el acceso, la rectificación, la eliminación de tus datos y oponerte a su tratamiento, así
            como ejercer los demás derechos que te reconoce la ley, o retirar tu consentimiento en cualquier momento,
            escribiendo a <a href={`mailto:${salesArea.email}`}>{salesArea.email}</a>.
          </p>

          <h2>Cookies</h2>
          <p>
            Revisa nuestra <Link to={cookies.path}>{cookies.title}</Link>.
          </p>

          <h2>Cambios a esta política</h2>
          <p>
            Si modificamos esta política, publicaremos la nueva versión en esta página con su fecha de actualización.
          </p>
        </div>
      </section>
    </>
  )
}
