import logo1x from '~/assets/brand/plagastop-logo-120.png?no-inline'
import logo2x from '~/assets/brand/plagastop-logo-240.png?no-inline'
import logo3x from '~/assets/brand/plagastop-logo-360.png?no-inline'
import logoNegative1x from '~/assets/brand/plagastop-logo-negativo-120.png?no-inline'
import logoNegative2x from '~/assets/brand/plagastop-logo-negativo-240.png?no-inline'
import logoNegative3x from '~/assets/brand/plagastop-logo-negativo-360.png?no-inline'

/** Proporción del logo oficial (PNG con transparencia, original 1182 × 427 en app/assets/brand). */
const RATIO = 1182 / 427

/**
 * Logo oficial. Se muestra a 42 px de alto como máximo, así que se sirven copias de 120/240/360 px de
 * ancho (1x/2x/3x, ~2-4 KB) en vez del original de 1182 px (9-20 KB). Pendiente: versión vectorial real.
 * `lazy`: para la copia que arranca oculta (logo oscuro del header superpuesto), que no compite con la visible.
 * `priority`: el logo visible del encabezado, que suele ser el LCP en móvil (el póster del hero ocupa toda la
 * pantalla y Chrome no lo cuenta; el titular entra con animación).
 */
export function Logo({
  negative,
  height = 34,
  lazy,
  priority,
}: {
  negative?: boolean
  height?: number
  lazy?: boolean
  priority?: boolean
}) {
  const [x1, x2, x3] = negative ? [logoNegative1x, logoNegative2x, logoNegative3x] : [logo1x, logo2x, logo3x]
  return (
    <img
      src={x1}
      srcSet={`${x1} 1x, ${x2} 2x, ${x3} 3x`}
      alt="Plagastop"
      width={Math.round(RATIO * height)}
      height={height}
      loading={lazy ? 'lazy' : undefined}
      fetchPriority={priority ? 'high' : undefined}
      decoding={lazy ? 'async' : undefined}
    />
  )
}
