---
name: Plagastop
description: Control de plagas B2B contado con sus propias cuadrillas y sedes, en un ritmo de sitio de servicios cálido, redondeado y con energía lima.
colors:
  ink: "#0a0b0b"
  graphite: "#1c1f22"
  graphite-2: "#262a2e"
  graphite-3: "#3a4046"
  steel: "#5b636b"
  mist: "#b4bac0"
  line: "#e4e7ea"
  line-strong: "#cfd4d9"
  paper: "#f3f4f5"
  white: "#ffffff"
  lime: "#cce70b"
  lime-press: "#b9d300"
  lime-soft: "#f4f9d8"
  error: "#c2361f"
typography:
  display:
    fontFamily: "'Philosopher', 'Philosopher', system-ui, sans-serif"
    fontSize: "clamp(2.375rem, 1.6rem + 3.3vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "'Philosopher', 'Philosopher', system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 1.5rem + 2.6vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  headline-section:
    fontFamily: "'Philosopher', 'Philosopher', system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 1.4rem + 1.9vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Philosopher', 'Philosopher', system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.04rem + 0.35vw, 1.3125rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  numeral:
    fontFamily: "'Philosopher', 'Philosopher', system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.6rem + 1.4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "'tnum'"
  lead:
    fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans Condensed', system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans Condensed', system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.97rem + 0.15vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'Philosopher', 'Philosopher', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.005em"
rounded:
  md: "16px"
  lg: "28px"
  pill: "999px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
  s-8: "64px"
  s-9: "96px"
  section-y: "clamp(72px, 4.5rem + 4vw, 136px)"
  gutter: "clamp(20px, 4.5vw, 64px)"
  container: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.lime-press}"
    textColor: "{colors.ink}"
  button-primary-lg:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 48px"
    height: "58px"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "50px"
  button-secondary-hover:
    backgroundColor: "{colors.graphite-3}"
    textColor: "{colors.white}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "50px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  button-inverse:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "50px"
  button-inverse-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "52px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "44px"
  chip-hover:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "42px"
  nav-item-hover:
    backgroundColor: "{colors.paper}"
  nav-item-current:
    backgroundColor: "{colors.lime-soft}"
  card-service:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  icon-disc:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "56px"
  faq-item:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  faq-item-dark:
    backgroundColor: "{colors.graphite-2}"
    textColor: "{colors.white}"
  contact-area:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
  quick-quote:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  closing-band:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
---

# Design System: Plagastop

## Overview

**Creative North Star: "La Cuadrilla en Terreno"**

Plagastop se muestra a través de su propia gente y sus propios lugares: técnicos en barcos, silos, bodegas y la sede de Concepción, fotografiados de verdad. Esa fotografía carga la confianza; el sistema la envuelve en un ritmo de sitio de servicios cálido y cercano (referencia fijada por el usuario: adhuntltd.com), traducido a industria B2B con la paleta del logo: tinta y grafito con el lima de la marca como energía.

La página respira en bandas a todo el ancho que alternan blanco, papel gris claro y grafito o tinta, con una sola banda lima de cierre. Todo lo que se toca es redondo: botones píldora, fotos y tarjetas de 28px, discos lima para íconos y checks, insertos circulares de foto recortados con un anillo del color de la sección. El movimiento es parte del mundo: apariciones escalonadas al hacer scroll, contadores que suben, una insignia giratoria y un punto lima que sigue al cursor.

El mundo reemplaza por completo la dirección anterior ("Plano de control", rechazada por el usuario): nada de Archivo expandido, cajetines, plantas de instalación dibujadas como plano técnico ni esquinas de 4px. Tampoco usa imágenes de stock, imágenes de plagas ni pruebas inventadas.

**Key Characteristics:**
- Fotografía real de cuadrillas y sedes Plagastop como protagonista, siempre en marcos de 28px o círculos.
- Bandas completas: blanco y papel alternados con grafito y tinta; una banda lima al cierre.
- Lima como relleno con texto tinta (píldoras, discos de ícono, checks, marcador); como texto solo sobre oscuro.
- Philosopher para titulares y toda etiqueta interactiva; IBM Plex Sans Condensed para lectura.
- Tarjetas planas en reposo con anillo de 1px; se levantan con sombra suave al pasar el cursor.
- Movimiento firma: aparición hacia arriba escalonada, contadores, insignia giratoria y punto lima del cursor.

## Colors

Una base clara y neutra con bandas grafito y tinta, y un único acento de alta energía: el lima del logo.

### Primary
- **Lima Plagastop** (lime): la energía de la marca. Relleno de la acción de cotizar, discos de ícono, checks, el marcador detrás de palabras clave, la línea de cobertura y trayectoria, el punto del cursor, la selección de texto y la banda de cierre.
- **Lima Presionado** (lime-press): hover del botón primario y anillo interior del ítem de navegación actual; borde punteado de los números de paso.
- **Lima Suave** (lime-soft): fondo del ítem de navegación actual, de los íconos del mega menú en reposo, de los números de paso y halo de los puntos lima (punto de la sede en cobertura, punto del rótulo del hero).

### Neutral
- **Tinta** (ink): texto principal, botón secundario, fondo del hero de la Home y bandas `section--ink`; disco del teléfono en el header y de los checks dentro de la banda lima.
- **Grafito** (graphite): bandas oscuras de sección (Por qué, Preguntas), footer, hero de páginas interiores, panel lateral de cotizar y tarjeta de llamada en Pasos.
- **Grafito 2** (graphite-2): superficies elevadas dentro de lo oscuro (ítems de preguntas, áreas de contacto oscuras, franja de contacto del footer); texto secundario sobre lima.
- **Grafito 3** (graphite-3): anillos y separadores sobre grafito; hover del botón secundario.
- **Acero** (steel): bajadas y texto secundario sobre claro.
- **Niebla** (mist): texto secundario sobre oscuro y thumb del scrollbar.
- **Línea** (line) y **Línea Fuerte** (line-strong): anillos de tarjetas en reposo, divisores y bordes de campos.
- **Papel** (paper): banda de sección alternada (`section--paper`), fondo de chips y del hover de navegación.
- **Blanco** (white): fondo base, tarjetas, campos y la barra de cotización rápida.
- **Error** (error): borde y texto de validación.

### Named Rules
**The Lima Es Relleno Rule.** El lima se usa como relleno con texto o ícono tinta. Nunca es texto sobre blanco o papel. Sobre tinta o grafito sí puede ser texto: el marcador en oscuro, el número de pregunta, el teléfono, el rótulo "base" de cobertura y los enlaces del panel de cotizar.

**The Bandas Completas Rule.** Grafito y tinta son fondos de sección a todo el ancho o de paneles cerrados (footer, panel de cotizar, tarjeta de llamada); se alternan con blanco y papel. La banda lima es una sola por página: el cierre.

## Typography

**Display Font:** Philosopher (con Philosopher, system-ui, sans-serif)
**Body Font:** IBM Plex Sans Condensed (con IBM Plex Sans Condensed, system-ui, sans-serif)

**Character:** Philosopher es geométrica y amplia como el wordmark, y da a titulares y botones un tono firme pero cercano; IBM Plex Sans Condensed es cálida y legible para la lectura larga.

### Hierarchy
- **Display** (700, clamp 2.375–4.5rem, 1.04): solo el H1 del hero de la Home.
- **Headline** (700, clamp 2.125–3.5rem, 1.06): H1 de páginas interiores y titular de la banda de cierre.
- **Headline de sección** (700, clamp 1.875–3rem, 1.12): H2 de sección, entre 14ch y 20ch de ancho máximo según la composición.
- **Title** (600, clamp 1.125–1.3125rem, 1.25): H3, nombres de tarjeta, regiones de cobertura, preguntas (1.0625rem).
- **Numeral** (700, clamp 2–2.75rem, 1, cifras tabulares): estadísticas con contador, años de trayectoria y códigos de credencial.
- **Lead** (400, clamp 1.0625–1.25rem, 1.6): bajada en acero (niebla sobre oscuro), máximo 60ch.
- **Body** (400, clamp 1–1.0625rem, 1.65): texto corrido; prosa hasta 70ch.
- **Label** (Philosopher 600, 0.9375rem, -0.005em): botones, navegación, chips, enlaces de texto y "Ver servicio".

### Named Rules
**The Marcador Rule.** Cada titular de sección marca una sola frase clave con `mark`: un trazo lima de resaltador entre el 58% y el 92% de la altura de la línea, detrás del texto tinta. Sobre oscuro el marcador se vuelve texto lima sin fondo; dentro de la banda lima se invierte a caja tinta con texto lima y esquinas de 6px.

**The Philosopher Actúa Rule.** Philosopher lleva titulares y todo lo que se puede tocar (botones, navegación, chips, nombres de tarjeta, enlaces de texto). IBM Plex Sans Condensed lleva lo que se lee.

## Layout

Contenedor de 1280px con gutter fluido (20 a 64px) y secciones con padding vertical fluido (72 a 136px). Escala de espaciado base 4 (4, 8, 12, 16, 24, 32, 48, 64, 96px). Los encabezados de sección van centrados por defecto, alineados a la izquierda o en dos columnas (`split`, titular y bajada lado a lado desde 960px).

Composiciones recurrentes desde 1000px: dos columnas asimétricas foto-texto (5fr/6fr, 5fr/7fr, 1fr/1fr) con 96px de separación; foto principal con un inserto (círculo, insignia o segunda foto) desbordando una esquina. Las grillas de tarjetas pasan de 1 a 2 columnas (640px) y a 4 (1100px); en móvil los servicios se vuelven un carrusel horizontal con snap al 84% de ancho. El mosaico de industrias es de 2 columnas en móvil y 4 en escritorio, con una pieza grande 2×2 y una ancha al cierre cuando están las 8.

Hero de la Home: foto a sangre de la sede con velo de tinta desde la derecha, texto en la columna derecha (600px), y la barra de cotización rápida montada sobre el borde inferior (margen negativo de 96px). En móvil la foto va arriba sin velo y el texto debajo sobre tinta. Header fijo de 80px; navegación completa desde 1120px, teléfono desde 720px; barra de acciones móvil hasta 959px.

## Elevation & Depth

Híbrido: superficies planas en reposo, delimitadas por un anillo de 1px (`box-shadow: 0 0 0 1px` línea, o grafito 3 sobre oscuro), que se levantan al pasar el cursor. La profundidad también se construye con recortes: los insertos circulares e insignias llevan un anillo sólido del color de la sección (6 a 10px) que los separa de la foto de fondo.

### Shadow Vocabulary
- **Tarjeta levantada** (`box-shadow: 0 24px 48px -28px rgb(10 11 11 / 0.35), 0 2px 8px rgb(10 11 11 / 0.05)`): hover de tarjetas de servicio y pasos (con `translateY(-6px)`), y panel del formulario de contacto.
- **Flotante** (`box-shadow: 0 18px 44px -18px rgb(10 11 11 / 0.32), 0 2px 6px rgb(10 11 11 / 0.06)`): lo que flota sobre el contenido: barra de cotización rápida, mega menú, rótulo del hero, insignia lima de la foto y barra de acciones móvil.
- **Brillo lima** (`box-shadow: 0 12px 24px -14px rgb(130 150 0 / 0.9)`): solo el hover del botón primario.

### Named Rules
**The Sombra Al Levantar Rule.** Ninguna tarjeta tiene sombra en reposo. La sombra aparece como respuesta (hover) o porque el elemento realmente flota sobre otro contenido.

**The Recorte de Sección Rule.** Un inserto que se monta sobre una foto lleva un anillo sólido del color del fondo de su sección (blanco o grafito), no una sombra.

## Shapes

Forma cálida y redondeada. Píldora (999px) para toda acción: botones, chips, navegación, rótulos y el enlace de salto. 28px para fotos, tarjetas, mosaico, barra de cotización, panel de cotizar y franja del footer. 16px para campos, opciones de formulario, ítems de preguntas, áreas de contacto e insignia de la foto. El círculo es un material propio del mundo: discos de ícono (26 a 60px), insertos de foto, insignia giratoria, puntos de la línea de cobertura y trayectoria, el punto del cursor y el botón de menú.

### Named Rules
**The Píldora Actúa Rule.** Si se presiona para actuar, es píldora. Las esquinas de 16px son para lo que contiene entrada o lectura (campos, preguntas, áreas de contacto); 28px para lo que contiene foto o agrupa contenido.

## Components

### Buttons
Firmes y táctiles: píldoras que se elevan 2px al pasar el cursor y empujan su flecha 4px.
- **Shape:** píldora (999px), 50px de alto (58px en la variante grande), borde de 1.5px, Philosopher 600.
- **Primary:** lima con texto tinta; la acción de cotizar. Hover a lima presionado con brillo lima.
- **Secondary:** tinta con texto blanco; hover a grafito 3.
- **Outline:** borde tinta transparente; se rellena de tinta en hover.
- **Inverse:** sobre oscuro, borde blanco al 60%; se rellena de blanco con texto tinta en hover.
- **Focus:** contorno tinta de 2px con offset de 3px (lima sobre oscuro).
- **Enlace de texto:** Philosopher 600 con subrayado lima de 2px y la flecha dentro de un disco lima de 26px.

### Chips
- **Style:** píldoras de 44px en papel (blanco sobre secciones papel), Philosopher 600; enlazan servicios e industrias relacionados.
- **State:** hover rellena de lima.

### Cards / Containers
- **Corner Style:** 28px.
- **Background:** blanco; grafito o grafito 2 en contextos oscuros.
- **Shadow Strategy:** anillo de línea en reposo; tarjeta levantada en hover (ver Elevation & Depth).
- **Tarjeta de servicio:** foto 4:3 arriba que hace zoom a 1.06 en 900ms; disco lima de 56px con el ícono, montado sobre el borde de la foto con anillo blanco de 6px; toda la tarjeta es el área clicable.
- **Pieza del mosaico de industrias:** foto a sangre con velo de tinta inferior, nombre en blanco y disco lima de 40px con flecha que gira 45° en hover.
- **Paso:** número en disco lima suave con borde punteado que se vuelve lima sólido en hover; la cuarta celda es la tarjeta grafito de llamada al Área Comercial.
- **Internal Padding:** 24px; 32px en pasos, credenciales y paneles.

### Inputs / Fields
- **Style:** 52px de alto, borde línea fuerte de 1px, 16px de radio, fondo blanco; etiqueta 0.9375rem 600 arriba. Los select llevan chevron propio.
- **Focus:** borde tinta con anillo tinta de 1px.
- **Error / Disabled:** borde y anillo error; mensaje en error 0.875rem. Botones deshabilitados al 55% de opacidad.
- **Opciones:** tarjetas de 52px con radio propio circular; la elegida recibe borde tinta doble.
- **Progreso:** dos nodos de 28px unidos por un trazo de 40px que se vuelve lima al avanzar.

### Navigation
- **Header:** blanco, fijo, divisor línea; ítems píldora de 42px en Philosopher 500 0.9375rem; hover en papel; página actual en lima suave con anillo interior lima presionado. Teléfono con disco tinta y auricular lima.
- **Mega menú:** panel blanco con esquinas inferiores de 28px y sombra flotante; servicios con discos lima suave que se encienden lima en hover; subrayado lima de 2px en los nombres.
- **Móvil:** cajón a pantalla completa con filas de 60px en Philosopher 600 1.25rem y botón de menú circular de 44px.
- **Footer:** grafito con franja de contacto (discos lima de 48px) en panel grafito 2 de 28px; enlaces blancos con subrayado lima en hover.

### Barra de cotización rápida
Panel blanco de 28px con sombra flotante montado sobre el borde inferior del hero: título, instalación + necesidad y botón primario en una sola fila desde 1100px.

### Línea de cobertura y trayectoria
Lista vertical unida por un trazo lima de 3px; cada parada es un punto de 34px con borde tinta de 3px; la sede (o el primer hito) va relleno de lima con halo lima suave. La región va en Philosopher 700 a tamaño Title, con rótulo píldora tinta y texto lima para la base.

### Directorio de contacto por área
Filas de 16px de radio con anillo de línea: nombre del área en Philosopher 600 y propósito en acero a la izquierda; teléfonos y correos a la derecha desde 720px. Hover con anillo tinta de 1.5px (lima sobre oscuro).

### Preguntas frecuentes
Acordeones de 16px de radio con índice numérico (acero, lima sobre oscuro) y un disco de 36px con "+" que gira 45° y se vuelve lima al abrir.

### Banda de cierre lima
La única banda lima de la página: foto real de 28px con anillo de tinta al 8%, titular tamaño Headline con el marcador invertido a caja tinta, checks en discos tinta con ícono lima y botones secundario + outline.

### Movimiento
- **Aparición:** los elementos `data-reveal` bajo el pliegue suben 28px y aparecen en 700ms (opacidad ease-out, desplazamiento ease-expo) con retraso escalonado; solo tras hidratar.
- **Punto del cursor:** disco lima de 12px con anillo tinta de 1.5px que sigue al puntero en dispositivos de puntero fino y crece a 2.2× sobre elementos interactivos.
- **Insignia giratoria:** disco tinta de 148px con texto circular en mayúsculas que gira en 22s, anillo blanco de 8px.
- **Contadores:** las estadísticas reales suben hasta su valor al entrar en vista.
- Todo respeta `prefers-reduced-motion`: sin aparición, sin giro, sin scroll suave.

## Do's and Don'ts

### Do:
- **Do** usar fotografía real de Plagastop (cuadrillas, barcos, silos, bodegas, la sede) en marcos de 28px o círculos.
- **Do** usar el lima como relleno con texto tinta: botón de cotizar, discos de ícono, checks y el marcador detrás de una frase por titular.
- **Do** alternar bandas blanco, papel y grafito/tinta a todo el ancho, con una sola banda lima de cierre.
- **Do** hacer píldora toda acción (999px) y dejar 16px para campos y filas de lectura.
- **Do** dejar las tarjetas planas con anillo de 1px en reposo y levantarlas 6px con la sombra de tarjeta en hover.
- **Do** recortar los insertos sobre foto con un anillo sólido del color de la sección (6 a 10px).
- **Do** dibujar los íconos con trazo de 1.5 en grilla de 24, mostrando el objeto de control, dentro de discos lima.
- **Do** respetar `prefers-reduced-motion` en apariciones, insignia, contadores y scroll.

### Don't:
- **Don't** escribir texto lima sobre blanco o papel.
- **Don't** poner sombra en tarjetas en reposo; la sombra flotante es solo para lo que realmente flota.
- **Don't** usar degradados de color decorativos; los únicos degradados son velos de tinta para leer sobre foto y el trazo del marcador.
- **Don't** usar imágenes de stock, imágenes de plagas ni íconos de insectos.
- **Don't** volver al lenguaje del "Plano de control" rechazado: Archivo con eje de ancho, cajetines, plantas de instalación dibujadas como plano técnico y esquinas de 4px. (La línea de cobertura y el progreso del formulario, con puntos unidos por un trazo lima, sí son del mundo actual.)
- **Don't** poner antetítulos o rótulos en mayúsculas sobre los titulares; las mayúsculas quedan para el texto circular de la insignia giratoria.
- **Don't** marcar más de una frase por titular con el marcador.

### Actualización de movimiento (octubre 2026)

- **Tipografía:** Philosopher (extendida y redondeada, en diálogo con el wordmark) para titulares, botones y cifras; IBM Plex Sans Condensed para lectura y etiquetas de interfaz (navegación, preguntas, enlaces de texto).
- **Entrada del hero:** la foto se asienta con un zoom lento y las palabras del titular suben desde una máscara; el texto y la barra de cotización entran en cascada.
- **Titulares de sección:** palabras enmascaradas que suben al aparecer (`SplitWords` / `SplitTitle`); el marcador lima se dibuja de izquierda a derecha.
- **Cortina:** las fotos con `data-reveal-style="clip"` se descubren de abajo hacia arriba con la imagen asentándose.
- **Parallax:** `Photo parallax={n}` desplaza la imagen dentro de su marco (positivo = más lento). En móvil el hero no usa parallax.
- **Galería "En terreno":** en escritorio la sección queda fijada y las fotos avanzan en horizontal con el scroll, con barra de progreso lima; en móvil es un carrusel.
- Todo el movimiento se desactiva con `prefers-reduced-motion`.

### Actualización de tipografía y paleta (octubre 2026)

- **Tipografía:** Philosopher (400/700) para titulares, botones y cifras; IBM Plex Sans Condensed (400–700) para texto corrido, menú y etiquetas.
- **Paleta ampliada:**
  - Carbón `#292D2C`: bandas oscuras y footer.
  - Gris salvia `#8C9691`: matices secundarios (no como texto sobre claro: contraste insuficiente).
  - Hueso `#F0F1EC`: fondos alternos claros.
  - **Salvia `#9BAF9B`**: tarjetas, fondos, discos de íconos y la banda de cierre.
  - **Cobre `#C58C62`**: detalles, líneas e infografías (línea de cobertura, línea de tiempo, separadores del breadcrumb, progreso de la galería, numeración). Nunca como texto sobre fondo claro.
  - **Lima `#CCE70B`**: solo botones, cifras e información destacada (marcador en titulares, sello SAG, teléfonos destacados). Excepción aprobada: el punto que sigue al cursor.

### Fondos de color y más movimiento (octubre 2026)

- **Fondos:** la base del sitio es hueso `#F0F1EC` (ya no blanco). Las secciones alternan salvia clara (`.section--paper`, `#E2E9E1`), salvia (`.section--sage`, `#9BAF9B`) y carbón (`.section--dark`). Las tarjetas van en blanco encima. Sobre salvia, el texto secundario usa `--ps-graphite-2` para mantener contraste.
- **Cintas en movimiento:** eliminadas a pedido del cliente.
- **Barra de progreso de lectura** en cobre, fija arriba.
- **Líneas que se dibujan con el scroll** (`data-draw`): línea de cobertura y líneas de tiempo.
- **Botones magnéticos** (`data-magnetic`) y **tarjetas con inclinación 3D** (`data-tilt`), solo con mouse.
- **Preguntas frecuentes** que se despliegan suavemente; **insignias que flotan** (`.float-soft`).
- **Fotos por contenido:** cada servicio e industria tiene `photo` (cabecera) y `photo2` (cuerpo) elegidas a mano según su tema.
- **Marquesina cinética:** eliminada a pedido del cliente.
- **Declaración que se enciende** (`StatementReveal`): texto de gran formato en la banda carbón; las palabras pasan de tenues a blancas una a una con el scroll; las palabras entre corchetes se destacan en lima.
- **Hero por capas:** el fondo va más lento que el scroll, el texto sube más rápido y se desvanece (`data-scroll-fade`).

### Paleta azul y nueva Home (octubre 2026)

> Esta sección reemplaza las paletas anteriores (grafito/lima, salvia/cobre).

- **Azul marino `#102B46`**: bandas oscuras, hero, cifras, footer, tarjetas oscuras.
- **Azul océano `#247BA0`**: íconos, líneas, numeración, barras de infografía, bloque detrás del collage.
- **Celeste `#62C5E8`**: acentos sobre oscuro (íconos, checks, partículas 3D, barras).
- **Gris hielo `#DCEAF0`** (y `#EEF5F8` más claro): fondos secundarios.
- **Lima `#CCE70B`**: botones principales, cifras, palabras destacadas.
- Los nombres de variables antiguas (`--ps-sage`, `--ps-copper`) quedan como alias de los nuevos roles.

Home (de arriba abajo): hero con la fachada (sin objeto 3D ni texto animado por palabras) → nosotros → cifras con barras → servicios fijados y apilados (sticky) → banda de fondo con parallax y declaración que se enciende → tarjetas 3D tilt → lista compacta de industrias en dos columnas → galería horizontal fijada → pasos → cierre con degradado animado → preguntas (encabezado fijo) → cobertura → contacto.
