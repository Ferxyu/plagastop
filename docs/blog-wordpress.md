# Blog de Plagastop con WordPress headless

WordPress (`cms.plagastop.cl`) se usa **solo para administrar los artículos**. El diseño, la navegación y la presentación viven en este proyecto. La conexión usa la API REST pública de WordPress: no lleva usuarios ni contraseñas.

## 1. Cómo llegan los artículos al sitio

El sitio es **estático**: React Router genera cada ruta como HTML completo al compilar (`ssr: false` + `prerender` en `react-router.config.ts`). Sobre eso, el blog funciona en dos capas:

| Momento | Qué pasa | Para qué |
|---|---|---|
| **Al compilar** | Se piden a WordPress todos los artículos publicados y sus categorías. Se genera una página estática por artículo, se arma `/blog` y se actualiza el sitemap. | SEO: Google y los buscadores con IA ven el contenido completo en el HTML. |
| **En el navegador** | `/blog` consulta WordPress al abrirse y suma los artículos publicados después del último build (y quita los que se despublicaron). Si alguien abre la URL de un artículo nuevo, la página lo trae directo desde la API. | Que un artículo nuevo se vea **de inmediato**, sin tocar código ni recompilar. |

**Importante para SEO:** un artículo publicado después del último build ya se puede leer, pero su página todavía no es estática (la sirve la página de respaldo, con estado HTTP 404). Google lo indexará bien recién después del siguiente build. Por eso conviene automatizar la recompilación (sección 5).

## 2. Qué se muestra

- **Artículos de WordPress** (fuente principal).
- **Artículos editoriales del sitio** (`app/lib/blog/local-posts.ts`): 7 artículos reales con fuentes oficiales citadas, publicados desde el código. Usan las mismas categorías de WordPress. Para mostrar **solo** WordPress: `includeSitePosts: false` en `app/lib/blog/config.ts`. Para migrar uno a WordPress, publícalo allí con el **mismo slug**: prevalece el de WordPress y no se duplica.
- **Artículo destacado:** el que esté marcado en WordPress como "Fijar en la portada"; si no hay ninguno, el más reciente.
- **Filtros:** las categorías de WordPress, con sus nombres y su orden. Solo aparecen las que tienen artículos (por ejemplo, "General" hoy no aparece).
- **Autor:** se muestra el "nombre público" del autor en WordPress solo si parece un nombre de persona (nombre y apellido). Un nombre de usuario como "Blogplagastop" no se muestra; en ese caso el autor es Plagastop (también en los datos estructurados).

## 3. Configuración

| Dónde | Valor |
|---|---|
| `app/lib/blog/config.ts` → `DEFAULT_WP_API_URL` | `https://cms.plagastop.cl/wp-json/wp/v2` (URL base por defecto) |
| Variable de entorno `WP_API_URL` (al compilar) | Opcional: otra instalación, o `off` para no usar WordPress |

No hay credenciales: la API pública entrega solo artículos **publicados**. WordPress ya permite las consultas desde el navegador (CORS), que la carga en vivo necesita.

Si WordPress no responde **al compilar**, el build falla con un mensaje claro y se mantiene la versión publicada anterior. Así no se publica un blog vacío por error. Si no responde **en el navegador**, el blog sigue mostrando los artículos del último build.

## 4. Cómo publicar en WordPress

1. **Entradas → Añadir nueva.**
2. **Título** y contenido. Usa **Encabezado H2 y H3** para los subtítulos. Un H1 dentro del contenido se convierte en H2, porque la página ya tiene un H1, que es el título.
3. **Extracto** (panel lateral): escribe 1 o 2 frases. Es la bajada del artículo, el texto de la tarjeta y la meta descripción para Google. Si se deja vacío, WordPress genera uno largo y cortado.
4. **Imagen destacada** con **texto alternativo**, en la Biblioteca de medios. Se recomienda al menos 1200 × 630 px, porque también es la imagen para redes sociales.
5. **Categoría:** una de las existentes. Se muestra la primera asignada.
6. **Destacar:** "Fijar en la portada", en el panel de visibilidad.
7. **Publicar.** El artículo aparece en `/blog` en cuanto alguien abre la página.

El slug de WordPress es la URL pública: `plagastop.cl/blog/<slug>`.

**No se muestran** (se eliminan al limpiar el HTML): scripts, iframes y videos incrustados, formularios, estilos en línea y atributos de eventos. Párrafos, encabezados, listas, enlaces, imágenes, citas y tablas sí.

## 5. Pendientes (requieren tu autorización o acción)

### 5.1 Evitar contenido duplicado entre cms.plagastop.cl y plagastop.cl

Hoy el WordPress público **es indexable**: sus páginas no tienen `noindex`, su canonical apunta a `cms.plagastop.cl` y publica su propio sitemap (`wp-sitemap.xml`). Solución sin plugins:

- **WordPress → Ajustes → Lectura → "Disuadir a los motores de búsqueda de indexar este sitio"**. Agrega `noindex` a las páginas de WordPress y desactiva su sitemap. **No** bloquea la API (que ya responde con `X-Robots-Tag: noindex`) ni las imágenes, que el sitio sigue cargando.
- Opcional, más adelante: redirigir las páginas públicas de WordPress a su versión en `plagastop.cl/blog/…`. Requiere un plugin o código en el tema, así que se decide aparte.

### 5.2 Recompilar automáticamente (indexación de artículos nuevos)

Para que cada artículo nuevo tenga su página estática, con SEO completo, hay que recompilar después de publicarlo. Opciones:

- **Build programado (más simple, sin plugins):** agregar un `schedule` al workflow de despliegue (`.github/workflows/deploy.yml`):

  ```yaml
  on:
    push:
      branches: [main]
    workflow_dispatch:
    schedule:
      - cron: '0 * * * *'   # cada hora
  ```

- **Build al publicar (inmediato):** un plugin de webhooks en WordPress llama a GitHub (`repository_dispatch`) al publicar o actualizar un artículo. Requiere instalar un plugin y un token de GitHub guardado **solo en WordPress**.

Mientras no se automatice, un artículo nuevo se ve en el sitio de inmediato, pero queda bien indexado recién con el siguiente despliegue (cualquier push a `main` o "Run workflow" en GitHub Actions).

### 5.3 Hosting del sitio React

El dominio canónico configurado es `https://plagastop.cl` (`SITE_URL` en `app/content/company.ts`). El servidor que publique `build/client` debe:

1. Servir `ruta/index.html` para `/ruta/` y **redirigir `/ruta` a `/ruta/`** (GitHub Pages lo hace solo).
2. Responder las rutas inexistentes con `__spa-fallback.html` (en GitHub Pages el workflow ya lo copia como `404.html`). Es lo que permite abrir artículos publicados después del último build.

Hoy el workflow publica en GitHub Pages bajo `/plagastop/`. Si `plagastop.cl` apunta a otro hosting, hay que replicar esos dos puntos.

### 5.4 Otros

- **Nombre público del autor** en WordPress (Usuarios → Perfil): con nombre y apellido, aparecerá como autor en la página y en los datos estructurados.
- **Plugins SEO (opcional):** si se instala Yoast, su título y descripción SEO se usan automáticamente.

## 6. SEO de cada artículo

URL `plagastop.cl/blog/<slug>`, título y meta descripción, canonical a esa URL, Open Graph de tipo artículo (imagen, texto alternativo, fechas de publicación y modificación, sección), Twitter Card, datos estructurados `BlogPosting` y `BreadcrumbList`, un solo H1, subtítulos del contenido como H2/H3, imagen con su texto alternativo y entrada en `sitemap.xml` con su fecha de modificación.

## 7. Archivos

| Archivo | Rol |
|---|---|
| `app/lib/blog/config.ts` | URL de WordPress y opciones del blog |
| `app/lib/blog/wordpress.ts` | Cliente de la API (artículos, artículo por slug, categorías) y traducción al modelo |
| `app/lib/blog/live.ts` | Consultas desde el navegador (artículos nuevos) |
| `app/lib/blog/sanitize.ts` | Limpieza del HTML (sin scripts ni atributos peligrosos) |
| `app/lib/blog/local-posts.ts` | Artículos editoriales del sitio |
| `app/lib/blog/types.ts`, `utils.ts` | Modelo de datos y utilidades |
| `app/lib/cms.ts` | Combina WordPress y los artículos del sitio |
| `app/routes/blog._index.tsx` | `/blog`: lista del build y artículos nuevos en vivo |
| `app/routes/blog.$slug.tsx` | Artículo: estático o, si es nuevo, cargado desde la API |
| `app/root.tsx` | Pantalla de carga para páginas sin versión estática |
