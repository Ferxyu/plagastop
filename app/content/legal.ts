/**
 * Documentos legales del sitio y su versión vigente. La versión es la fecha de la última actualización: viaja en
 * el registro de consentimiento de cada solicitud (mensaje de WhatsApp o correo), así se sabe qué texto aceptó
 * la persona. Al cambiar el contenido de un documento, actualiza aquí su fecha.
 *
 * [Pendiente: revisión legal de los tres textos antes de publicar]
 */

export interface LegalDoc {
  path: string
  title: string
  /** Fecha de la versión vigente (AAAA-MM-DD). */
  version: string
}

export const terms: LegalDoc = { path: '/terminos', title: 'Términos y condiciones', version: '2026-11-11' }
export const privacy: LegalDoc = { path: '/privacidad', title: 'Política de privacidad', version: '2026-11-11' }
export const cookies: LegalDoc = { path: '/cookies', title: 'Política de cookies', version: '2026-11-11' }

/** 2026-11-11 → «11 de noviembre de 2026» */
export function versionLabel(doc: LegalDoc) {
  const [y, m, d] = doc.version.split('-').map(Number)
  return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  )
}

/** 2026-11-11 → «11-11-2026» (formato corto para el registro de consentimiento) */
export const versionShort = (doc: LegalDoc) => doc.version.split('-').reverse().join('-')

/** Fecha y hora exacta de Chile para un instante ISO: «11-11-2026 a las 10:42:07 (hora de Chile)». */
export function chileTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('es-CL', {
      timeZone: 'America/Santiago',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  )
  return `${parts.day}-${parts.month}-${parts.year} a las ${parts.hour}:${parts.minute}:${parts.second} (hora de Chile)`
}
