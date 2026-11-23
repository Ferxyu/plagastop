// Prueba de envío real contra el endpoint publicado (envía correos de verdad a los destinatarios configurados).
//
//   node server/probar-envio.mjs https://plagastop.cl            → las 3 rutas (cotización, comercial, secretaría)
//   node server/probar-envio.mjs https://plagastop.cl secretaria → solo una: cotizacion | comercial | secretaria
//
// Cada correo lleva "[PRUEBA]" en el nombre y una referencia para encontrarlo en la bandeja.
// Ver docs/formularios-produccion.md, sección 7.

const [base, only] = process.argv.slice(2)
if (!base) {
  console.error('Uso: node server/probar-envio.mjs <https://dominio> [cotizacion|comercial|secretaria]')
  process.exit(1)
}
const endpoint = new URL('/api/enviar.php', base).toString()
const origin = new URL(base).origin
const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ')

const cases = {
  cotizacion: {
    kind: 'cotizacion',
    instalacion: 'bodegas-y-centros-logisticos',
    servicio: 'manejo-integrado-de-plagas',
    comuna: 'Concepción',
    urgencia: 'preventivo',
    nombre: `[PRUEBA] Cotización ${stamp}`,
    empresa: 'Prueba interna Plagastop',
    cargo: 'Prueba',
    correo: 'web@plagastop.cl',
    telefono: '+56 9 7793 7824',
    mensaje: 'Correo de prueba del formulario de cotización. No requiere respuesta.',
  },
  comercial: {
    kind: 'contacto',
    area: 'comercial',
    nombre: `[PRUEBA] Contacto comercial ${stamp}`,
    correo: 'web@plagastop.cl',
    telefono: '',
    mensaje: 'Correo de prueba del formulario de contacto (Área Comercial). No requiere respuesta.',
  },
  secretaria: {
    kind: 'contacto',
    area: 'secretaria',
    nombre: `[PRUEBA] Contacto secretaría ${stamp}`,
    correo: 'web@plagastop.cl',
    telefono: '',
    mensaje: 'Correo de prueba del formulario de contacto (Secretaría). No requiere respuesta.',
  },
}

const selected = only ? { [only]: cases[only] } : cases
if (only && !cases[only]) {
  console.error(`Caso desconocido: ${only}`)
  process.exit(1)
}

let failed = 0
for (const [name, data] of Object.entries(selected)) {
  const headers = { Origin: origin, Accept: 'application/json' }
  const t = await fetch(`${endpoint}?accion=token`, { headers })
  const tj = await t.json().catch(() => null)
  if (!t.ok || !tj?.token) {
    console.log(`✗ ${name}: no se obtuvo token (HTTP ${t.status}) ${JSON.stringify(tj)}`)
    failed++
    continue
  }
  await new Promise((r) => setTimeout(r, 3500))
  const id = crypto.randomUUID()
  const started = Date.now()
  const r = await fetch(endpoint, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, terminos: new Date().toISOString(), privacidad: new Date().toISOString(), version_terminos: '2026-11-11', version_privacidad: '2026-11-11', page: '/prueba', sitio_web: '', ps_token: tj.token, ps_id: id }),
  })
  const j = await r.json().catch(() => null)
  const ms = Date.now() - started
  if (r.ok && j?.ok === true) {
    console.log(`✓ ${name}: aceptado por el servidor en ${ms} ms · referencia ${id.slice(0, 8).toUpperCase()}`)
  } else {
    console.log(`✗ ${name}: HTTP ${r.status} ${JSON.stringify(j)}`)
    failed++
  }
}
console.log('\n"Aceptado" solo significa que el SMTP recibió el correo. Confirma que llegó a cada bandeja (sección 7).')
process.exit(failed ? 1 : 0)
