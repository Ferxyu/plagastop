import { useEffect, type ReactNode } from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from 'react-router'
import displayFontUrl from '@fontsource/anton/files/anton-latin-400-normal.woff2?url'
import textFontUrl from '@fontsource/fira-sans/files/fira-sans-latin-400-normal.woff2?url'
import textBoldFontUrl from '@fontsource/fira-sans/files/fira-sans-latin-600-normal.woff2?url'
import labelFontUrl from '@fontsource/fira-sans-condensed/files/fira-sans-condensed-latin-600-normal.woff2?url'
// Solo el subconjunto latino: cubre todo el español (á, ñ, ü, ¿, ¡, comillas, guiones). Los archivos
// completos traían además @font-face de cirílico, griego, vietnamita y latin-ext que el sitio no usa.
// Pesos en uso: Anton 400; Fira Sans 400/500/600; Fira Sans Condensed 500/600 (etiquetas y eyebrows).
import '@fontsource/anton/latin-400.css'
import '@fontsource/fira-sans/latin-400.css'
import '@fontsource/fira-sans/latin-500.css'
import '@fontsource/fira-sans/latin-600.css'
import '@fontsource/fira-sans-condensed/latin-500.css'
import '@fontsource/fira-sans-condensed/latin-600.css'
import './styles/tokens.css'
import './styles/base.css'
import type { Route } from './+types/root'
import { SiteHeader } from '~/components/layout/SiteHeader'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { MobileActionBar } from '~/components/layout/MobileActionBar'
import { WhatsAppButton } from '~/components/layout/WhatsAppButton'
import { CursorDot } from '~/components/motion/CursorDot'
import { useReveal } from '~/components/motion/useReveal'
import { usePointerFx } from '~/components/motion/usePointerFx'
import { ButtonLink } from '~/components/ui/Button'
import { captureAttribution } from '~/lib/forms'
import { initAnalytics } from '~/lib/analytics'

// Fuentes de la primera pantalla (titular Anton, texto 400, botones 600 y eyebrows Condensed 600): se piden junto al HTML en vez de esperar
// al CSS, y así no se recoloca el texto del hero al llegar (CLS). El resto de los pesos carga bajo demanda.
export const links: Route.LinksFunction = () => [
  { rel: 'preload', href: displayFontUrl, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'preload', href: textFontUrl, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'preload', href: textBoldFontUrl, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'preload', href: labelFontUrl, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'icon', href: `${import.meta.env.BASE_URL}favicon.svg`, type: 'image/svg+xml' },
  { rel: 'apple-touch-icon', href: `${import.meta.env.BASE_URL}apple-touch-icon.png` },
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CL">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export interface RouteHandle {
  chrome?: 'full' | 'landing'
  /** El header se superpone transparente sobre un hero oscuro (home). */
  overlayHeader?: boolean
  hideActionBar?: boolean
}

export default function App() {
  const matches = useMatches()
  const handle = (matches.at(-1)?.handle ?? {}) as RouteHandle
  const chrome = handle.chrome ?? 'full'
  useReveal()
  usePointerFx()

  useEffect(() => {
    captureAttribution()
    initAnalytics()
  }, [])

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <div className="scroll-progress" aria-hidden />
      <SiteHeader variant={chrome} overlay={handle.overlayHeader} />
      <main id="contenido">
        <Outlet />
      </main>
      <SiteFooter variant={chrome} />
      {chrome === 'full' && !handle.hideActionBar && <MobileActionBar />}
      <WhatsAppButton />
      <CursorDot />
    </>
  )
}

/**
 * Pantalla de carga para rutas sin página estática (p. ej. un artículo publicado en WordPress después
 * del último build): se muestra mientras el navegador trae los datos. Las páginas prerenderizadas no la usan.
 */
export function HydrateFallback() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="section">
        <div className="container" role="status" aria-live="polite">
          <p className="lead">Cargando…</p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="section">
        <div className="container" style={{ display: 'grid', gap: 'var(--s-5)', justifyItems: 'start' }}>
          <h1>{notFound ? 'Esta página no existe' : 'Algo salió mal'}</h1>
          <p className="lead">
            {notFound
              ? 'Puede que el enlace haya cambiado. Revisa nuestros servicios o vuelve al inicio.'
              : 'Ocurrió un error al cargar la página. Inténtalo de nuevo en unos segundos.'}
          </p>
          <ButtonLink to="/" arrow>
            Ir al inicio
          </ButtonLink>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
