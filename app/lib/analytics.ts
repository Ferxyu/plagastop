/**
 * Eventos de conversión. Publican en window.dataLayer (GTM).
 * GTM solo se carga si existe VITE_GTM_ID. [Pendiente: banner de consentimiento antes de activar]
 */

export type AnalyticsEvent =
  | 'cta_click'
  | 'quote_start'
  | 'quote_step_2'
  | 'quote_submit'
  | 'quote_error'
  | 'contact_submit'
  | 'tel_click'
  | 'email_click'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function track(event: AnalyticsEvent, params: Record<string, string | undefined> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...params })
}

export function initAnalytics() {
  const id = import.meta.env.VITE_GTM_ID as string | undefined
  if (!id || typeof document === 'undefined' || document.getElementById('gtm-script')) return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const script = document.createElement('script')
  script.id = 'gtm-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)
}
