import logo from '~/assets/brand/plagastop-logo.png'
import logoNegative from '~/assets/brand/plagastop-logo-negativo.png'

/** Logo oficial (PNG con transparencia, 1182 × 427). Pendiente: versión vectorial real. */
export function Logo({ negative, height = 34 }: { negative?: boolean; height?: number }) {
  return (
    <img
      src={negative ? logoNegative : logo}
      alt="Plagastop"
      width={Math.round((1182 / 427) * height)}
      height={height}
    />
  )
}
