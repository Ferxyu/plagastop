/**
 * Formatea un número E.164 chileno para lectura. Celulares con prefijo internacional (+56 9 7793 7824);
 * fijos con el código de área entre paréntesis, como se marcan en Chile ((41) 210 4508).
 * Los enlaces siguen usando el E.164 completo (tel:+56412104508) para que la llamada funcione desde cualquier lugar.
 */
export function formatPhone(e164: string) {
  const digits = e164.replace(/\D/g, '')
  if (digits.length !== 11 || !digits.startsWith('56')) return e164
  if (digits.startsWith('569')) {
    return `+56 9 ${digits.slice(3, 7)} ${digits.slice(7)}`
  }
  // Santiago usa código de área de un dígito
  if (digits.startsWith('562')) {
    return `(2) ${digits.slice(3, 7)} ${digits.slice(7)}`
  }
  return `(${digits.slice(2, 4)}) ${digits.slice(4, 7)} ${digits.slice(7)}`
}

export const telHref = (e164: string) => `tel:${e164}`

export function mailHref(email: string, subject?: string) {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`
}

/** Enlace de WhatsApp (wa.me) con un mensaje inicial opcional. */
export function whatsappHref(e164: string, message?: string) {
  const number = e164.replace(/\D/g, '')
  return message ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/${number}`
}
