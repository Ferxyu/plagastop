import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { CheckCircle2 } from 'lucide-react'
import { contactAreas, salesArea } from '~/content/company'
import { formatPhone, telHref } from '~/lib/contact'
import { track } from '~/lib/analytics'
import { FormConfigError, describedBy, required, submitLead, validateEmail, type FieldErrors } from '~/lib/forms'
import { Button } from '~/components/ui/Button'
import { Field, Input, Select, Textarea } from './Field'
import styles from './forms.module.css'

type Key = 'nombre' | 'correo' | 'telefono' | 'area' | 'mensaje' | 'consentimiento'

export function ContactForm() {
  const [values, setValues] = useState<Record<Key, string>>({
    nombre: '',
    correo: '',
    telefono: '',
    area: 'comercial',
    mensaje: '',
    consentimiento: '',
  })
  const [errors, setErrors] = useState<FieldErrors<Key>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error' | 'config'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const set = (key: Key) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const all: FieldErrors<Key> = {
      nombre: required(values.nombre, 'Ingresa tu nombre.'),
      correo: validateEmail(values.correo),
      mensaje: required(values.mensaje, 'Escribe tu consulta.'),
      consentimiento: values.consentimiento ? undefined : 'Necesitamos tu autorización para responderte.',
    }
    const errs = Object.fromEntries(Object.entries(all).filter(([, v]) => v)) as FieldErrors<Key>
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setStatus('sending')
    try {
      await submitLead('contacto', values)
      track('contact_submit', { area: values.area })
      setStatus('sent')
    } catch (err) {
      setStatus(err instanceof FormConfigError ? 'config' : 'error')
    }
  }

  if (status === 'sent') {
    return (
      <div className={styles.form} role="status">
        <CheckCircle2 size={32} strokeWidth={1.5} aria-hidden />
        <h3>Recibimos tu mensaje</h3>
        <p>Te responderemos dentro del horario de atención. Si es urgente, llámanos.</p>
      </div>
    )
  }

  const err = (key: Key) => errors[key]

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <Field id="c-nombre" label="Nombre" error={err('nombre')}>
          <Input
            id="c-nombre"
            name="nombre"
            autoComplete="name"
            value={values.nombre}
            onChange={set('nombre')}
            aria-invalid={!!err('nombre')}
            aria-describedby={describedBy('c-nombre', err('nombre'))}
          />
        </Field>
        <Field id="c-correo" label="Correo" error={err('correo')}>
          <Input
            id="c-correo"
            name="correo"
            type="email"
            autoComplete="email"
            value={values.correo}
            onChange={set('correo')}
            aria-invalid={!!err('correo')}
            aria-describedby={describedBy('c-correo', err('correo'))}
          />
        </Field>
      </div>
      <div className={styles.row}>
        <Field id="c-telefono" label="Teléfono" optional>
          <Input
            id="c-telefono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            value={values.telefono}
            onChange={set('telefono')}
          />
        </Field>
        <Field id="c-area" label="Área">
          <Select
            id="c-area"
            name="area"
            value={values.area}
            onChange={set('area')}
            options={contactAreas.map((a) => ({ value: a.id, label: a.name }))}
          />
        </Field>
      </div>
      <Field id="c-mensaje" label="Mensaje" error={err('mensaje')}>
        <Textarea
          id="c-mensaje"
          name="mensaje"
          rows={5}
          value={values.mensaje}
          onChange={set('mensaje')}
          aria-invalid={!!err('mensaje')}
          aria-describedby={describedBy('c-mensaje', err('mensaje'))}
        />
      </Field>
      <div>
        <label className={styles.consent}>
          <input
            type="checkbox"
            name="consentimiento"
            checked={!!values.consentimiento}
            onChange={(e) => setValues((v) => ({ ...v, consentimiento: e.target.checked ? 'si' : '' }))}
            aria-invalid={!!err('consentimiento')}
          />
          <span>
            Autorizo a Plagastop a usar estos datos para responder mi consulta, según su{' '}
            <Link to="/privacidad">política de privacidad</Link>.
          </span>
        </label>
        {err('consentimiento') && (
          <p className={styles.error} role="alert">
            {err('consentimiento')}
          </p>
        )}
      </div>
      {(status === 'error' || status === 'config') && (
        <div className={styles.alert} role="alert">
          <strong>No pudimos enviar tu mensaje.</strong>
          {status === 'error' ? 'Inténtalo de nuevo o ' : 'El formulario aún no está disponible: '}
          llámanos al <a href={telHref(salesArea.phone)}>{formatPhone(salesArea.phone)}</a>.
        </div>
      )}
      <div className={styles.actions}>
        <Button type="submit" size="lg" variant="secondary" arrow loading={status === 'sending'}>
          Enviar mensaje
        </Button>
      </div>
    </form>
  )
}
