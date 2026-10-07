import type { ReactNode } from 'react'
import type { ServiceIconName } from '~/content/services'

/**
 * Íconos técnicos propios: trazo 1.5 en grilla de 24, terminaciones redondeadas
 * (coherentes con el wordmark). Representan el objeto de control, nunca la plaga.
 */
const paths: Record<ServiceIconName, ReactNode> = {
  // Red de nodos: el símbolo del logo como programa
  mip: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5.5" cy="18" r="2.5" />
      <circle cx="18.5" cy="18" r="2.5" />
      <path d="M12 7.5v5M12 12.5l-5 3.5M12 12.5l5 3.5" />
    </>
  ),
  // Estación de control sellada
  rodent: (
    <>
      <rect x="3.5" y="8" width="17" height="10" rx="1.5" />
      <path d="M7 18v-4h4v4M3.5 11h17" />
      <circle cx="16" cy="14.5" r="1" />
    </>
  ),
  // Trampa de monitoreo / luz
  insect: (
    <>
      <rect x="4" y="4" width="16" height="11" rx="1.5" />
      <path d="M7.5 7.5h9M7.5 11h9M8 15v4M16 15v4M6 19h12" />
    </>
  ),
  // Aspersión
  sanitize: (
    <>
      <path d="M9 21h6V11a3 3 0 0 0-3-3v0a3 3 0 0 0-3 3z" />
      <path d="M12 8V5h3M15 5h2M18.5 3.5l1.5-1M18.5 6.5l1.5 1M19.5 5h1.5" />
    </>
  ),
  // Silo
  grain: (
    <>
      <path d="M6 9a6 4 0 0 1 12 0v12H6z" />
      <path d="M6 13h12M6 17h12M4 21h16" />
    </>
  ),
  // Timbre / certificado
  export: (
    <>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M15 3v3h3M9 10h6M9 13.5h4" />
      <circle cx="14" cy="17.5" r="1.8" />
    </>
  ),
  // Medidor
  gas: (
    <>
      <path d="M4.5 16a7.5 7.5 0 1 1 15 0" />
      <path d="M12 16l3.5-4.5M4.5 16h2M17.5 16h2M12 8.5v1.5M7 10.5l1 1M17 10.5l-1 1M3 19.5h18" />
    </>
  ),
  // Nave
  port: (
    <>
      <path d="M3 15h18l-2.5 5h-13z" />
      <path d="M6 15v-4h8v4M9 11V7h3v4M16 15v-2.5h3V15" />
    </>
  ),
  home: (
    <>
      <path d="M4 11l8-6.5 8 6.5" />
      <path d="M6 9.5V20h12V9.5M10 20v-5h4v5" />
    </>
  ),
}

export function ServiceIcon({ name, size = 24 }: { name: ServiceIconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  )
}
