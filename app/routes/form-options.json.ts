import { facilityOptions, serviceOptions, urgencyOptions } from '~/content/quote'

const toMap = (options: { value: string; label: string }[]) =>
  Object.fromEntries(options.map((o) => [o.value, o.label]))

/**
 * Catálogo de opciones del formulario de cotización para el endpoint PHP (api/enviar.php). Se genera al
 * compilar desde las mismas listas que usa el sitio, así el servidor valida los valores permitidos y escribe
 * en el correo la etiqueta legible. Queda en api/lib, carpeta bloqueada al navegador por .htaccess.
 */
export function loader() {
  const body = JSON.stringify({
    facility: toMap(facilityOptions),
    service: toMap(serviceOptions),
    urgency: toMap(urgencyOptions),
  })
  return new Response(body, { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
}
