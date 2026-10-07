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
import soraUrl from '@fontsource-variable/sora/files/sora-latin-wght-normal.woff2?url'
import figtreeUrl from '@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2?url'
import '@fontsource-variable/sora/wght.css'
import '@fontsource-variable/figtree/wght.css'
import './styles/tokens.css'
import './styles/base.css'
import type { Route } from './+types/root'
import { SiteHeader } from '~/components/layout/SiteHeader'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { MobileActionBar } from '~/components/layout/MobileActionBar'
import { CursorDot } from '~/components/motion/CursorDot'
import { useReveal } from '~/components/motion/useReveal'
import { ButtonLink } from '~/components/ui/Button'
import { captureAttribution } from '~/lib/forms'
import { initAnalytics } from '~/lib/analytics'

export const links: Route.LinksFunction = () => [
  { rel: 'preload', href: soraUrl, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'preload', href: figtreeUrl, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
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
  hideActionBar?: boolean
}

export default function App() {
  const matches = useMatches()
  const handle = (matches.at(-1)?.handle ?? {}) as RouteHandle
  const chrome = handle.chrome ?? 'full'
  useReveal()

  useEffect(() => {
    captureAttribution()
    initAnalytics()
  }, [])

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader variant={chrome} />
      <main id="contenido">
        <Outlet />
      </main>
      <SiteFooter variant={chrome} />
      {chrome === 'full' && !handle.hideActionBar && <MobileActionBar />}
      <CursorDot />
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
