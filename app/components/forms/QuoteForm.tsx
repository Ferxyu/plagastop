import { useRef, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { salesArea } from '~/content/company'
import { facilityOptions, needOptions, serviceOptions, urgencyOptions } from '~/content/quote'
import { formatPhone, mailHref, telHref } from '~/lib/contact'
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
import { useHydrated } from '~/lib/hydrated'
import { quoteMessage, useWhatsAppLauncher, whatsappFormUrl } from '~/lib/whatsapp'
import { Button } from '~/components/ui/Button'
import { WhatsAppIcon } from '~/components/brand/WhatsAppIcon'
import { Field, Honeypot, Input, Select, Textarea } from './Field'
import { ConsentChecks } from './Consent'
import { WhatsAppHint, WhatsAppOpened } from './WhatsAppNotice'
import styles from './forms.module.css'

type Step1 = 'instalacion' | 'servicio' | 'comuna' | 'urgencia'
type Step2 = 'nombre' | 'empresa' | 'cargo' | 'correo' | 'telefono' | 'mensaje' | 'terminos' | 'privacidad'
type Values = Record<Step1 | Step2, string>

const has = (options: { value: string }[], value: string | null) =>
  value && options.some((o) => o.value === value) ? value : ''

const STEP1: (keyof Values)[] = ['instalacion', 'servicio', 'comuna', 'urgencia']

function initialValues(params: URLSearchParams, defaultService?: string): Values {
  const need = needOptions.find((n) => n.value === params.get('necesidad'))
  return {
    instalacion: has(facilityOptions, params.get('instalacion')),
    servicio:
      has(serviceOptions, params.get('servicio')) || need?.service || has(serviceOptions, defaultService ?? null),
    comuna: '',
    urgencia: need?.value === 'problema-activo' ? 'problema-activo' : '',
    nombre: '',
    empresa: '',
    cargo: '',
    correo: '',
    telefono: '',
    mensaje: '',
    terminos: '',
    privacidad: '',
  }
}

/**
 * El HTML prerenderizado no conoce los parámetros de la URL. Tras hidratar, el formulario
 * se vuelve a montar con la precarga (?instalacion, ?necesidad, ?servicio).
 * `defaultService` precarga el servicio de una landing cuando la URL no trae uno.
 */
export function QuoteForm({ defaultService }: { defaultService?: string }) {
  const hydrated = useHydrated()
  const [params] = useSearchParams()
  return (
    <QuoteFormInner
      key={hydrated ? params.toString() : 'prerender'}
      params={hydrated ? params : new URLSearchParams()}
      defaultService={defaultService}
    />
  )
}

function QuoteFormInner({ params, defaultService }: { params: URLSearchParams; defaultService?: string }) {
  const navigate = useNavigate()
  const submitLead = useLeadSubmit('cotizacion')
  const whatsapp = useWhatsAppLauncher()
  const viaWhatsApp = FORM_METHOD === 'whatsapp'
  const [step, setStep] = useState<1 | 2>(1)
  const [values, setValues] = useState<Values>(() => initialValues(params, defaultService))
  const [errors, setErrors] = useState<FieldErrors<keyof Values>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'config'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const set = (key: keyof Values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  function focusFirstError(errs: FieldErrors<keyof Values>) {
    const first = Object.keys(errs)[0]
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }

  function validateStep1() {
    const errs: FieldErrors<keyof Values> = {
      instalacion: required(values.instalacion, 'Selecciona el tipo de instalación.'),
      servicio: required(values.servicio, 'Selecciona un servicio o elige "No lo sé".'),
      comuna: required(values.comuna, 'Indica la comuna o ciudad de la instalación.'),
    }
    return Object.fromEntries(Object.entries(errs).filter(([, v]) => v)) as FieldErrors<keyof Values>
  }

  function validateStep2() {
    const errs: FieldErrors<keyof Values> = {
      nombre: required(values.nombre, 'Ingresa tu nombre.'),
      empresa: required(values.empresa, 'Ingresa el nombre de la empresa (o "Particular").'),
      correo: validateEmail(values.correo),
      telefono: validatePhone(values.telefono),
      ...validateConsent(values),
    }
    return Object.fromEntries(Object.entries(errs).filter(([, v]) => v)) as FieldErrors<keyof Values>
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    if (step === 1) {
      const errs = validateStep1()
      setErrors(errs)
      if (Object.keys(errs).length) return focusFirstError(errs)
      setStep(2)
      track('quote_step_2', { service: values.servicio, facility: values.instalacion })
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[name="nombre"]')?.focus())
      return
    }
    const errs = validateStep2()
    setErrors(errs)
    if (Object.keys(errs).length) return focusFirstError(errs)

    if (viaWhatsApp) {
      // Sin await antes de abrir: debe ocurrir dentro del clic para que el navegador no lo bloquee.
      // Abrir WhatsApp no confirma nada: el evento solo registra la intención de continuar (sin datos personales).
      if (whatsapp.launch(whatsappFormUrl(quoteMessage(values)))) {
        track('quote_whatsapp_click', { service: values.servicio, facility: values.instalacion })
      }
      return
    }

    setStatus('sending')
    try {
      await submitLead(values, formRef.current)
      // Solo tras la confirmación real del servidor ({ ok: true }).
      track('quote_submit', { service: values.servicio, facility: values.instalacion })
      navigate('/cotizar/gracias')
    } catch (err) {
      if (err instanceof FormSubmitError && err.code === 'in_flight') return
      track('quote_error', { reason: err instanceof FormSubmitError ? err.code : 'config' })
      if (err instanceof FormSubmitError && Object.keys(err.fields).length) {
        // El servidor rechazó algún campo: se marca y, si es del primer paso, se vuelve a él.
        const fields = err.fields as FieldErrors<keyof Values>
        setErrors(fields)
        setStatus('idle')
        if (Object.keys(fields).some((k) => STEP1.includes(k as keyof Values))) setStep(1)
        requestAnimationFrame(() => focusFirstError(fields))
        return
      }
      setErrorMessage(err instanceof FormSubmitError ? err.message : '')
      setStatus(err instanceof FormConfigError ? 'config' : 'error')
    }
  }

  const err = (key: keyof Values) => errors[key]

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
      <ol className={styles.steps} aria-label="Progreso">
        <li aria-current={step === 1 ? 'step' : undefined} data-done={step === 2 || undefined}>
          <span className={styles.stepDot}>1</span> Tu necesidad
        </li>
        <li aria-current={step === 2 ? 'step' : undefined}>
          <span className={styles.stepDot}>2</span> Tus datos
        </li>
      </ol>

      {step === 1 ? (
        <>
          <div className={styles.row}>
            <Field id="instalacion" label="Tipo de instalación" error={err('instalacion')}>
              <Select
                id="instalacion"
                name="instalacion"
                required
                value={values.instalacion}
                onChange={set('instalacion')}
                options={facilityOptions}
                placeholder="Selecciona una opción"
                aria-invalid={!!err('instalacion')}
                aria-describedby={describedBy('instalacion', err('instalacion'))}
              />
            </Field>
            <Field id="servicio" label="Servicio" error={err('servicio')}>
              <Select
                id="servicio"
                name="servicio"
                required
                value={values.servicio}
                onChange={set('servicio')}
                options={serviceOptions}
                placeholder="Selecciona una opción"
                aria-invalid={!!err('servicio')}
                aria-describedby={describedBy('servicio', err('servicio'))}
              />
            </Field>
          </div>
          <Field
            id="comuna"
            label="Comuna o ciudad de la instalación"
            error={err('comuna')}
            hint="Desde Concepción, llegamos de Ñuble a Los Lagos."
          >
            <Input
              id="comuna"
              name="comuna"
              autoComplete="address-level2"
              value={values.comuna}
              onChange={set('comuna')}
              aria-invalid={!!err('comuna')}
              aria-describedby={describedBy('comuna', err('comuna'), 'hint')}
            />
          </Field>
          <fieldset className={styles.options}>
            <legend>
              Urgencia <span className={styles.optional}>(opcional)</span>
            </legend>
            {urgencyOptions.map((o) => (
              <label key={o.value} className={styles.option}>
                <input
                  type="radio"
                  name="urgencia"
                  value={o.value}
                  checked={values.urgencia === o.value}
                  onChange={set('urgencia')}
                />
                {o.label}
              </label>
            ))}
          </fieldset>
          <div className={styles.actions}>
            <Button type="submit" size="lg" arrow>
              Continuar
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.row}>
            <Field id="nombre" label="Nombre" error={err('nombre')}>
              <Input
                id="nombre"
                name="nombre"
                autoComplete="name"
                value={values.nombre}
                onChange={set('nombre')}
                aria-invalid={!!err('nombre')}
                aria-describedby={describedBy('nombre', err('nombre'))}
              />
            </Field>
            <Field id="empresa" label="Empresa" error={err('empresa')}>
              <Input
                id="empresa"
                name="empresa"
                autoComplete="organization"
                value={values.empresa}
                onChange={set('empresa')}
                aria-invalid={!!err('empresa')}
                aria-describedby={describedBy('empresa', err('empresa'))}
              />
            </Field>
          </div>
          <div className={styles.row}>
            <Field id="correo" label="Correo" error={err('correo')}>
              <Input
                id="correo"
                name="correo"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.correo}
                onChange={set('correo')}
                aria-invalid={!!err('correo')}
                aria-describedby={describedBy('correo', err('correo'))}
              />
            </Field>
            <Field id="telefono" label="Teléfono" error={err('telefono')}>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+56 9 1234 5678"
                value={values.telefono}
                onChange={set('telefono')}
                aria-invalid={!!err('telefono')}
                aria-describedby={describedBy('telefono', err('telefono'))}
              />
            </Field>
          </div>
          <Field id="cargo" label="Cargo" optional>
            <Input
              id="cargo"
              name="cargo"
              autoComplete="organization-title"
              value={values.cargo}
              onChange={set('cargo')}
            />
          </Field>
          <Field id="mensaje" label="Cuéntanos más" optional hint="Superficie aproximada, qué observaste, fechas importantes.">
            <Textarea
              id="mensaje"
              name="mensaje"
              rows={4}
              value={values.mensaje}
              onChange={set('mensaje')}
              aria-describedby="mensaje-hint"
            />
          </Field>
          <ConsentChecks
            values={values}
            errors={{ terminos: err('terminos'), privacidad: err('privacidad') }}
            onChange={(key, value) => setValues((v) => ({ ...v, [key]: value }))}
            purpose="solicitud"
            viaWhatsApp={viaWhatsApp}
          />

          {!viaWhatsApp && <Honeypot />}

          {(status === 'error' || status === 'config') && (
            <div className={styles.alert} role="alert">
              <strong>No pudimos enviar tu solicitud.</strong>
              {status === 'error'
                ? `${errorMessage || 'Inténtalo de nuevo en unos minutos.'} `
                : 'El formulario aún no está disponible. '}
              También puedes llamar al Área Comercial al{' '}
              <a href={telHref(salesArea.phone)}>{formatPhone(salesArea.phone)}</a> o escribir a{' '}
              <a href={mailHref(salesArea.email!, 'Solicitud de cotización')}>{salesArea.email}</a>.
            </div>
          )}

          <div className={styles.actions}>
            <Button
              type="submit"
              size="lg"
              arrow={!viaWhatsApp}
              icon={viaWhatsApp ? <WhatsAppIcon /> : undefined}
              loading={status === 'sending'}
              disabled={whatsapp.cooling}
            >
              {viaWhatsApp ? 'Solicitar por WhatsApp' : 'Enviar solicitud'}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)} disabled={status === 'sending'}>
              Volver
            </Button>
          </div>
          {viaWhatsApp && (
            <>
              <WhatsAppHint />
              <WhatsAppOpened url={whatsapp.lastUrl} />
            </>
          )}
        </>
      )}
    </form>
  )
}
