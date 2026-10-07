import type { Route } from './+types/privacidad'
import { company, salesArea } from '~/content/company'
import { buildMeta } from '~/lib/seo'
import { PageHero } from '~/components/sections/PageHero'
import styles from './page.module.css'

// [Pendiente: revisión legal antes de publicar]

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Política de privacidad',
    description: 'Cómo Plagastop trata los datos personales que recibe a través de este sitio.',
    path: '/privacidad',
  })

export default function Privacy() {
  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Inicio', path: '/' },
          { name: 'Privacidad', path: '/privacidad' },
        ]}
        title="Política de privacidad"
      />
      <section className="section">
        <div className={`container ${styles.prose}`}>
          <p>
            {company.legalName} trata los datos personales que entregas a través de los formularios de
            este sitio con el único fin de responder tus solicitudes de cotización y consultas.
          </p>
          <h2>Qué datos recibimos</h2>
          <ul>
            <li>Datos de contacto: nombre, empresa, cargo, correo y teléfono.</li>
            <li>Información de tu solicitud: tipo de instalación, servicio, ubicación y mensaje.</li>
            <li>Origen de la visita (por ejemplo, la campaña desde la que llegaste), cuando existe.</li>
          </ul>
          <h2>Para qué los usamos</h2>
          <p>
            Para contactarte, preparar una propuesta y coordinar los servicios que solicites. No vendemos
            ni cedemos tus datos a terceros para fines comerciales.
          </p>
          <h2>Tus derechos</h2>
          <p>
            Puedes solicitar el acceso, la rectificación o la eliminación de tus datos escribiendo a{' '}
            <a href={`mailto:${salesArea.email}`}>{salesArea.email}</a>.
          </p>
        </div>
      </section>
    </>
  )
}
