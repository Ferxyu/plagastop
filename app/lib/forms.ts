/**
 * Envío de formularios y atribución de campañas.
 *
 * Método de envío (VITE_FORM_METHOD, ver .env.production):
 *  - 'whatsapp' (por defecto): el formulario abre WhatsApp con el mensaje preparado (lib/whatsapp.ts). No llama
 *    al servidor ni requiere credenciales. Es el modo activo mientras termina la migración del correo.
 *  - 'api': envío por correo con el endpoint PHP VITE_FORM_ENDPOINT (/api/enviar.php, SMTP autenticado).
 *    Detalle en docs/formularios-produccion.md.
 *
 * En modo 'api', una solicitud solo se da por enviada si el servidor responde 2xx con { ok: true }. Cada formulario pide al
 * cargar un token firmado (prueba de que la página se abrió y de que pasó un tiempo mínimo), incluye un campo
 * trampa oculto y un identificador propio, para que un reintento tras un corte no duplique el correo.
 */

import { useCallback, useEffect, useRef } from 'react'
import { privacy, terms } from '~/content/legal'

const ATTRIBUTION_KEY = 'ps_attribution'
const ATTRIBUTION_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']

/** Guarda UTM y click IDs de la primera página de la sesión. */
export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search)
    const found: Record<string, string> = {}
    for (const key of ATTRIBUTION_PARAMS) {
      const value = params.get(key)
      if (value) found[key] = value
    }
    if (Object.keys(found).length === 0 || sessionStorage.getItem(ATTRIBUTION_KEY)) return
    sessionStorage.setItem(
      ATTRIBUTION_KEY,
      JSON.stringify({ ...found, landing_page: window.location.pathname }),
    )
  } catch {
    // Almacenamiento bloqueado: la atribución es opcional.
  }
}

function readAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export type FieldErrors<T extends string> = Partial<Record<T, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value: string) {
  if (!value.trim()) return 'Ingresa tu correo.'
  if (!EMAIL_RE.test(value.trim())) return 'Revisa el correo: debe tener el formato nombre@empresa.cl.'
  return undefined
}

export function validatePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (!digits) return 'Ingresa un teléfono para contactarte.'
  if (digits.length < 8 || digits.length > 12) return 'Revisa el teléfono: por ejemplo +56 9 1234 5678.'
  return undefined
}

export function required(value: string, message: string) {
  return value.trim() ? undefined : message
}

/** Casillas de Términos y condiciones y Política de privacidad: su valor es el instante ISO en que se marcaron. */
export type ConsentKey = 'terminos' | 'privacidad'

/** Ambas casillas son obligatorias y se validan por separado. */
export function validateConsent(values: Record<ConsentKey, string>) {
  return {
    terminos: values.terminos ? undefined : 'Debes aceptar los Términos y condiciones para continuar.',
    privacidad: values.privacidad ? undefined : 'Debes aceptar la Política de privacidad para continuar.',
  }
}

/* ---------- Envío ---------- */

/** Solo con VITE_FORM_METHOD=api se usa el correo; cualquier otro valor (o ninguno) deja WhatsApp. */
export const FORM_METHOD: 'whatsapp' | 'api' =
  (import.meta.env.VITE_FORM_METHOD as string | undefined)?.trim() === 'api' ? 'api' : 'whatsapp'

const ENDPOINT =
  FORM_METHOD === 'api' ? (import.meta.env.VITE_FORM_ENDPOINT as string | undefined)?.trim() || undefined : undefined

/** Mayor que el tiempo máximo del SMTP en el servidor, para no cortar un envío que sí está en curso. */
const SUBMIT_TIMEOUT_MS = 45_000
const TOKEN_TIMEOUT_MS = 10_000
/** El servidor exige 3 s entre abrir el formulario y enviarlo; se deja un margen. */
const TOKEN_MIN_AGE_MS = 3_500
/** El token vence a las 4 h en el servidor; se renueva antes. */
const TOKEN_REFRESH_MS = 3 * 60 * 60 * 1000

/** Campo trampa: oculto para las personas; si llega con contenido, el servidor rechaza el envío. */
export const HONEYPOT_NAME = 'sitio_web'

export class FormConfigError extends Error {}

/** Error con un mensaje apto para mostrar al visitante y un código sin datos personales para analítica. */
export class FormSubmitError extends Error {
  readonly code: string
  readonly fields: Record<string, string>
  constructor(message: string, code: string, fields: Record<string, string> = {}) {
    super(message)
    this.code = code
    this.fields = fields
  }
}

const RETRYABLE_TOKEN = new Set(['token_invalid', 'token_expired', 'too_fast'])

function newId() {
  // randomUUID solo existe en contextos seguros (https); el respaldo sirve para pruebas por http.
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function request(url: string, init: RequestInit, timeout: number) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  let response: Response
  try {
    response = await fetch(url, { ...init, signal: controller.signal, credentials: 'same-origin', cache: 'no-store' })
  } catch {
    if (controller.signal.aborted) {
      throw new FormSubmitError(
        'El servidor tardó demasiado en responder. Es posible que tu solicitud no se haya enviado.',
        'timeout',
      )
    }
    throw new FormSubmitError('No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.', 'network')
  } finally {
    clearTimeout(timer)
  }

  let body: unknown = null
  try {
    body = await response.json()
  } catch {
    // Respuesta que no es JSON (p. ej. una página de error del hosting): se trata como fallo.
  }
  const json = (body && typeof body === 'object' ? body : {}) as {
    ok?: unknown
    token?: unknown
    error?: unknown
    code?: unknown
    fields?: unknown
  }
  if (response.ok && json.ok === true) return json

  const code = typeof json.code === 'string' ? json.code : `http_${response.status}`
  const message =
    typeof json.error === 'string' && json.error
      ? json.error
      : 'El servidor no pudo procesar tu solicitud. Inténtalo de nuevo en unos minutos.'
  const fields =
    json.fields && typeof json.fields === 'object'
      ? Object.fromEntries(Object.entries(json.fields).filter(([, v]) => typeof v === 'string'))
      : {}
  throw new FormSubmitError(message, code, fields as Record<string, string>)
}

/** Valor del campo trampa del formulario (vacío si una persona lo envía). */
function readHoneypot(form: HTMLFormElement | null) {
  const field = form?.elements.namedItem(HONEYPOT_NAME)
  return field instanceof HTMLInputElement ? field.value : ''
}

/**
 * Envío de un formulario al endpoint. Pide el token al montar, evita envíos simultáneos y reintenta una vez
 * (con un token nuevo) si el anterior venció. Resuelve solo con la confirmación real del servidor.
 */
export function useLeadSubmit(kind: 'cotizacion' | 'contacto') {
  const token = useRef<{ value: string; at: number } | null>(null)
  const pendingToken = useRef<Promise<void> | null>(null)
  // Un identificador por solicitud: si la respuesta se pierde y la persona reintenta, el servidor no la duplica.
  const submissionId = useRef<string | null>(null)
  const inFlight = useRef(false)

  const fetchToken = useCallback(() => {
    if (!ENDPOINT) return Promise.reject(new FormConfigError('VITE_FORM_ENDPOINT sin definir'))
    if (pendingToken.current) return pendingToken.current
    const url = `${ENDPOINT}${ENDPOINT.includes('?') ? '&' : '?'}accion=token`
    pendingToken.current = request(url, { method: 'GET', headers: { Accept: 'application/json' } }, TOKEN_TIMEOUT_MS)
      .then((json) => {
        if (typeof json.token !== 'string') throw new FormSubmitError('Respuesta inesperada del servidor.', 'bad_token')
        token.current = { value: json.token, at: Date.now() }
      })
      .finally(() => {
        pendingToken.current = null
      })
    return pendingToken.current
  }, [])

  useEffect(() => {
    // Solo en modo 'api': se pide al cargar el formulario; si falla, se vuelve a intentar al enviar.
    // En modo WhatsApp ENDPOINT queda sin definir y no se hace ninguna solicitud al servidor.
    if (ENDPOINT) fetchToken().catch(() => {})
  }, [fetchToken])

  return useCallback(
    async (data: Record<string, string>, form: HTMLFormElement | null) => {
      if (!ENDPOINT) throw new FormConfigError('El envío de formularios aún no está configurado (VITE_FORM_ENDPOINT).')
      if (inFlight.current) throw new FormSubmitError('Tu solicitud ya se está enviando.', 'in_flight')
      inFlight.current = true
      submissionId.current ??= newId()

      const ensureToken = async () => {
        if (!token.current || Date.now() - token.current.at > TOKEN_REFRESH_MS) await fetchToken()
        const age = Date.now() - token.current!.at
        if (age < TOKEN_MIN_AGE_MS) await wait(TOKEN_MIN_AGE_MS - age)
      }

      const post = () =>
        request(
          ENDPOINT,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              ...data,
              ...readAttribution(),
              kind,
              // Registro del consentimiento: los instantes van en data (terminos, privacidad); aquí, qué versión se aceptó.
              version_terminos: terms.version,
              version_privacidad: privacy.version,
              page: window.location.pathname,
              [HONEYPOT_NAME]: readHoneypot(form),
              ps_token: token.current!.value,
              ps_id: submissionId.current,
            }),
          },
          SUBMIT_TIMEOUT_MS,
        )

      try {
        await ensureToken()
        try {
          await post()
        } catch (err) {
          if (!(err instanceof FormSubmitError) || !RETRYABLE_TOKEN.has(err.code)) throw err
          token.current = null
          await ensureToken()
          await post()
        }
        // Confirmado por el servidor: la próxima solicitud usa identificador y token nuevos.
        submissionId.current = null
        token.current = null
        fetchToken().catch(() => {})
      } finally {
        inFlight.current = false
      }
    },
    [kind, fetchToken],
  )
}

/** aria-describedby para un campo con ayuda y/o error. */
export function describedBy(id: string, error?: string, hint?: string) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
}
