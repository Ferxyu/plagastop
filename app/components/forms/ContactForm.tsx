import { useRef, useState, type FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { contactAreas, salesArea } from '~/content/company'
import { formatPhone, telHref } from '~/lib/contact'
import { track } from '~/lib/analytics'
import {
  FORM_METHOD,
  FormConfigError,
  FormSubmitError,
  describedBy,
  required,
  useLeadSubmit,
  validateConsent,
  validateEmail,
  validatePhone,
  type FieldErrors,
} from '~/lib/forms'
import { contactMessage, useWhatsAppLauncher, whatsappFormUrl } from '~/lib/whatsapp'
import { Button } from '~/components/ui/Button'
import { WhatsAppIcon } from '~/components/brand/WhatsAppIcon'
import { Field, Honeypot, Input, Select, Textarea } from './Field'
import { ConsentChecks } from './Consent'
import { WhatsAppHint, WhatsAppOpened } from './WhatsAppNotice'
import styles from './forms.module.css'

type Key = 'nombre' | 'correo' | 'telefono' | 'area' | 'mensaje' | 'terminos' | 'privacidad'

export function ContactForm() {
  const submitLead = useLeadSubmit('contacto')
  const whatsapp = useWhatsAppLauncher()
  const viaWhatsApp = FORM_METHOD === 'whatsapp'
  const [values, setValues] = useState<Record<Key, string>>({
    nombre: '',
    correo: '',
    telefono: '',
    area: 'comercial',
    mensaje: '',
    terminos: '',
    privacidad: '',
  })
  const [errors, setErrors] = useState<FieldErrors<Key>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error' | 'config'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const set = (key: Key) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    const all: FieldErrors<Key> = {
      nombre: required(values.nombre, 'Ingresa tu nombre.'),
      correo: validateEmail(values.correo),
      // Opcional, pero si se escribe debe ser un número válido (el servidor aplica la misma regla).
      telefono: values.telefono.trim() ? validatePhone(values.telefono) : undefined,
      mensaje: required(values.mensaje, 'Escribe tu consulta.'),
      ...validateConsent(values),
    }
    const errs = Object.fromEntries(Object.entries(all).filter(([, v]) => v)) as FieldErrors<Key>
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    if (viaWhatsApp) {
      // Sin await antes de abrir: debe ocurrir dentro del clic para que el navegador no lo bloquee.
      // Abrir WhatsApp no confirma nada: el evento solo registra la intención (área, sin datos personales).
      if (whatsapp.launch(whatsappFormUrl(contactMessage(values)))) {
        track('contact_whatsapp_click', { area: values.area })
      }
      return
    }
    setStatus('sending')
    try {
      await submitLead(values, formRef.current)
      // Solo tras la confirmación real del servidor ({ ok: true }).
      track('contact_submit', { area: values.area })
      setStatus('sent')
    } catch (err) {
      if (err instanceof FormSubmitError && err.code === 'in_flight') return
      track('contact_error', { reason: err instanceof FormSubmitError ? err.code : 'config' })
      if (err instanceof FormSubmitError && Object.keys(err.fields).length) {
        const fields = err.fields as FieldErrors<Key>
        setErrors(fields)
        setStatus('idle')
        const firstField = Object.keys(fields)[0]
        if (firstField) formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus()
        return
      }
      setErrorMessage(err instanceof FormSubmitError ? err.message : '')
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
        <Field id="c-telefono" label="Teléfono" optional error={err('telefono')}>
          <Input
            id="c-telefono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            value={values.telefono}
            onChange={set('telefono')}
            aria-invalid={!!err('telefono')}
            aria-describedby={describedBy('c-telefono', err('telefono'))}
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
      <ConsentChecks
        idPrefix="c-"
        values={values}
        errors={{ terminos: err('terminos'), privacidad: err('privacidad') }}
        onChange={(key, value) => setValues((v) => ({ ...v, [key]: value }))}
        purpose="consulta"
        viaWhatsApp={viaWhatsApp}
      />
      {!viaWhatsApp && <Honeypot />}
      {(status === 'error' || status === 'config') && (
        <div className={styles.alert} role="alert">
          <strong>No pudimos enviar tu mensaje.</strong>
          {status === 'error'
            ? `${errorMessage || 'Inténtalo de nuevo en unos minutos.'} Si prefieres, `
            : 'El formulario aún no está disponible: '}
          llámanos al <a href={telHref(salesArea.phone)}>{formatPhone(salesArea.phone)}</a>.
        </div>
      )}
      <div className={styles.actions}>
        <Button
          type="submit"
          size="lg"
          variant="secondary"
          arrow={!viaWhatsApp}
          icon={viaWhatsApp ? <WhatsAppIcon /> : undefined}
          loading={status === 'sending'}
          disabled={whatsapp.cooling}
        >
          {viaWhatsApp ? 'Continuar por WhatsApp' : 'Enviar mensaje'}
        </Button>
      </div>
      {viaWhatsApp && (
        <>
          <WhatsAppHint />
          <WhatsAppOpened url={whatsapp.lastUrl} />
        </>
      )}
    </form>
  )
}
