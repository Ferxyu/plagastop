/** Formatea un número E.164 chileno para lectura: +56 9 7793 7483 / +56 41 210 4508. */
export function formatPhone(e164: string) {
  const digits = e164.replace(/\D/g, '')
  if (digits.startsWith('569') && digits.length === 11) {
    return `+56 9 ${digits.slice(3, 7)} ${digits.slice(7)}`
  }
  if (digits.startsWith('56') && digits.length === 11) {
    return `+56 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  return e164
}

export const telHref = (e164: string) => `tel:${e164}`

export function mailHref(email: string, subject?: string) {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`
}
