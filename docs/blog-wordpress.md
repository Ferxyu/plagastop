# Blog de Plagastop: arquitectura y conexión con WordPress

Este documento explica cómo funciona el blog (`/blog` y `/blog/:slug`) y los pasos para conectarlo a WordPress cuando esté instalado. WordPress se usa **solo para administrar los artículos**. El diseño, la navegación y la presentación viven en este proyecto.

## 1. Cómo funciona hoy

El sitio es **estático**: React Router compila cada ruta como HTML completo (`ssr: false` + `prerender` en `react-router.config.ts`). Google y los buscadores con IA leen el contenido completo sin ejecutar JavaScript, así que no hace falta migrar a otro framework.

Al compilar:

1. `react-router.config.ts` pide la lista de artículos a la fuente del blog y genera una página por artículo.
2. `/blog` incluye la lista completa (sin el cuerpo de cada artículo). La búsqueda, los filtros y "Cargar más" funcionan en el navegador sobre esa lista.
3. `sitemap.xml` incluye los artículos reales, con su fecha de actualización.

**Consecuencia importante:** un artículo nuevo en WordPress aparece en el sitio **después del siguiente build**. La sección 5 explica cómo automatizarlo.

## 2. Fuentes de datos

Todo pasa por `blog` en `app/lib/cms.ts`. Las rutas y componentes no saben de dónde vienen los artículos.

| Situación | Qué se publica |
|---|---|
| Sin `WP_API_URL` (hoy) | Los artículos del sitio (`app/lib/blog/local-posts.ts`) |
| `WP_API_URL` definida | Los de WordPress **más** los del sitio, ordenados por fecha |

**Artículos del sitio.** Son 7 artículos reales, redactados a partir de fuentes oficiales y técnicas (SAG, Minsal, BCN, FAO, GRDC), que se citan al final de cada uno. Se indexan y entran al sitemap. No atribuyen a Plagastop certificaciones ni resultados: describen normativa y buenas prácticas, y enlazan al servicio relacionado.

**Migrarlos a WordPress (opcional).** Si en WordPress se publica un artículo con el **mismo slug** que uno del sitio, prevalece el de WordPress y no se duplica. Después se puede borrar su entrada de `local-posts.ts`.

## 3. Variables de entorno

Se leen **al compilar**, desde el entorno de la terminal o de GitHub Actions. Un archivo `.env` no sirve, porque Vite solo lo inyecta en el código del navegador. No es secreta.

| Variable | Ejemplo | Uso |
|---|---|---|
| `WP_API_URL` | `https://cms.plagastop.cl/wp-json/wp/v2` | Raíz de la API REST (sin barra final) |

No se usan credenciales: la API pública entrega solo artículos **publicados**. Los borradores y los artículos privados nunca llegan al sitio.

## 4. Pasos para activar WordPress

### 4.1 En WordPress

1. Instalar WordPress en un subdominio, por ejemplo `cms.plagastop.cl`.
2. **Ajustes → Enlaces permanentes:** "Nombre de la entrada". El *slug* de WordPress será la URL: `/blog/<slug>`.
3. Comprobar que la API responde: `https://cms.plagastop.cl/wp-json/wp/v2/posts` debe devolver JSON.
4. Crear las **categorías** (por ejemplo Prevención, Normativa y auditorías, Industria alimentaria). La primera categoría asignada a un artículo es la que se muestra.
5. En cada artículo:
   - **Imagen destacada** con **texto alternativo** (Biblioteca de medios → Texto alternativo). Si falta, se usa el título.
   - **Extracto** propio (opcional; si no, WordPress lo genera).
   - **Fijar en la portada** para que sea el **artículo destacado** de `/blog`. Si ninguno está fijado, se destaca el más reciente.
   - Usar H2 y H3 para los subtítulos. Un H1 dentro del contenido se convierte en H2, porque la página ya tiene un H1, el título.
6. Opcional:
   - **Yoast SEO:** su título y su meta descripción se usan automáticamente. Al título se le quita el sufijo de marca, porque el sitio agrega "| Plagastop".
   - **ACF:** campos `servicio_relacionado` e `industria_relacionada`, con el slug del sitio. Por ejemplo, `control-de-roedores` o `industria-alimentaria`. Muestran un bloque "Para tu empresa" con el enlace al servicio. Los slugs válidos están en `app/content/services.ts` y `app/content/industries.ts`. Para que ACF los exponga en la API hay que activar "Mostrar en la API REST" en el grupo de campos.
7. No hace falta configurar CORS: la API se consulta desde el build, no desde el navegador.

### 4.2 Probar en local

```powershell
$env:WP_API_URL = "https://cms.plagastop.cl/wp-json/wp/v2"
npm run build
npm run preview
```

Abrir `http://localhost:4173/blog/`, con barra final (ver sección 7). Si WordPress no responde, el build **falla con un mensaje claro** en vez de publicar un blog vacío.

### 4.3 En GitHub Actions (producción)

Requiere autorización: modifica la configuración de despliegue y no se ha aplicado.

1. GitHub → Settings → Secrets and variables → Actions → **Variables** → `WP_API_URL`.
2. En `.github/workflows/deploy.yml`, paso "Build website":

```yaml
      - name: Build website
        env:
          DEPLOY_GH_PAGES: 'true'
          WP_API_URL: ${{ vars.WP_API_URL }}
        run: npm run build
```

## 5. Publicar sin tocar código

Como el sitio es estático, publicar en WordPress debe disparar un build. Hay dos opciones, que se pueden combinar:

- **Build programado (más simple):** agregar al workflow un `schedule` (por ejemplo, cada hora). Los artículos aparecen con hasta una hora de retraso.

  ```yaml
  on:
    push:
      branches: [main]
    workflow_dispatch:
    schedule:
      - cron: '0 * * * *'
  ```

- **Build al publicar (inmediato):** un plugin de *webhooks* en WordPress (por ejemplo, WP Webhooks) llama a la API de GitHub (`repository_dispatch`) cada vez que se publica o actualiza un artículo. El workflow escucha `repository_dispatch`. Esto requiere un token de GitHub con permiso mínimo sobre el repositorio, guardado **solo en WordPress** y nunca en este código.

El build tarda unos 2 o 3 minutos.

## 6. Seguridad del contenido

`app/lib/blog/sanitize.ts` limpia el HTML de WordPress al compilar, con una lista blanca:

- Solo pasan las etiquetas de texto, listas, enlaces, imágenes, figuras, citas, código y tablas.
- Se eliminan, con su contenido, `script`, `style`, `iframe`, formularios, `svg` y similares. **Los videos incrustados (YouTube, etc.) no se muestran.** Si se necesitan, habría que agregar un componente específico con dominios permitidos.
- Los atributos `on*` y `style` se descartan. `href` y `src` solo aceptan `http(s)`, rutas relativas, anclas, `mailto:` y `tel:`.
- Las etiquetas quedan balanceadas: HTML mal cerrado no puede romper el diseño de la página.

## 7. Pendientes antes de desplegar

- [ ] Instalar WordPress y definir el dominio de `WP_API_URL`.
- [ ] Autorizar los cambios de `deploy.yml` (variable y reconstrucción automática).
- [ ] Que Plagastop revise los 7 artículos del sitio (`app/lib/blog/local-posts.ts`) antes de publicar: tono, alcance y si quiere sumar experiencia propia.
- [ ] **Barra final en las URL:** el sitio genera `ruta/index.html`. GitHub Pages redirige `/blog/x` a `/blog/x/`. Si se cambia de hosting, configurar esa misma redirección, porque sin ella la página carga con datos de otra ruta y falla. `vite preview` en local tiene este problema: usar URLs con `/` final.
- [ ] Imagen Open Graph por artículo: se usa la imagen destacada. Conviene subirla de al menos 1200 × 630 px.
- [ ] Las imágenes de los artículos se sirven desde el dominio de WordPress. Si se quiere un CDN o una optimización adicional, se decide al instalarlo.

## 8. Archivos

| Archivo | Rol |
|---|---|
| `app/lib/cms.ts` | Combina los artículos del sitio con los de WordPress |
| `app/lib/blog/types.ts` | Modelo de datos independiente de la fuente |
| `app/lib/blog/config.ts` | Configuración central (variables de entorno, tamaños de página) |
| `app/lib/blog/wordpress.ts` | Cliente de la API REST y traducción al modelo |
| `app/lib/blog/sanitize.ts` | Limpieza del HTML |
| `app/lib/blog/local-posts.ts` | Artículos del sitio, con sus fuentes |
| `app/lib/blog/utils.ts` | Fechas, extractos, búsqueda, relacionados |
| `app/routes/blog._index.tsx` | Landing `/blog` |
| `app/routes/blog.$slug.tsx` | Plantilla de artículo |
| `app/components/blog/*` | Tarjeta, destacado, buscador y filtros, imagen, metadatos, CTA y estilos |
