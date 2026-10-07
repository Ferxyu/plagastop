# plagastop.cl

Sitio corporativo de Plagastop: React 19 + TypeScript + Vite + React Router v8 (modo framework, prerender estático).

## Comandos

```bash
npm run dev        # desarrollo
npm run typecheck  # tipos de rutas + TypeScript
npm run lint
npm run build      # genera build/client con HTML prerenderizado por ruta, sitemap.xml y robots.txt
npm run preview    # sirve build/client (usar URLs con barra final: /servicios/x/)
```

## Estructura

- `app/content/`: única fuente de verdad del contenido (empresa, contactos, cobertura, servicios, industrias, planos, landings). Agregar un servicio o una industria = agregar una entrada; rutas, menús, sitemap e interlinking se generan desde ahí.
- `app/routes/`: páginas (`routes.ts` las declara; `react-router.config.ts` lista las que se prerenderizan).
- `app/components/`: `ui/`, `layout/`, `plan/` (plano de control interactivo), `sections/`, `forms/`.
- `app/lib/`: SEO y schema (`seo.ts`), formularios y atribución UTM (`forms.ts`), analítica (`analytics.ts`), blog (`cms.ts`, interfaz lista para WordPress headless).
- `app/styles/`: tokens de marca y estilos base.

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_FORM_ENDPOINT` | URL que recibe los formularios (POST JSON). Sin ella, el formulario muestra un error con los contactos directos. |
| `VITE_GTM_ID` | Google Tag Manager. Activar solo junto con el banner de consentimiento. |

## Despliegue

Hosting estático (Netlify, Vercel, Cloudflare Pages) publicando `build/client`. Configurar `__spa-fallback.html` como respuesta 404/fallback para rutas no prerenderizadas.

Documentos: `PRODUCT.md` (contexto de producto), `docs/propuesta-arquitectura.md` (arquitectura y decisiones).
