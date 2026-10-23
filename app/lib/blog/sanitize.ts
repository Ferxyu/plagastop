/**
 * Sanitizador de HTML por lista blanca, para el contenido que llega desde WordPress.
 * Corre al compilar (sin DOM disponible), por eso no usa DOMPurify ni agrega dependencias.
 *
 * Qué garantiza:
 * - Solo pasan las etiquetas y atributos permitidos; todo se vuelve a escribir desde cero y escapado.
 * - script, style, iframe, formularios, svg y similares se eliminan junto con su contenido.
 * - href/src solo aceptan http(s), rutas relativas, anclas, mailto: y tel: (nunca javascript: ni data:).
 * - Las etiquetas quedan balanceadas: un cierre suelto no puede romper el diseño de la página.
 * - h1 se convierte en h2: la página del artículo ya tiene su único H1 (el título).
 * - Imágenes con carga diferida; enlaces que abren pestaña nueva llevan rel="noopener noreferrer".
 */

const ALLOWED: Record<string, string[]> = {
  p: [], br: [], hr: [], h2: ['id'], h3: ['id'], h4: ['id'], h5: ['id'], h6: ['id'],
  strong: [], b: [], em: [], i: [], u: [], s: [], sub: [], sup: [], mark: [], small: [], span: [],
  div: [], abbr: ['title'], time: ['datetime'], code: [], pre: [], kbd: [],
  a: ['href', 'title', 'target', 'rel'],
  ul: [], ol: ['start', 'reversed'], li: [], dl: [], dt: [], dd: [],
  blockquote: ['cite'], q: ['cite'], cite: [],
  figure: [], figcaption: [],
  img: ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'title'],
  table: [], caption: [], thead: [], tbody: [], tfoot: [], tr: [], colgroup: [], col: ['span'],
  th: ['colspan', 'rowspan', 'scope'], td: ['colspan', 'rowspan'],
}

/** Se eliminan con todo su contenido. */
const DROP_WITH_CONTENT = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template', 'form', 'input', 'button',
  'select', 'textarea', 'svg', 'math', 'canvas', 'audio', 'video', 'frame', 'frameset', 'head', 'title',
])

const VOID = new Set(['br', 'hr', 'img', 'col', 'wbr'])
const RENAME: Record<string, string> = { h1: 'h2' }

const TOKEN = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g
const ATTR = /([^\s"'=<>`/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

function escapeText(text: string) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeAttr(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function decodeAttr(value: string) {
  return value
    .replace(/&#(\d+);?/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);?/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

/** URL segura: http(s), relativa o ancla; mailto/tel solo en enlaces. */
export function safeUrl(raw: string, allowContact = false) {
  // Se ignoran espacios y caracteres de control que algunos navegadores descartan antes del esquema
  // eslint-disable-next-line no-control-regex
  const url = raw.replace(/[\u0000- \u007f-\u009f]/g, '')
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(url)?.[1]?.toLowerCase()
  if (!scheme) return raw.trim()
  if (scheme === 'http' || scheme === 'https') return raw.trim()
  if (allowContact && (scheme === 'mailto' || scheme === 'tel')) return raw.trim()
  return undefined
}

function cleanAttributes(tag: string, source: string) {
  const allowed = ALLOWED[tag]
  const out: [string, string][] = []
  for (const m of source.matchAll(ATTR)) {
    const name = m[1].toLowerCase()
    if (!allowed.includes(name)) continue
    let value = decodeAttr(m[2] ?? m[3] ?? m[4] ?? '')
    if (name === 'href') {
      const url = safeUrl(value, true)
      if (!url) continue
      value = url
    } else if (name === 'src' || name === 'cite') {
      const url = safeUrl(value)
      if (!url) continue
      value = url
    } else if (name === 'srcset') {
      const candidates = value.split(',').map((c) => c.trim()).filter(Boolean)
      if (!candidates.every((c) => safeUrl(c.split(/\s+/)[0]))) continue
    } else if (name === 'target') {
      if (value !== '_blank') continue
    } else if (['width', 'height', 'colspan', 'rowspan', 'start', 'span'].includes(name)) {
      if (!/^\d{1,5}$/.test(value)) continue
    } else if (name === 'scope') {
      if (!['row', 'col', 'rowgroup', 'colgroup'].includes(value)) continue
    } else if (name === 'id') {
      if (!/^[A-Za-z][\w-]{0,80}$/.test(value)) continue
    }
    out.push([name, value])
  }
  if (tag === 'a' && out.some(([n]) => n === 'target')) {
    const rest = out.filter(([n]) => n !== 'rel')
    rest.push(['rel', 'noopener noreferrer'])
    out.splice(0, out.length, ...rest)
  }
  if (tag === 'img') {
    out.push(['loading', 'lazy'], ['decoding', 'async'])
    if (!out.some(([n]) => n === 'alt')) out.push(['alt', ''])
  }
  return out.map(([n, v]) => (v === '' && n !== 'alt' ? ` ${n}` : ` ${n}="${escapeAttr(v)}"`)).join('')
}

export function sanitizeHtml(html: string) {
  let out = ''
  const stack: string[] = []
  let last = 0
  TOKEN.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = TOKEN.exec(html))) {
    out += escapeText(html.slice(last, m.index))
    last = TOKEN.lastIndex
    if (m[0].startsWith('<!--')) continue

    const closing = m[1] === '/'
    const raw = m[2].toLowerCase()

    if (DROP_WITH_CONTENT.has(raw)) {
      if (!closing && !/\/\s*$/.test(m[3])) {
        // Salta hasta el cierre correspondiente (o hasta el final si no lo hay)
        const end = new RegExp(`</${raw}\\s*>`, 'i')
        const rest = html.slice(last)
        const found = end.exec(rest)
        last += found ? found.index + found[0].length : rest.length
        TOKEN.lastIndex = last
      }
      continue
    }

    const tag = RENAME[raw] ?? raw
    if (!ALLOWED[tag]) continue

    if (closing) {
      const at = stack.lastIndexOf(tag)
      if (at === -1) continue
      while (stack.length > at) out += `</${stack.pop()}>`
      continue
    }

    out += `<${tag}${cleanAttributes(tag, m[3])}>`
    if (!VOID.has(tag)) stack.push(tag)
  }
  out += escapeText(html.slice(last))
  while (stack.length) out += `</${stack.pop()}>`
  return out
}
