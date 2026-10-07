/**
 * Envío de formularios y atribución de campañas.
 * El destino se define con VITE_FORM_ENDPOINT (función serverless, CRM o servicio de formularios).
 * [Pendiente: decidir destino de los leads]
 */

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

export class FormConfigError extends Error {}

export async function submitLead(kind: 'cotizacion' | 'contacto', data: Record<string, string>) {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined
  if (!endpoint) {
    throw new FormConfigError('El envío de formularios aún no está configurado (VITE_FORM_ENDPOINT).')
  }
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      kind,
      ...data,
      ...readAttribution(),
      page: window.location.pathname,
      submitted_at: new Date().toISOString(),
    }),
  })
  if (!response.ok) throw new Error(`Error ${response.status}`)
}

/** aria-describedby para un campo con ayuda y/o error. */
export function describedBy(id: string, error?: string, hint?: string) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
}
