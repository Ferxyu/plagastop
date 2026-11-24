import type { ReactNode } from 'react'

export type PestIconName =
  | 'cockroach'
  | 'ant'
  | 'flea'
  | 'bedbug'
  | 'fly'
  | 'mosquito'
  | 'moth'
  | 'spider'
  | 'tick'
  | 'termite'
  | 'wasp'

/**
 * Íconos propios de cada plaga, en el mismo estilo que ServiceIcon (trazo 1.5 en grilla de 24, terminaciones
 * redondeadas). Cada uno destaca el rasgo que distingue a la especie a tamaño pequeño: antenas largas
 * (cucaracha), cintura y antenas acodadas (hormiga), salto (pulga), cuerpo plano y redondo (chinche), alas
 * en V (mosca), probóscide y patas largas (zancudo), alas anchas y antenas plumosas (polilla), ocho patas
 * largas (araña), cuerpo ovalado con escudo y patas cortas (garrapata), mandíbulas y cuerpo sin cintura
 * (termita) y abdomen listado con aguijón (avispa).
 */
const paths: Record<PestIconName, ReactNode> = {
  cockroach: (
    <>
      <ellipse cx="12" cy="14.2" rx="4.2" ry="6" />
      <path d="M7.9 12h8.2M12 12v8" />
      <path d="M10.6 8.4C9.4 5.4 7 3.4 4 2.8M13.4 8.4c1.2-3 3.6-5 6.6-5.6" />
      <path d="M7.9 13 4 11M7.8 16l-4.3 1M8.6 19l-2.8 2.8M16.1 13l3.9-2M16.2 16l4.3 1M15.4 19l2.8 2.8" />
    </>
  ),
  ant: (
    <>
      <circle cx="12" cy="5.4" r="2" />
      <ellipse cx="12" cy="10.4" rx="1.6" ry="2.3" />
      <ellipse cx="12" cy="17.6" rx="3" ry="3.9" />
      <path d="M10.7 4.1 9 2.2 7 2.8M13.3 4.1 15 2.2l2 .6" />
      <path d="M10.5 9.5 6.6 7.2M10.4 11 6 12M10.8 12.4 7.4 16M13.5 9.5l3.9-2.3M13.6 11l4.4 1M13.2 12.4l3.4 3.6" />
    </>
  ),
  flea: (
    <>
      <path d="M7.6 12.6C8.4 7.8 11.6 5 15.4 5.4c3 .3 5 2.8 4.6 6-.4 3.4-3.2 5.2-6.6 5.1l-4-.2" />
      <path d="M7.6 12.6c-1.9-.2-3.4.9-3.6 2.6 1.3.9 3.2 1.2 5.4 1.1" />
      <path d="M4.2 15.4 2.8 17.6M18.4 3.8l-.6 1.8M14.6 3.6l.2 1.8" />
      <path d="M17 15.6l3.8 3.8-3.4 2.4h2.2M13 16.5l.4 2.8-1.6 2.4M9.8 16.3l-.8 2.6-1.6 1.6" />
      <circle cx="6" cy="14" r=".5" />
    </>
  ),
  bedbug: (
    <>
      <ellipse cx="12" cy="14.6" rx="5.5" ry="6" />
      <ellipse cx="12" cy="7.1" rx="1.8" ry="1.4" />
      <path d="M10.9 6.1 9 3.6M13.1 6.1 15 3.6" />
      <path d="M7.5 12.6h9M6.8 15.6h10.4M7.6 18.6h8.8" />
      <path d="M6.9 11.4 4.4 9.8M6.5 15H3.5M7 18.4l-2.5 2M17.1 11.4l2.5-1.6M17.5 15h3M17 18.4l2.5 2" />
    </>
  ),
  fly: (
    <>
      <circle cx="10.4" cy="4.6" r="1.7" />
      <circle cx="13.6" cy="4.6" r="1.7" />
      <ellipse cx="12" cy="9.6" rx="2.6" ry="2.5" />
      <ellipse cx="12" cy="15" rx="2.4" ry="2.9" />
      <path d="M13.8 11.4c2.8.6 6 3.4 6.4 6.6.2 2-2.4 2.4-4 .6-1.4-1.6-2.4-4.2-2.6-6.4M10.2 11.4c-2.8.6-6 3.4-6.4 6.6-.2 2 2.4 2.4 4 .6 1.4-1.6 2.4-4.2 2.6-6.4" />
      <path d="M10.2 8.6 6 7M13.8 8.6 18 7" />
    </>
  ),
  mosquito: (
    <>
      <circle cx="8.2" cy="8.4" r="1.3" />
      <circle cx="11" cy="10.6" r="1.9" />
      <path d="M12.6 11.8 20.5 18" />
      <path d="M7.3 7.6 3 3.8" />
      <path d="M11.8 8.9c1-3 4-5 7.2-5-1 2.6-3.6 4.6-6.6 5.6" />
      <path d="M9.6 12 6.8 16l-1 5M11 12.6l-1 5-2 3.6M12.4 12.2l2.2 4.3v5" />
    </>
  ),
  moth: (
    <>
      <ellipse cx="12" cy="13" rx="1.3" ry="5" />
      <path d="M10.8 9.4C7 8.2 3.6 10 3 13.8c3 1.6 6 2 7.9.9M13.2 9.4C17 8.2 20.4 10 21 13.8c-3 1.6-6 2-7.9.9" />
      <path d="M10.9 15.2c-2.8 1-5 3-5 5.4 2.4 0 4.2-1.4 5.2-3.4M13.1 15.2c2.8 1 5 3 5 5.4-2.4 0-4.2-1.4-5.2-3.4" />
      <path d="M11.3 8.2C10.6 6 9.2 4.5 7.5 4M12.7 8.2c.7-2.2 2.1-3.7 3.8-4.2M9.6 5.4l-.4 1.2M14.4 5.4l.4 1.2" />
    </>
  ),
  spider: (
    <>
      <circle cx="12" cy="15.2" r="3.6" />
      <circle cx="12" cy="9.3" r="2.2" />
      <path d="M10.3 8 7.4 4.4 4.4 4.6M10 9.4 6 7.8 3.4 9.4M10.2 10.6l-4 1.6-1.6 3.6M10.7 11.3l-3 3.6v4.6" />
      <path d="M13.7 8l2.9-3.6 3 .2M14 9.4l4-1.6 2.6 1.6M13.8 10.6l4 1.6 1.6 3.6M13.3 11.3l3 3.6v4.6" />
    </>
  ),
  tick: (
    <>
      <ellipse cx="12" cy="14.3" rx="5" ry="6.4" />
      <path d="M8.6 10.6c1-2.6 5.8-2.6 6.8 0-1 3-5.8 3-6.8 0z" />
      <path d="M10.6 8.2 11 6.6h2l.4 1.6M11.3 6.6V5M12.7 6.6V5" />
      <path d="M7.4 10.6 4.4 8.6M7 13l-3.5-.5M7 15.6l-3.4 1.5M7.8 18l-2.9 2.5M16.6 10.6l3-2M17 13l3.5-.5M17 15.6l3.4 1.5M16.2 18l2.9 2.5" />
    </>
  ),
  termite: (
    <>
      <ellipse cx="12" cy="6.6" rx="2.5" ry="2.8" />
      <path d="M11 4c-.5-1.2-.2-2.1.9-2.6M13 4c.5-1.2.2-2.1-.9-2.6" />
      <path d="M9.8 5.4 6.4 4M14.2 5.4l3.4-1.4" />
      <rect x="9.8" y="9.4" width="4.4" height="3" rx="1.2" />
      <ellipse cx="12" cy="17.2" rx="3" ry="4.6" />
      <path d="M9.3 16h5.4M9.4 18.7h5.2" />
      <path d="M9.8 10.4 6.4 9.4M9.8 11.6l-4 1.5M10.2 12.4l-3 3.6M14.2 10.4l3.4-1M14.2 11.6l4 1.5M13.8 12.4l3 3.6" />
    </>
  ),
  wasp: (
    <>
      <circle cx="12" cy="4.8" r="1.8" />
      <ellipse cx="12" cy="9" rx="2.2" ry="2.2" />
      <path d="M12 11.8c2.6 0 3.4 2.6 3.4 4.6 0 2.8-1.8 4.6-3.4 5.6-1.6-1-3.4-2.8-3.4-5.6 0-2 .8-4.6 3.4-4.6z" />
      <path d="M8.9 15h6.2M9.3 18h5.4M12 22v1.2" />
      <path d="M13.8 8c3-2.5 6.5-2.5 7.2-.5.6 1.8-2.8 3.3-7 2.8M10.2 8c-3-2.5-6.5-2.5-7.2-.5-.6 1.8 2.8 3.3 7 2.8" />
      <path d="M11 3.4 9.5 1.4M13 3.4l1.5-2" />
    </>
  ),
}

export function PestIcon({ name, className }: { name: PestIconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  )
}
