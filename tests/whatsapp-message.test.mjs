/**
 * Pruebas de los mensajes de WhatsApp (app/lib/whatsapp.ts). Ejecutar: npm test
 *
 * Carga el módulo TypeScript real con Vite (alias ~ incluido), sin dependencias nuevas. La última prueba consulta
 * los servidores de WhatsApp (wa.me) para comprobar que el texto llega intacto; se omite sin conexión a internet
 * o con WHATSAPP_OFFLINE=1.
 */
import { after, before, describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const appDir = fileURLToPath(new URL('../app', import.meta.url))
let vite
let wa

before(async () => {
  vite = await createServer({
    configFile: false,
    logLevel: 'silent',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
    resolve: { alias: { '~': appDir } },
  })
  wa = await vite.ssrLoadModule('/app/lib/whatsapp.ts')
})
after(() => vite?.close())

const T1 = '2026-11-11T13:29:01.000Z' // 10:29:01 en Chile (UTC-3)
const T2 = '2026-11-11T13:29:03.000Z' // dos segundos después

const contactFull = {
  nombre: 'Martín Ibáñez',
  correo: 'martin.ibanez@correo.cl',
  telefono: '+56 41 210 4508',
  area: 'secretaria',
  mensaje: 'Necesito el certificado de la fumigación del 3 de noviembre.\n\n¿Me lo pueden enviar? Gracias.',
  terminos: T1,
  privacidad: T2,
}

const quoteFull = {
  instalacion: 'industria-alimentaria',
  servicio: 'control-de-roedores',
  comuna: 'Concepción, Biobío',
  urgencia: 'fecha-embarque',
  nombre: 'José Ñúñez',
  empresa: 'Alimentos Bío-Bío & Cía. Ltda.',
  cargo: 'Jefa de Aseguramiento de Calidad',
  correo: 'jose.nunez@alimentosbiobio.cl',
  telefono: '+56 9 8765 4321',
  mensaje: 'Bodega de 1.200 m² con señales de roedores.\r\nAuditoría el 15/12, ¿pueden venir antes?\n\n\n\nSegundo párrafo: 3 accesos.   ',
  terminos: T1,
  privacidad: T2,
}

const CONSENT = [
  '--------------------',
  '*CONSENTIMIENTOS*',
  'Términos: Aceptados — 11-11-2026 a las 10:29:01 (hora de Chile)',
  'Privacidad: Aceptada — 11-11-2026 a las 10:29:03 (hora de Chile)',
  'Versión de Términos: 11-11-2026',
  'Versión de Privacidad: 11-11-2026',
  '',
  'Documentos:',
  'https://plagastop.cl/terminos',
  'https://plagastop.cl/privacidad',
].join('\n')

const textOf = (url) => decodeURIComponent(url.slice(url.indexOf('?text=') + '?text='.length))

describe('mensaje de contacto', () => {
  test('formato exacto: saltos reales, línea en blanco entre secciones, consentimientos al final', () => {
    const msg = wa.contactMessage(contactFull)
    assert.equal(
      msg,
      [
        '¡Hola! Quisiera contactar a Plagastop desde su página web.',
        '',
        '*DATOS DE CONTACTO*',
        'Nombre: Martín Ibáñez',
        'Correo: martin.ibanez@correo.cl',
        'Teléfono: +56 41 210 4508',
        'Área: Secretaría',
        '',
        '*MENSAJE*',
        'Necesito el certificado de la fumigación del 3 de noviembre.',
        '',
        '¿Me lo pueden enviar? Gracias.',
        '',
        CONSENT,
      ].join('\n'),
    )
  })

  test('el texto tiene saltos de línea reales y ninguna secuencia literal \\n', () => {
    const msg = wa.contactMessage(contactFull)
    assert.ok(msg.includes('\n'))
    assert.ok(msg.includes('\n\n'))
    assert.ok(!msg.includes('\\n'))
  })

  test('teléfono vacío: no aparece la línea ni valores vacíos/undefined/null', () => {
    const msg = wa.contactMessage({ ...contactFull, telefono: '   ' })
    assert.ok(!msg.includes('Teléfono'))
    assert.ok(!/undefined|null/.test(msg))
    assert.ok(!/^(?!Documentos:$).*: *$/m.test(msg), 'ninguna línea "Etiqueta:" sin valor (salvo el título Documentos:)')
    assert.ok(!msg.includes('\n\n\n'), 'sin líneas en blanco dobles')
  })

  test('área Comercial se identifica', () => {
    assert.ok(wa.contactMessage({ ...contactFull, area: 'comercial' }).includes('\nÁrea: Comercial\n'))
  })
})

describe('mensaje de cotización', () => {
  test('todos los campos reales, agrupados, con párrafos normalizados', () => {
    const msg = wa.quoteMessage(quoteFull)
    assert.equal(
      msg,
      [
        '¡Hola! Quisiera solicitar una cotización a Plagastop desde su página web.',
        '',
        '*DATOS DEL SERVICIO*',
        'Servicio: Control de roedores',
        'Tipo de instalación: Planta de alimentos',
        'Comuna o ciudad: Concepción, Biobío',
        'Urgencia: Tengo una fecha de embarque o auditoría',
        '',
        '*DATOS DE CONTACTO*',
        'Nombre: José Ñúñez',
        'Empresa: Alimentos Bío-Bío & Cía. Ltda.',
        'Cargo: Jefa de Aseguramiento de Calidad',
        'Correo: jose.nunez@alimentosbiobio.cl',
        'Teléfono: +56 9 8765 4321',
        '',
        '*OBSERVACIONES*',
        'Bodega de 1.200 m² con señales de roedores.',
        'Auditoría el 15/12, ¿pueden venir antes?',
        '',
        'Segundo párrafo: 3 accesos.',
        '',
        CONSENT,
      ].join('\n'),
    )
  })

  test('opcionales vacíos (urgencia, cargo, observaciones): se omiten sin dejar títulos ni huecos', () => {
    const msg = wa.quoteMessage({ ...quoteFull, urgencia: '', cargo: '', mensaje: '' })
    assert.ok(!msg.includes('Urgencia') && !msg.includes('Cargo') && !msg.includes('OBSERVACIONES'))
    assert.ok(!/undefined|null/.test(msg) && !/^(?!Documentos:$).*: *$/m.test(msg) && !msg.includes('\n\n\n'))
    assert.ok(msg.includes('Teléfono: +56 9 8765 4321\n\n--------------------\n*CONSENTIMIENTOS*'))
  })

  test('cotización extensa: conserva todos los párrafos', () => {
    const long = Array.from({ length: 12 }, (_, i) => `Párrafo ${i + 1}: detalle técnico con ñ y tildes (área, bodega, fosfina).`).join('\n\n')
    const msg = wa.quoteMessage({ ...quoteFull, mensaje: long })
    assert.ok(msg.includes(long))
    assert.equal(textOf(wa.whatsappFormUrl(msg)), msg)
  })
})

describe('enlace de WhatsApp', () => {
  test('https://wa.me/56977937824?text= con %0A y decodificación idéntica', () => {
    for (const msg of [wa.contactMessage(contactFull), wa.quoteMessage(quoteFull)]) {
      const url = wa.whatsappFormUrl(msg)
      assert.ok(url.startsWith('https://wa.me/56977937824?text='))
      assert.ok(url.includes('%0A'), 'saltos de línea codificados como %0A')
      assert.ok(url.includes('%0A%0A'), 'líneas en blanco codificadas como %0A%0A')
      assert.ok(!/\s/.test(url), 'la URL no contiene espacios ni saltos sin codificar')
      assert.equal(textOf(url), msg, 'decodeURIComponent devuelve exactamente el mensaje')
      assert.equal(url.split('?text=').length, 2, 'se codifica una sola vez')
    }
  })

  test('sin emojis ni «�»; tildes, ñ, ¡ y ¿ intactos', () => {
    const msg = wa.quoteMessage({
      ...quoteFull,
      nombre: 'Ñandú 👤 Pérez',
      mensaje: 'Hay ratas 🐀 en la bodega 🇨🇱 👍🏽\n¿Cuándo pueden venir? 👨‍👩‍👧',
    })
    const text = textOf(wa.whatsappFormUrl(msg))
    assert.ok(!text.includes('\uFFFD'))
    assert.ok(!/\p{Extended_Pictographic}|\p{Regional_Indicator}/u.test(text), 'ningún emoji en el mensaje')
    assert.ok(!/\u200D|\uFE0F/.test(text), 'sin uniones ni selectores de variación')
    assert.ok(text.includes('Nombre: Ñandú Pérez'))
    assert.ok(text.includes('Hay ratas en la bodega\n¿Cuándo pueden venir?'))
    for (const word of ['¡Hola!', 'cotización', 'página', 'Concepción', 'Ñandú', 'Bío-Bío', 'Cía.', 'Cuándo', 'Pérez']) {
      assert.ok(text.includes(word), word)
    }
  })

  test('consentimientos completos: cada aceptación con su propia fecha y hora, versiones y enlaces', () => {
    const text = textOf(wa.whatsappFormUrl(wa.contactMessage(contactFull)))
    assert.ok(text.endsWith(CONSENT))
    assert.ok(!/servidor/i.test(text), 'no afirma un registro de servidor')
  })

  test('los servidores de WhatsApp devuelven el texto intacto (sin «�»)', async (t) => {
    if (process.env.WHATSAPP_OFFLINE === '1') return t.skip('WHATSAPP_OFFLINE=1')
    const msg = wa.quoteMessage(quoteFull)
    let res
    try {
      res = await fetch(wa.whatsappFormUrl(msg), { redirect: 'manual', signal: AbortSignal.timeout(10_000) })
    } catch {
      return t.skip('sin conexión a internet')
    }
    const location = res.headers.get('location') ?? ''
    assert.ok(location.includes('text='), `wa.me debería redirigir con el texto (HTTP ${res.status})`)
    const received = new URL(location, 'https://api.whatsapp.com').searchParams.get('text')
    assert.equal(received, msg, 'el texto que reenvía wa.me es idéntico al generado')
  })
})
