import type { ReactNode } from 'react'
import { privacy, terms } from '~/content/legal'
import { describedBy, type ConsentKey } from '~/lib/forms'
import styles from './forms.module.css'

interface Props {
  /** Prefijo de los id para no repetirlos entre formularios de una misma página. */
  idPrefix?: string
  /** Instante ISO en que se marcó cada casilla ('' si está sin marcar): es el registro del consentimiento. */
  values: Record<ConsentKey, string>
  errors: Partial<Record<ConsentKey, string>>
  onChange: (key: ConsentKey, value: string) => void
  purpose: 'solicitud' | 'consulta'
  viaWhatsApp: boolean
}

/**
 * Dos casillas separadas: Términos y condiciones y Política de privacidad, cada una con su enlace al lado.
 * Los enlaces abren en una pestaña nueva para no perder lo escrito en el formulario. Al marcar una casilla se
 * guarda la fecha y hora (al desmarcarla se borra); ese instante y la versión del documento viajan en la solicitud.
 */
export function ConsentChecks({ idPrefix = '', values, errors, onChange, purpose, viaWhatsApp }: Props) {
  const box = (key: ConsentKey, label: ReactNode) => {
    const id = `${idPrefix}${key}`
    return (
      <div>
        <label className={styles.consent} htmlFor={id}>
          <input
            id={id}
            type="checkbox"
            name={key}
            checked={!!values[key]}
            onChange={(e) => onChange(key, e.target.checked ? new Date().toISOString() : '')}
            aria-invalid={!!errors[key]}
            aria-describedby={describedBy(id, errors[key])}
          />
          <span>{label}</span>
        </label>
        {errors[key] && (
          <p id={`${id}-error`} className={styles.error} role="alert">
            {errors[key]}
          </p>
        )}
      </div>
    )
  }

  const link = (doc: { path: string; title: string }) => (
    <a href={doc.path} target="_blank" rel="noopener">
      {doc.title}
      <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
    </a>
  )

  return (
    <fieldset className={styles.consentGroup}>
      <legend className="visually-hidden">Aceptación de términos y privacidad</legend>
      {box('terminos', <>Acepto los {link(terms)}.</>)}
      {box(
        'privacidad',
        <>
          Acepto la {link(privacy)} y autorizo a Plagastop a usar mis datos para responder mi {purpose}.
          {viaWhatsApp && ' Los datos se enviarán a través de WhatsApp cuando presiones Enviar en la aplicación.'}
        </>,
      )}
    </fieldset>
  )
}
