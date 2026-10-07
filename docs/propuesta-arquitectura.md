# Plagastop · Propuesta de arquitectura, UX y sistema visual

Etapa 1: definición, sin código. Base de datos: [PRODUCT.md](../PRODUCT.md) (contenido verificado del sitio actual + brief).

> **Decisiones aprobadas (2026-10-06):** dirección visual **B · Plano de control** · stack **React Router v7 (modo framework, prerender)** · estilos **CSS Modules + tokens**.

> **Actualización (2026-10-06):** Plagastop **no usa WhatsApp**; todo lo referido a WhatsApp en este documento queda descartado (la barra móvil es Cotizar · Llamar · Correo). Horario 9:00–18:00 h. Cobertura confirmada: desde Ñuble hasta Los Lagos. Stack implementado con React Router **v8** (versión vigente; mismo modo framework). En el hero, el detalle del punto activo se muestra como leyenda bajo el plano.

> Convenciones de este documento
> - **[Confirmar]** = dato que debe entregar Plagastop antes de publicarse. No se inventa.
> - Los textos de ejemplo (titulares, botones) son **borradores** de tono, no copy final.

---

## 0. Tres decisiones previas que condicionan todo

**1. Una SPA de Vite no es suficiente para SEO.** Una app React renderizada solo en el navegador entrega HTML vacío al primer request. Google la indexa, pero tarde y peor, y los crawlers de redes sociales (Open Graph para Meta Ads/LinkedIn/WhatsApp) no ejecutan JavaScript. Recomendación: **React Router v7 en modo framework**. Sigue siendo React + TypeScript + Vite (mismo stack), pero agrega:
- `prerender` de todas las páginas estáticas a HTML en build (servicios, industrias, empresa, contacto, landings).
- `meta` por ruta (title, description, canonical, OG) y JSON-LD en el HTML servido.
- `loader` por ruta, donde más adelante se conectará WordPress sin tocar los componentes.
- Para el blog: prerender en build + webhook de WordPress que dispara un redeploy al publicar, o SSR en un hosting compatible (Vercel, Netlify, Cloudflare).

Alternativa más liviana: `vite-react-ssg` sobre la base actual. Funciona, pero es menos estándar y tiene menos recorrido para SSR del blog. **Necesito tu aprobación sobre esto antes de programar.**

**2. El logo ya define el sistema.** Wordmark negro extendido + símbolo de **tres nodos unidos** en verde `#CCE70B`. Ese símbolo es, literalmente, una red de puntos conectados: lo mismo que un programa MIP sobre una instalación (estaciones de control unidas por una ruta de inspección). Es el recurso de marca más valioso disponible y lo uso como eje del sistema gráfico.

**3. Faltan pruebas reales.** El sitio actual no tiene cifras de clientes, casos, testimonios, logos de clientes ni fotografía propia. La arquitectura deja esos bloques diseñados pero **ocultos hasta tener material real**; nada se rellena con datos ficticios. Lo verificable hoy (1985, Res. SAG 2732/2021, SNS 36365/2013, PEC Degesch, hitos ISO) es suficiente para un bloque de confianza sólido.

---

## 1. Estructura de páginas (sitemap)

### Análisis de la estructura sugerida

`Inicio / Empresa / Servicios / Industrias / Blog / Contacto / Cotización` es una buena base. Ajustes:

| Cambio | Motivo |
|---|---|
| **Industrias al mismo nivel que Servicios** (ya estaba, se refuerza) | El comprador B2B busca por su rubro ("control de plagas bodega", "control de plagas planta de alimentos"). Industria × servicio es la matriz de interlinking. |
| **Nueva página "Acreditaciones"** separada de Empresa | Compras y Calidad piden documentación antes de contratar. Concentra resoluciones, autorizaciones y certificados descargables. Es la página que se envía a un auditor. |
| **"Blog" pasa a llamarse "Recursos"** en el menú (URL `/blog`) | "Recursos" suena B2B y deja espacio para guías y normativa además de artículos. |
| **Cotización como ruta propia `/cotizar`**, no solo dentro de Contacto | Separa la intención de compra de la consulta general: mejor medición y mejor destino para campañas. |
| **Landings de campaña en `/lp/*`** | Sin navegación completa, `noindex`, una sola acción. |
| **Se eliminan** Galería, COVID-19 y Noticias | Galería → fotografía dentro de servicios e industrias. COVID-19 → la sanitización vive como servicio. Noticias → Recursos. |
| **Residencial: una sola página**, fuera del menú principal | Existe como servicio, pero no debe definir el tono. Se enlaza desde el footer y desde Servicios. |

### Sitemap propuesto

```
/                                   Inicio
/servicios                          Hub de servicios
  /servicios/manejo-integrado-de-plagas         MIP (servicio insignia B2B)
  /servicios/control-de-roedores
  /servicios/control-de-insectos
  /servicios/sanitizacion
  /servicios/fumigacion-de-granos-almacenados   (con laboratorio móvil)
  /servicios/tratamientos-fitosanitarios-sag    (exportación / importación)
  /servicios/medicion-de-gases-gas-free         (contenedores y naves)
  /servicios/tratamientos-portuarios-y-buques
  /servicios/control-de-plagas-residencial      (fuera del menú principal)
/industrias                         Hub de industrias
  /industrias/industria-alimentaria
  /industrias/restaurantes-y-food-service
  /industrias/bodegas-y-centros-logisticos
  /industrias/puertos-y-comercio-exterior
  /industrias/agroindustria-y-granos
  /industrias/forestal
  /industrias/plantas-industriales
  /industrias/comercio-y-retail
/empresa                            Historia, misión, método, equipo
/acreditaciones                     Resoluciones, autorizaciones, certificados
/blog                               Recursos (WordPress headless, fase 2)
  /blog/[slug]
  /blog/categoria/[slug]
/contacto                           Todas las vías de contacto por área + mapa
/cotizar                            Formulario de cotización
/cotizar/gracias                    Confirmación + evento de conversión
/lp/[slug]                          Landings de campaña (noindex)
/privacidad                         Política de privacidad y datos
/sitemap.xml · /robots.txt
```

### Páginas individuales de servicio (prioridad SEO)

| Prioridad | Servicio | Búsqueda que captura (ejemplos) |
|---|---|---|
| 1 | Manejo Integrado de Plagas | "programa MIP empresas", "control de plagas industrial" |
| 1 | Tratamientos fitosanitarios SAG | "fumigación exportación SAG", "tratamiento cuarentenario" |
| 1 | Control de roedores | "desratización empresas", "control de roedores bodega" |
| 2 | Fumigación de granos almacenados | "fumigación de granos", "fumigación silos" |
| 2 | Medición de gases (Gas Free) | "gas free contenedores", "medición fosfina contenedor" |
| 2 | Tratamientos portuarios y buques | "fumigación de bodegas de naves" |
| 2 | Control de insectos | "control de cucarachas restaurante", "desinsectación" |
| 3 | Sanitización | "sanitización empresas" |
| 3 | Residencial | "control de plagas Concepción" |

**[Confirmar]** Que cada servicio exista tal como está nombrado, y si hay otros no publicados hoy (control de aves, NIMF-15 en embalajes de madera, termitas). No se agregan sin confirmación.

**Fase 2, sujeta a confirmar cobertura:** páginas locales (`/control-de-plagas/concepcion`, `/talcahuano`, `/los-angeles`…) para SEO local. Hoy el sitio solo afirma "sur de Chile".

### Interlinking

- Servicio ↔ Industria: cada servicio enlaza a las industrias donde aplica y cada industria a sus servicios recomendados. Esto se genera desde los datos (ver §5), no a mano.
- Cada artículo del blog declara un servicio y una industria relacionados, y termina con un CTA hacia esas páginas.
- Breadcrumbs en todas las páginas internas, con schema `BreadcrumbList`.
- Footer con enlaces a todos los servicios e industrias (rastreo completo).

### Schema markup por tipo de página

| Página | Schema |
|---|---|
| Global | `Organization` + `LocalBusiness` (dirección, teléfonos, `areaServed`, `foundingDate: 1985`, redes) |
| Servicio | `Service` (provider, areaServed) + `FAQPage` + `BreadcrumbList` |
| Industria | `WebPage` + `BreadcrumbList` (+ `FAQPage` si aplica) |
| Artículo | `Article` / `BlogPosting` con `author` |
| Contacto | `ContactPage` + `ContactPoint` por área |

---

## 2. Jerarquía de contenido

### Home: arquitectura sección por sección

El orden responde a las 5 preguntas del visitante: qué hacen → qué problemas resuelven → para qué industrias → por qué confiar → cómo cotizar. Ninguna sección existe solo para rellenar.

| # | Sección | Objetivo | Contenido |
|---|---|---|---|
| 1 | **Header** | Orientar y dejar la acción siempre visible | Logo · Servicios (menú) · Industrias (menú) · Empresa · Recursos · Contacto · teléfono comercial · **[Solicitar cotización]** |
| 2 | **Hero** | Responder "qué hacen y para quién" en 5 segundos e iniciar la cotización ahí mismo | H1 con el beneficio para la empresa (borrador: *"Control de plagas para operaciones que no pueden detenerse"*). Bajada: prevención y control para industria, alimentos, logística y puertos, desde 1985. **Inicio del formulario dentro del hero**: dos selectores (*tipo de instalación* + *qué necesitas*) → continúa en `/cotizar` con esos datos precargados. CTA secundario: *Hablar con un especialista* (teléfono comercial). Visual: fotografía industrial real + el recurso gráfico de la dirección elegida. |
| 3 | **Franja de acreditación** | Confianza inmediata, verificable | `Desde 1985` · `Res. SAG 2732/2021` · `SNS 36365/2013` · `Programa PEC Degesch` → enlace a /acreditaciones. Solo datos reales. |
| 4 | **Problemas que resolvemos** | Hablar del problema del cliente, no de la plaga | 4–5 situaciones de negocio: auditoría o certificación próxima · exigencia de la autoridad sanitaria · exportación que requiere tratamiento SAG · continuidad operativa e inocuidad · prevención continua. Cada una lleva a su servicio. |
| 5 | **Servicios** | Mostrar el alcance técnico | 6–8 servicios con una línea de valor cada uno y enlace a su página. MIP destacado como servicio insignia. CTA: *Cotizar un servicio*. |
| 6 | **Industrias** | Que el visitante se reconozca | Selector por rubro: cada uno con foto, 2–3 riesgos típicos y los servicios recomendados. Enlace a la página de la industria. |
| 7 | **Cómo trabajamos (protocolo)** | Mostrar método = control | Pasos numerados: 01 Evaluación en terreno → 02 Diagnóstico y plan → 03 Implementación → 04 Monitoreo y registros → 05 Informes y certificados. **[Confirmar]** que refleja el proceso real. CTA: *Solicitar evaluación*. |
| 8 | **Capacidades técnicas** | Lo que la competencia genérica no tiene | Laboratorio móvil para granos · Medición Gas Free en contenedores y naves · Tratamientos portuarios y en buques · Autorización SAG para exportación. Bloque fotográfico de gran formato. |
| 9 | **Datos destacados** | Respaldar con cifras | Hoy solo hay datos verificables: *desde 1985*, *primera empresa del rubro con ISO 9001 en Chile (2006)* **[confirmar vigencia y redacción]**. Espacios previstos para clientes activos, regiones, servicios por año **[Confirmar]**. Si no llegan cifras, la sección se fusiona con la 8. |
| 10 | **Casos de éxito / clientes** | Prueba social B2B | **Oculta hasta tener material real.** Formato previsto: industria → desafío → solución → resultado. |
| 11 | **Recursos** | SEO + autoridad | 3 artículos recientes (WordPress en fase 2). Oculta mientras no haya artículos. |
| 12 | **Preguntas frecuentes** | Resolver objeciones antes del contacto | 5–6 preguntas B2B: ¿entregan certificados y registros para auditorías? ¿qué productos usan y están autorizados? ¿frecuencia de visitas? ¿atienden fuera de Concepción? ¿tiempo de respuesta ante una emergencia? Respuestas **[Confirmar]**. Con schema FAQ. |
| 13 | **Cierre de conversión** | Última acción clara | Formulario corto completo + todas las vías: teléfonos por área, correos, WhatsApp, dirección. Cumple el requisito de que, si no usa el formulario, vea todos los contactos. |
| 14 | **Footer** | Rastreo, contacto y legal | Servicios, industrias, empresa, contactos por área, dirección, redes, acreditaciones, privacidad. |

**CTAs en la Home:** hero (primario + secundario), servicios, protocolo, cierre, header fijo y, en mobile, la barra inferior. **Confianza:** franja 3, protocolo 7, capacidades 8, datos 9, casos 10, FAQ 12.

### Plantilla de página de servicio

1. Breadcrumb
2. Hero de servicio: H1 = nombre del servicio + contexto ("Manejo Integrado de Plagas para empresas"), bajada, CTA *Cotizar este servicio* (precarga el servicio en el formulario), fotografía.
3. Qué es y cuándo se necesita (el problema del cliente)
4. Qué incluye (alcance técnico, entregables: registros, informes, certificados)
5. Cómo se realiza (protocolo específico)
6. Normativa / autorizaciones asociadas (solo las reales)
7. Industrias donde se aplica (interlinking)
8. FAQ del servicio
9. CTA contextual con formulario corto
10. Servicios relacionados

### Plantilla de página de industria

1. Breadcrumb → 2. Hero del rubro (foto del sector, H1 "Control de plagas para bodegas y centros logísticos") → 3. Riesgos típicos del rubro → 4. Exigencias que el cliente debe cumplir **[confirmar normativa por rubro]** → 5. Servicios recomendados → 6. Cómo trabajamos en este tipo de instalación → 7. Caso del rubro (cuando exista) → 8. FAQ → 9. CTA contextual.

### Otras páginas

- **Empresa:** propósito → historia como línea de tiempo (1985, 1999, 2003, 2006, 2009 + hitos recientes **[Confirmar]**) → misión y valores → método de trabajo → equipo/instalaciones **[Confirmar]** → CTA.
- **Acreditaciones:** cada resolución o certificado como ficha (emisor, número, año, alcance, PDF descargable **[Confirmar vigencias]**). Nota: OHSAS 18001 fue reemplazada por ISO 45001; no se publica como vigente sin confirmarlo.
- **Contacto:** formulario general + **una tarjeta por área** (Comercial, Operaciones, Prevención, Documentación, Secretaría) con teléfono, correo y WhatsApp, más dirección, mapa (carga diferida) y horario **[Confirmar]**.
- **Cotizar:** formulario en 2 pasos + columna de confianza (acreditaciones, qué pasa después, teléfono directo).
- **Landing `/lp/*`:** header mínimo (logo + teléfono), hero con formulario visible sin hacer scroll, 3 razones, acreditación, FAQ corta, formulario repetido. Una sola acción.

---

## 3. Sistema visual inicial

Base común a las tres direcciones del §7. Lo que cambia entre direcciones es la composición y el recurso gráfico, no estos fundamentos.

### Color

| Token | Valor | Uso |
|---|---|---|
| `--ps-ink` | `#0A0B0B` | Texto principal, fondos oscuros, botón secundario |
| `--ps-graphite` | `#1C1F22` | Secciones oscuras, footer |
| `--ps-graphite-2` | `#2B3035` | Superficies sobre grafito, bordes en oscuro |
| `--ps-steel` | `#5B636B` | Texto secundario sobre blanco (≥ 5.9:1) |
| `--ps-mist` | `#A9AFB5` | Texto secundario sobre oscuro, íconos inactivos |
| `--ps-line` | `#E1E4E7` | Bordes y divisores |
| `--ps-paper` | `#F3F4F5` | Fondo alterno de secciones |
| `--ps-white` | `#FFFFFF` | Fondo base |
| `--ps-lime` | **`#CCE70B`** | Acento de marca (muestreado del logo) |
| `--ps-lime-press` | `#B5CE00` | Hover/pressed del acento |
| `--ps-error` | `#C2361F` | Solo errores de formulario |

Los grises tienen un leve tinte frío para acompañar al lima sin ensuciarlo. **[Confirmar]** el pantone/CMYK oficial si existe manual de marca.

**Proporción objetivo:** ~65% blanco y gris claro · ~28% negro y grafito · **≤7% lima**.

**Uso correcto del lima**
- ✅ Botón primario (fondo lima + texto negro: contraste 15:1)
- ✅ Indicadores, puntos de control, números de paso, estado activo de menú y tabs, foco sobre oscuro, íconos destacados sobre negro, subrayados de énfasis
- ✅ Sobre negro/grafito: el lima rinde al máximo (15:1)
- ❌ **Nunca texto lima sobre blanco** (1.4:1, ilegible). Sobre blanco, el lima va solo como relleno con texto negro encima o como elemento gráfico no textual de apoyo.
- ❌ Fondos lima de sección completa, degradados lima, lima con transparencia como "glow"
- ❌ Más de un elemento lima dominante por viewport

### Tipografía

El wordmark es una sans **extendida** de esquinas redondeadas. Recomiendo una familia variable con eje de ancho para que los titulares tengan ese mismo aire sin copiar el logo:

- **Archivo** (Google Fonts, variable: peso 100–900, ancho 62–125%). Titulares en **ancho expandido (≈115–125%), peso 600–700**, que dialogan con el logo. Texto corrido en ancho normal, peso 400. Datos y códigos en ancho condensado con cifras tabulares (`font-variant-numeric: tabular-nums`). Una sola familia: menos peso de carga, máxima coherencia. Autoalojada (woff2 con subset latin + latin-ext) para no depender de Google en tiempo de carga.
- Alternativa si se busca un texto corrido más humanista: Archivo para titulares + **Source Sans 3** para texto.

**Escala (fluida con `clamp`, mobile → desktop)**

| Rol | Tamaño | Interlínea | Peso / ancho |
|---|---|---|---|
| Display (hero) | 44 → 84 px | 1.0 | 700 / 120% |
| H1 interior | 36 → 60 px | 1.05 | 700 / 115% |
| H2 sección | 28 → 44 px | 1.1 | 650 / 112% |
| H3 | 20 → 26 px | 1.2 | 600 / 100% |
| Lead | 18 → 21 px | 1.5 | 400 |
| Cuerpo | 16 → 17 px | 1.6 | 400 |
| Small / meta | 14 px | 1.45 | 500 |
| Dato grande | 48 → 96 px | 0.95 | 700 / 75% condensado, tabular |

Largo de línea de texto: 60–72 caracteres.

### Espaciado y grilla

- Base 4 px. Escala: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160.
- Ritmo vertical de secciones: 96–160 px en desktop, 64–80 px en mobile. Más aire sobre un título que bajo él.
- Grilla de 12 columnas, contenedor máx. 1320 px, margen lateral 20 px (mobile) / 40 px (tablet) / 64 px (desktop), gutter 24–32 px.
- "Romper la grilla": la fotografía puede sangrar hasta el borde de la ventana desde el contenedor, y bloques de dato o tarjetas pueden montarse 48–96 px sobre una foto. Una ruptura por sección como máximo.

### Forma

- **Border radius:** 4 px en inputs, botones y tarjetas; 8 px en contenedores de imagen grandes; círculo completo solo en los nodos e indicadores (eco directo del símbolo). Sin píldoras genéricas.
- **Bordes:** 1 px `--ps-line` como estructura principal. La jerarquía se construye con borde, espacio y tipografía, no con sombra.
- **Sombra:** una sola, sutil, reservada para elementos flotantes (menú desplegable, barra mobile). Ninguna en tarjetas.

### Botones

| Variante | Estilo | Uso |
|---|---|---|
| Primario | Fondo lima, texto negro 600, 48 px de alto, radio 4, ícono flecha → | *Solicitar cotización* (una vez por viewport) |
| Secundario | Fondo negro, texto blanco (sobre claro) / borde blanco (sobre oscuro) | *Hablar con un especialista* |
| Terciario | Texto negro + subrayado lima de 2 px que crece en hover | "Ver servicio", enlaces en tarjetas |
| Ícono | Cuadrado 44×44 mínimo | Llamar, WhatsApp, menú |

Estados: hover (lima → `--ps-lime-press`, la flecha se desplaza 4 px), foco visible (anillo de 2 px negro con offset 2 px sobre claro, lima sobre oscuro), deshabilitado, cargando (spinner dentro del botón, el texto se mantiene).

### Tarjetas

- **Servicio:** fondo blanco, borde 1 px, padding 32, ícono de línea, título H3, una línea de valor, enlace terciario. Hover: borde grafito + un nodo lima que aparece en la esquina. Sin sombra y sin elevación.
- **Industria:** fotografía 4:3 + título sobre franja inferior sólida (sin degradado oscuro sobre la foto).
- **Dato:** número grande condensado + etiqueta + fuente del dato.
- **Caso (futuro):** industria · desafío · solución · resultado, con foto.

### Iconografía

- Línea de 1.5 px, grilla de 24 px, terminaciones redondeadas (coherentes con las esquinas del wordmark). Base: **Lucide** (MIT, tree-shakeable).
- Set propio de ~12 íconos técnicos con el mismo trazo: estación de cebo, trampa de luz, contenedor, nave, silo/grano, planta de alimentos, bodega, documento/certificado, medidor de gas, laboratorio, ruta de inspección, nodo.
- **Prohibido:** insectos o roedores caricaturizados. Si una plaga debe representarse (contenido técnico de blog), se hace con ilustración técnica sobria, nunca como protagonista.

### Fotografía

- **Temas:** naves industriales, bodegas con racks, andenes de carga, líneas de producción de alimentos, cocinas profesionales, puertos y contenedores, silos, técnicos con EPP trabajando, inspección con linterna y registros, estaciones de control numeradas, tablet o carpeta de registros.
- **Tratamiento:** luz natural o industrial fría, encuadres amplios y ordenados, simetría, profundidad. Gradación neutra y ligeramente desaturada para convivir con negro, blanco y lima. Sin filtros de color ni duotonos lima.
- **Prioridad absoluta: una sesión fotográfica propia** (técnicos con uniforme Plagastop en instalaciones reales de clientes, con permiso). Es el activo que más diferencia frente a la competencia. Mientras tanto se usa stock industrial de alta calidad, marcado internamente como provisional.
- **Evitar:** plagas en primer plano, personas sonriendo a cámara con fondo blanco, trajes de protección tipo "película de contagio", hogares.

### Ilustración

- Dibujo técnico de línea (plantas y cortes de instalaciones, isometrías simples) en grafito de 1–1.5 px, con **nodos lima** marcando puntos de control. Es el lenguaje gráfico propio que nace del símbolo del logo.
- Nada de ilustración plana tipo "startup", personajes ni blobs.

### Animación

- Duraciones: 150 ms (hover), 240 ms (despliegues), 400–600 ms (entradas de sección). Curva `cubic-bezier(0.2, 0, 0, 1)`.
- Entradas de sección: opacidad + desplazamiento de 12 px, una sola vez, con el contenido visible por defecto si falla el JS.
- Una interacción firma por dirección (ver §7), orquestada y no repartida en todos los elementos.
- `prefers-reduced-motion`: sin desplazamientos y sin animaciones de trazado; solo cambios de opacidad.
- Sin parallax pesado, sin contadores animados, sin cursores custom.

### Responsive

- Mobile-first. Breakpoints: 640 · 960 · 1280 · 1600.
- Menús de Servicios e Industrias: mega-menú en desktop; en mobile, drawer a pantalla completa con acordeones y los contactos al pie.
- **Barra inferior fija en mobile:** `Cotizar` (lima) · `Llamar` · `WhatsApp`. Aparece tras el primer scroll y se oculta al abrir el teclado de un formulario.
- Tablas técnicas: se convierten en listas apiladas en mobile, sin scroll horizontal.
- Áreas táctiles de 44 px como mínimo.

### Accesibilidad (WCAG 2.2 AA)

Contrastes verificados en los tokens, foco siempre visible, HTML semántico (un solo H1 por página), formularios con labels reales y errores anunciados (`aria-live`), menús operables por teclado, imágenes con alt descriptivo y `lang="es-CL"`.

---

## 4. Componentes

Separados por necesidad real. Los marcados *Fase 2* se diseñan, pero no se construyen hasta tener contenido.

### Base (UI)
| Componente | Nota |
|---|---|
| `Button` / `LinkButton` | 3 variantes + ícono; un solo componente |
| `Icon` | Lucide + set propio |
| `Field` (`Input`, `Select`, `Textarea`, `Checkbox`) | Label, ayuda, error y estados integrados |
| `Accordion` | Base de FAQ y del menú mobile |
| `Container` / `Section` | Ritmo vertical y fondos (blanco/paper/grafito) |
| `SectionHeader` | Kicker opcional + H2 + bajada + acción; se usa en todas las secciones |

### Layout
`SiteHeader` (con `MegaMenu`) · `MobileNav` · `SiteFooter` · `Breadcrumbs` (con schema) · `MobileActionBar` · `LandingHeader` (versión mínima para `/lp`).

### Secciones
| Componente | Necesario | Comentario |
|---|---|---|
| `Hero` | ✅ | Variantes: `home` (con `QuickQuote`), `service`, `industry`, `landing` |
| `CredentialStrip` | ✅ | Acreditaciones reales, enlaza a /acreditaciones |
| `ProblemList` | ✅ | Problemas de negocio → servicios |
| `ServiceGrid` + `ServiceCard` | ✅ | |
| `IndustryExplorer` | ✅ | Selector de rubros (tabs accesibles); en el hub se usa `IndustryCard` |
| `ProcessSteps` | ✅ | Protocolo numerado |
| `CapabilityFeature` | ✅ | Bloque foto grande + texto (laboratorio móvil, Gas Free, puertos) |
| `StatBlock` | ⚠️ | Solo con cifras reales; si no hay, no se muestra |
| `FAQ` | ✅ | Con schema `FAQPage` |
| `CTASection` | ✅ | Variantes: banda simple / con formulario corto |
| `ContactChannels` | ✅ | Tarjetas por área: teléfono, correo, WhatsApp |
| `Timeline` | ✅ | Solo en Empresa |
| `CredentialCard` | ✅ | Ficha de acreditación con descarga |
| `RelatedLinks` | ✅ | Interlinking servicio ↔ industria |
| `CaseStudyCard` | *Fase 2* | Con casos reales |
| `Testimonial` / `ClientLogos` | *Fase 2* | Solo con permiso y material real |
| `BlogCard`, `ArticleBody`, `AuthorBox` | *Fase 2* | WordPress |

### Formularios
`QuickQuote` (hero, 2 selectores) · `QuoteForm` (2 pasos, completo) · `ContactForm` (general) · `FormSuccess`. Validación compartida (un esquema por formulario, con Zod).

### SEO e infraestructura
`Seo` (vía `meta` de cada ruta) · `JsonLd` · `Analytics` (con consentimiento) · `WhatsAppLink` (genera el mensaje contextual).

**Descartados o fusionados:** `StatCard` como grilla de cuatro números genéricos (cliché que exige cifras que no tenemos; reemplazado por `StatBlock` condicional), `Testimonials` en fase 1 y carruseles en general (baja interacción, mala accesibilidad).

---

## 5. Estructura de carpetas

Asumiendo React Router v7 en modo framework (Vite):

```
plagastop-web/
├─ app/
│  ├─ root.tsx                     Layout global, fuentes, Organization JSON-LD
│  ├─ routes.ts                    Definición de rutas
│  ├─ routes/
│  │  ├─ home.tsx
│  │  ├─ servicios._index.tsx
│  │  ├─ servicios.$slug.tsx       Genera las páginas desde content/services
│  │  ├─ industrias._index.tsx
│  │  ├─ industrias.$slug.tsx
│  │  ├─ empresa.tsx
│  │  ├─ acreditaciones.tsx
│  │  ├─ contacto.tsx
│  │  ├─ cotizar.tsx
│  │  ├─ cotizar.gracias.tsx
│  │  ├─ blog._index.tsx           Fase 2 (WordPress)
│  │  ├─ blog.$slug.tsx
│  │  ├─ blog.categoria.$slug.tsx
│  │  ├─ lp.$slug.tsx              Landings de campaña
│  │  ├─ privacidad.tsx
│  │  ├─ sitemap[.]xml.tsx         Generado desde content + CMS
│  │  └─ robots[.]txt.tsx
│  ├─ components/
│  │  ├─ ui/                       Button, Icon, Field, Accordion, Container, Section, SectionHeader
│  │  ├─ layout/                   SiteHeader, MegaMenu, MobileNav, SiteFooter, Breadcrumbs, MobileActionBar, LandingHeader
│  │  ├─ sections/                 Hero, CredentialStrip, ServiceGrid, IndustryExplorer, ProcessSteps, CapabilityFeature, FAQ, CTASection, ContactChannels, Timeline...
│  │  ├─ forms/                    QuickQuote, QuoteForm, ContactForm, FormSuccess
│  │  └─ blog/                     BlogCard, ArticleBody, AuthorBox (fase 2)
│  ├─ content/                     ÚNICA fuente de verdad del contenido estático (TS tipado)
│  │  ├─ company.ts                Datos de empresa, áreas de contacto, redes, dirección
│  │  ├─ credentials.ts            Resoluciones y certificados
│  │  ├─ services/                 Un archivo por servicio (slug, SEO, secciones, FAQ, industrias relacionadas)
│  │  ├─ industries/               Un archivo por industria
│  │  ├─ navigation.ts             Menús derivados de services/industries
│  │  ├─ faqs.ts
│  │  └─ landings/                 Una configuración por campaña
│  ├─ lib/
│  │  ├─ seo/                      buildMeta(), canonical, jsonld builders, breadcrumbs
│  │  ├─ cms/                      Interfaz BlogSource + implementación WordPress (REST o WPGraphQL) + mock local
│  │  ├─ forms/                    Esquemas Zod, submit, captura de UTM
│  │  ├─ analytics/                Eventos tipados, GTM/GA4, consentimiento
│  │  └─ contact/                  tel:, mailto:, WhatsApp con mensaje contextual
│  ├─ styles/
│  │  ├─ tokens.css                Color, tipografía, espaciado, radios, motion
│  │  ├─ base.css                  Reset, tipografía base, foco
│  │  └─ utilities.css
│  └─ assets/
│     ├─ brand/                    Logo SVG (positivo/negativo), símbolo
│     ├─ illustrations/            Planos y diagramas técnicos
│     └─ photos/                   Fotografía optimizada (AVIF/WebP + fallback)
├─ public/
│  ├─ fonts/                       Archivo (woff2, subset)
│  ├─ og/                          Imágenes Open Graph por página
│  └─ docs/                        PDFs de acreditaciones
├─ docs/                           Esta propuesta y decisiones
├─ PRODUCT.md
└─ .env.example                    WP_API_URL, FORM_ENDPOINT, GTM_ID, WHATSAPP_NUMBER
```

**Principios:**
- **El contenido manda:** servicios e industrias se definen una vez en `content/`. Desde ahí se generan las rutas, los menús, el sitemap, el interlinking y el schema. Agregar un servicio es agregar un archivo.
- **El CMS detrás de una interfaz:** los componentes consumen `BlogSource` (`getPosts`, `getPost`, `getCategories`). Hoy responde un mock; en fase 2 se cambia por la implementación de WordPress sin tocar UI ni rutas.
- **Landings como configuración:** una campaña nueva es un archivo en `content/landings/` que compone secciones existentes.
- **Estilos:** CSS Modules + tokens en variables CSS (sin dependencia de framework de estilos, carga mínima). Si el equipo prefiere Tailwind v4, los tokens se mapean igual; es una decisión de equipo **[Confirmar]**.

---

## 6. Conversión y experiencia de usuario

### Recorridos principales

```
Google (orgánico) → Página de servicio o industria → CTA contextual (servicio precargado) → /cotizar → /cotizar/gracias
Google/Meta Ads   → /lp/[campaña] → formulario visible sin scroll → /cotizar/gracias
Directo / marca   → Home → QuickQuote en hero → /cotizar (paso 2) → /cotizar/gracias
Urgencia          → cualquier página → Llamar / WhatsApp (barra mobile o header)
Investigación     → Blog → CTA del artículo → servicio relacionado → /cotizar
```

### CTAs

| Nivel | Texto (borrador) | Destino |
|---|---|---|
| Primario | **Solicitar cotización** | `/cotizar` (con contexto precargado) |
| Secundario | **Hablar con un especialista** | `tel:` Área Comercial (+56 9 7793 7483); en desktop muestra el número |
| Contextual | *Cotizar Manejo Integrado de Plagas*, *Solicitar evaluación de mi bodega* | `/cotizar?servicio=…&industria=…` |
| Complementario | *Escríbenos por WhatsApp* | WhatsApp con mensaje prellenado |

### Formulario de cotización (2 pasos)

1. **Tu necesidad:** tipo de instalación (select) · servicio (select, precargado) · comuna/ciudad · urgencia (preventivo / problema activo / exportación con fecha).
2. **Tus datos:** nombre · empresa · cargo (opcional) · correo · teléfono · mensaje (opcional) · consentimiento.

Sin RUT ni campos que frenen. Validación en línea, errores en español claro y el progreso se conserva si el usuario vuelve atrás. Campos ocultos: página de origen, UTM y `gclid`/`fbclid` para atribuir las campañas. La página de gracias explica qué pasa después, con plazo de respuesta **[Confirmar]**, contacto directo y enlaces útiles. **[Confirmar]** destino de los leads: correo (Resend o similar), CRM (HubSpot) o ambos.

### Ubicación de formularios

- Hero de Home: inicio del formulario (2 selectores).
- `/cotizar`: formulario completo.
- Final de cada servicio, industria y artículo: formulario corto.
- `/lp/*`: visible sin hacer scroll y repetido al final.
- `/contacto`: formulario general + todas las vías por área.

### WhatsApp

- **[Confirmar]** número oficial de WhatsApp Business y qué área lo atiende (sugerido: Comercial).
- Mensaje prellenado según la página: *"Hola, necesito información sobre {servicio} para {tipo de instalación}."*
- Ubicación: barra inferior en mobile, header de contacto y bloques de CTA en desktop. **Sin la burbuja verde flotante genérica**: rompe la paleta, tapa contenido y se asocia a sitios residenciales. Se integra con los colores de la marca, usando el ícono oficial de WhatsApp a tamaño legible.
- Opcional: un número por área en la página de contacto.

### Comportamiento mobile

- Header compacto (logo + llamar + menú).
- Barra inferior fija con Cotizar · Llamar · WhatsApp.
- `QuickQuote` del hero se apila en vertical; los selectores usan controles nativos.
- `tel:` y `mailto:` en todo número y correo.
- Formularios de una columna, `inputmode` correcto por campo y teclado que no tapa el botón.

### Medición

Eventos: `cta_click` (con ubicación), `quote_start`, `quote_step_2`, `quote_submit`, `contact_submit`, `tel_click`, `whatsapp_click`, `email_click`. GA4 vía GTM, con conversiones importadas a Google Ads y Meta (vía Conversions API en fase 2). Banner de consentimiento **[Confirmar requisitos legales]**.

---

## 7. Dirección de diseño

Tres direcciones, todas sobre el sistema del §3 (negro, blanco, grises, lima `#CCE70B` como acento, fotografía industrial). Difieren en concepto, composición y recurso gráfico.

### A · Informe técnico

**Concepto.** El sitio se lee como un informe de servicio impecable: el documento que un responsable de calidad entrega al auditor. Rigor, trazabilidad y datos.

**Composición.** Fondo blanco como papel, con líneas finas de 1 px que forman el marco de cada sección. El marco es la grilla: cada sección abre con una fila de encabezado tipo informe (`SRV-01 · Manejo Integrado de Plagas · Frecuencia quincenal`). En el hero, H1 grande a la izquierda y, a la derecha, una fotografía industrial con **etiquetas técnicas ancladas a puntos de la foto** mediante líneas guía (*"Estación de monitoreo perimetral"*, *"Trampa de luz UV · zona de proceso"*). Bajo el hero, una "ficha" con los datos verificables en cifras tabulares. El protocolo, en pasos numerados 01–05 con su entregable.

**Color.** Blanco y paper dominantes, negro tipográfico, grafito en una o dos bandas. El lima marca lo "conforme": el check, la fila activa, el paso actual y el CTA. Sin colores de estado adicionales salvo el error.

**Fotografía.** Detalle técnico y documentado: estaciones, registros, inspección. Planos medios, nítidos, luz fría.

**Tipografía.** Archivo expandido en titulares; condensado tabular para códigos y datos.

**Sensación.** Precisión, auditabilidad, cumplimiento.

**Ventajas.** Habla el idioma de Calidad, Prevención y Compras. Es muy sistematizable para las páginas de servicio. Se diferencia de la categoría.

**Desventajas.** Puede volverse frío o burocrático. Corre el riesgo de parecerse a un dashboard o a un SaaS, justo lo que quieres evitar. Necesita datos reales abundantes para no verse vacío, y hoy son pocos.

### B · Plano de control

**Concepto.** Plagastop ve tu instalación como un plano de control: zonas, perímetro, puntos de monitoreo numerados y una ruta de inspección que los une. Es la forma real en que se ejecuta un programa MIP, y también es **lo que dibuja el logo**: nodos lima unidos por trazos. El sitio convierte el símbolo en sistema.

**Composición.** Hero con una fotografía amplia de una instalación (bodega o planta) y, superpuesta, una capa de **dibujo técnico en línea fina** registrada sobre la arquitectura de la foto, con 5–6 nodos lima numerados unidos por la ruta. **Interacción firma:** al pasar el cursor o tocar un nodo, este muestra qué se controla ahí (*"03 · Andén de carga: control de roedores, estaciones selladas"*) y enlaza al servicio. En mobile se convierte en una lista numerada sincronizada con el dibujo. El copy y el inicio del formulario viven a la izquierda, sobre blanco.

Ese lenguaje recorre el sitio: cada **página de industria tiene su propio plano** (bodega, planta de alimentos, cocina, puerto, silo) con sus puntos ligados a servicios, lo que resuelve de forma visual el interlinking servicio ↔ industria. Las secciones cierran con un **cajetín**, el bloque de títulos de los planos técnicos, como componente recurrente que lleva la acreditación y el CTA (*"Plano preparado por Plagastop · Res. SAG 2732/2021 · Solicitar evaluación"*). El protocolo se dibuja como una ruta de nodos 01→05.

**Color.** Blanco y paper como papel de plano, grafito para las líneas, negro para el texto y las bandas oscuras (capacidades, footer). El lima aparece **solo** en nodos, ruta activa, estado seleccionado y CTA. Es el uso más disciplinado del acento de las tres opciones.

**Fotografía.** Arquitectura industrial amplia y ordenada, que soporte el dibujo encima: naves, bodegas, andenes, puertos, cocinas industriales. Luz natural. Técnicos en contexto, en planos secundarios.

**Tipografía.** Archivo expandido en titulares y condensado en números de nodo y en el cajetín. La rotulación técnica conecta con el wordmark.

**Sensación.** Control, prevención, método, conocimiento del terreno: *"saben cómo funciona mi instalación"*.

**Ventajas.** Recurso propio e imposible de copiar sin copiar la marca. Explica el MIP sin mostrar plagas. Escala a todas las industrias y servicios. Tiene una interacción firma memorable para la Home. Tono corporativo y moderno sin caer en lo futurista.

**Desventajas.** Requiere producir 5–8 planos ilustrados con criterio, como inversión de diseño. Si se abusa del dibujo, el sitio puede sentirse "de ingeniería" más que de servicio, así que la regla es un plano por página como máximo. La interacción necesita una alternativa accesible (la lista numerada). Familiaridad: el motivo de plano técnico existe en sitios de ingeniería y arquitectura; lo que lo hace propio es que aquí sale del logo y del servicio real.

### C · Corporativo industrial (estándar de la categoría, bien ejecutado)

**Concepto.** El estándar B2B de servicios industriales, sin ironía y con oficio: lo que hacen las grandes empresas globales del rubro.

**Composición.** Hero con fotografía a sangre y overlay oscuro, H1 blanco y dos CTAs. Franja de acreditaciones, grilla de servicios en tarjetas, mosaico de industrias con foto, banda de cifras, casos, CTA en banda oscura y footer.

**Color.** Negro y grafito con más presencia (hero y bandas), blanco en contenido, lima en CTAs e íconos.

**Fotografía.** La protagonista: grandes fotos a sangre.

**Tipografía.** Archivo en ancho normal, jerarquía clásica.

**Sensación.** Solidez, seguridad, escala.

**Ventajas.** Riesgo mínimo, rápido de producir, fácil de mantener y de entender.

**Desventajas.** Es indistinguible de la competencia y es la "plantilla" que pediste evitar. Depende casi por completo de una fotografía excelente que hoy no existe. No usa el activo más fuerte de la marca, el símbolo.

### Recomendación

**B · Plano de control.** Es la única dirección donde la identidad visual, el servicio real y la arquitectura SEO son la misma idea. Los nodos del logo se convierten en puntos de control, los puntos en servicios y los planos por industria en interlinking. Cumple todo el brief: corporativo y moderno, más blanco que negro, lima estratégico, problema empresarial en lugar de plaga, y una interacción firma discreta en vez de efectos. De A toma lo mejor sin cambiar de mundo: el cajetín lleva los datos verificables con el mismo rigor de un informe.

Condición para que funcione: invertir en la producción de los planos ilustrados y en fotografía propia (o stock industrial muy curado al inicio).

> Notas del proceso. Para evitar la respuesta típica de la categoría, se evaluaron además referencias de otros mundos visuales: mapa de orientación, paneles de interfaz, película de 16 mm, impresión risográfica, displays de detectores de partículas. Se descartaron como estética por chocar con la paleta o el tono del brief, pero dejaron disciplinas que se incorporan: **la capa de recorrido sobre una base fija y una leyenda como tabla** (mapa de orientación, absorbido en B); **el marco como grilla** (panel de interfaz); **la secuencia numerada estricta** (película); **el compromiso total con tintas limitadas** (risografía); **las etiquetas ancladas al objeto** (detector).

---

## Pendientes para Plagastop

1. Logo en SVG (positivo y negativo) y manual de marca, si existe.
2. Número de WhatsApp oficial, horario de atención y plazo de respuesta a cotizaciones.
3. Confirmación de la lista de servicios y de los rubros atendidos.
4. Cobertura geográfica real.
5. Vigencia de las certificaciones ISO/OHSAS y PDFs de resoluciones.
6. Cifras reales, clientes (con permiso para mostrarlos), casos y testimonios.
7. Fotografía propia o presupuesto para sesión fotográfica.
8. Destino de los leads (correo, CRM) y herramientas de analítica y publicidad.
9. Respuestas a las preguntas frecuentes.
10. Hosting y dominio (condiciona prerender/SSR del blog).
