/**
 * Formularios por WhatsApp (modo temporal mientras termina la migración del correo, ver FORM_METHOD en forms.ts).
 *
 * Al validar, el formulario abre WhatsApp con un mensaje preparado. Abrir WhatsApp NO envía nada: la persona debe
 * presionar Enviar en la aplicación. Por eso aquí no hay confirmaciones de "recibido" ni datos que salgan del navegador:
 * no se llama al endpoint PHP ni se guarda nada en el almacenamiento local.
 *
 * Formato: texto plano con negritas de WhatsApp (*TÍTULO*), saltos de línea reales (\n) y una línea en blanco (\n\n)
 * entre secciones. Sin emojis: la redirección de wa.me los reemplaza por «�» (comprobado en sus servidores), así que
 * también se quitan de lo que escribe la persona. Pruebas: tests/whatsapp-message.test.mjs (npm test).
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { contactAreas, salesArea, SITE_URL } from '~/content/company'
import { facilityOptions, serviceOptions, urgencyOptions } from '~/content/quote'
import { chileTime, privacy, terms, versionShort } from '~/content/legal'
import { whatsappHref } from '~/lib/contact'

/** WhatsApp oficial del Área Comercial (+56 9 7793 7824): lo usan ambos formularios. */
export const FORM_WHATSAPP = salesArea.phone

const labelOf = (options: { value: string; label: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? ''

/* ---------- Limpieza del texto ---------- */

/** Emojis y sus modificadores (unión, variación, tono de piel, banderas): wa.me los convierte en «�». */
const EMOJI = /\p{Extended_Pictographic}|\p{Regional_Indicator}|[\u{1F3FB}-\u{1F3FF}]|\u200D|\uFE0E|\uFE0F|\u20E3/gu

const stripEmoji = (value: string) => value.replace(EMOJI, '')

/** Campo de una sola línea: sin emojis, saltos ni espacios repetidos (no puede romper la estructura del mensaje). */
const oneLine = (value: string | undefined) => stripEmoji(value ?? '').replace(/\s+/g, ' ').trim()

/** Texto libre de la persona: conserva sus párrafos; quita emojis, espacios al final y líneas en blanco de más. */
const paragraphs = (value: string | undefined) =>
  stripEmoji(value ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[^\S\n]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

/* ---------- Formato común ---------- */

/** «Comuna o ciudad: Coronel», o nada si el valor está vacío. */
const field = (label: string, value: string | undefined) => {
  const v = oneLine(value)
  return v ? `${label}: ${v}` : ''
}

/** Sección con título en negrita de WhatsApp. Si no tiene contenido, se omite completa (sin títulos sueltos). */
function section(heading: string, lines: string[]) {
  const body = lines.filter(Boolean)
  return body.length ? [`*${heading}*`, ...body].join('\n') : ''
}

/** Instantes ISO en que la persona marcó cada casilla (registro del consentimiento). */
export interface ConsentData {
  terminos: string
  privacidad: string
}

const SEPARATOR = '--------------------'

/**
 * Registro de las aceptaciones, al final y separado del mensaje comercial: fecha y hora de cada casilla (según el
 * navegador de la persona), versión y dirección de cada documento. Al enviarse desde su WhatsApp, el mensaje queda
 * además con la fecha y hora de envío de WhatsApp. No se afirma ningún registro de servidor: no lo hay.
 */
function consentSection(c: ConsentData) {
  return [
    SEPARATOR,
    '*CONSENTIMIENTOS*',
    `Términos: Aceptados — ${chileTime(c.terminos)}`,
    `Privacidad: Aceptada — ${chileTime(c.privacidad)}`,
    `Versión de Términos: ${versionShort(terms)}`,
    `Versión de Privacidad: ${versionShort(privacy)}`,
    '',
    'Documentos:',
    `${SITE_URL}${terms.path}`,
    `${SITE_URL}${privacy.path}`,
  ].join('\n')
}

/**
 * Mensaje completo: saludo, secciones y consentimientos, con una línea en blanco (\n\n) entre bloques.
 * Las secciones vacías se descartan, así nunca quedan líneas en blanco dobles.
 */
export function composeMessage(greeting: string, sections: string[], consent: ConsentData) {
  return [greeting, ...sections, consentSection(consent)].filter(Boolean).join('\n\n')
}

/* ---------- Cotización ---------- */

export interface QuoteMessageData extends ConsentData {
  instalacion: string
  servicio: string
  comuna: string
  urgencia: string
  nombre: string
  empresa: string
  cargo: string
  correo: string
  telefono: string
  mensaje: string
}

/** Mensaje de cotización con todos los campos que captura QuoteForm (solo los que tienen valor). */
export function quoteMessage(v: QuoteMessageData) {
  return composeMessage(
    '¡Hola! Quisiera solicitar una cotización a Plagastop desde su página web.',
    [
      section('DATOS DEL SERVICIO', [
        field('Servicio', labelOf(serviceOptions, v.servicio)),
        field('Tipo de instalación', labelOf(facilityOptions, v.instalacion)),
        field('Comuna o ciudad', v.comuna),
        field('Urgencia', labelOf(urgencyOptions, v.urgencia)),
      ]),
      section('DATOS DE CONTACTO', [
        field('Nombre', v.nombre),
        field('Empresa', v.empresa),
        field('Cargo', v.cargo),
        field('Correo', v.correo),
        field('Teléfono', v.telefono),
      ]),
      section('OBSERVACIONES', [paragraphs(v.mensaje)]),
    ],
    v,
  )
}

/* ---------- Contacto ---------- */

export interface ContactMessageData extends ConsentData {
  nombre: string
  correo: string
  telefono: string
  area: string
  mensaje: string
}

/** Mensaje del formulario de contacto. El área (Comercial o Secretaría) queda identificada en el texto. */
export function contactMessage(v: ContactMessageData) {
  const area = contactAreas.find((a) => a.id === v.area)?.name.replace(/^Área\s+/, '') ?? ''
  return composeMessage(
    '¡Hola! Quisiera contactar a Plagastop desde su página web.',
    [
      section('DATOS DE CONTACTO', [
        field('Nombre', v.nombre),
        field('Correo', v.correo),
        field('Teléfono', v.telefono),
        field('Área', area),
      ]),
      section('MENSAJE', [paragraphs(v.mensaje)]),
    ],
    v,
  )
}

/* ---------- Enlace ---------- */

/**
 * https://wa.me/56977937824?text=… — el mensaje completo se codifica una sola vez con encodeURIComponent
 * (whatsappHref): cada salto de línea queda como %0A y las tildes y la ñ como UTF-8.
 */
export const whatsappFormUrl = (message: string) => whatsappHref(FORM_WHATSAPP, message)

/**
 * Abre WhatsApp. Debe llamarse dentro del mismo gesto del usuario (el envío del formulario, sin esperas ni await
 * previos) para que Chrome y Safari no lo traten como ventana emergente. En escritorio abre una pestaña nueva
 * (WhatsApp Web o la aplicación); en Android y iPhone, el enlace abre la aplicación. Si el navegador bloquea la
 * pestaña nueva, se abre en la misma.
 */
export function openWhatsApp(url: string) {
  const win = window.open(url, '_blank')
  if (win) {
    win.opener = null
  } else {
    window.location.assign(url)
  }
}

/**
 * Abre WhatsApp una sola vez por intento: los clics repetidos durante `cooldown` ms se ignoran. Devuelve además
 * el último enlace, para ofrecerlo como respaldo si la aplicación no se abrió.
 */
export function useWhatsAppLauncher(cooldown = 3000) {
  const lastOpen = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [cooling, setCooling] = useState(false)
  const [lastUrl, setLastUrl] = useState<string | null>(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const launch = useCallback(
    (url: string) => {
      const now = Date.now()
      if (now - lastOpen.current < cooldown) return false
      lastOpen.current = now
      openWhatsApp(url)
      setLastUrl(url)
      setCooling(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCooling(false), cooldown)
      return true
    },
    [cooldown],
  )

  return { launch, cooling, lastUrl }
}
