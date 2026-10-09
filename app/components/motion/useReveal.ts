import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Motor de movimiento del sitio. Corre después de hidratar y se reinicia en cada navegación.
 *
 * - [data-reveal]: aparece al entrar en pantalla. data-reveal="2" escalona el retardo (2 × 90 ms).
 *   data-reveal-style="clip" revela con cortina (imágenes); "scale" con zoom de entrada.
 *   Si el elemento sale completamente del viewport, vuelve a quedar preparado para animarse.
 * - [data-parallax="0.15"]: se desplaza en Y en proporción a su posición en el viewport
 *   (positivo = más lento que el scroll). Usa la propiedad `translate`, no `transform`.
 * - [data-draw]: recibe --draw (0 a 1) según cuánto se ha recorrido; las líneas se dibujan con el scroll.
 * - [data-scroll-fade]: se desvanece a medida que su contenedor sale por arriba.
 * - --scroll en <html>: progreso de lectura de la página (0 a 1).
 * - [data-hscroll]: sección fijada cuyo [data-hscroll-track] avanza en horizontal con el scroll.
 *
 * Con prefers-reduced-motion no se activa nada: el contenido queda estático y completo.
 */
export function useReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    // =========================================================
    // APARICIONES / REVEAL
    // =========================================================

    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    )

    /*
     * Algunos elementos con data-reveal-style="clip" tienen que observar
     * su contenedor padre, porque el propio elemento puede estar completamente
     * recortado por clip-path y IntersectionObserver podría no detectarlo bien.
     *
     * Un mismo target puede controlar varios elementos.
     */
    const targets = new Map<Element, HTMLElement[]>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const elements = targets.get(entry.target) ?? []

          /*
           * Cuando una cantidad suficiente del elemento entra en pantalla,
           * mostramos todos los reveals asociados.
           */
          if (entry.intersectionRatio >= 0.12) {
            for (const el of elements) {
              el.dataset.revealState = 'shown'
            }

            continue
          }

          /*
           * Solo reseteamos la animación cuando el target ha salido
           * completamente del área observada.
           *
           * De esta forma no parpadea cuando está justo en el borde
           * del viewport.
           */
          if (
            !entry.isIntersecting ||
            entry.intersectionRatio === 0
          ) {
            for (const el of elements) {
              el.dataset.revealState = 'pending'
            }
          }
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',

        /*
         * 0 permite detectar cuando sale completamente.
         * 0.12 define cuándo consideramos que entró lo suficiente
         * como para ejecutar la animación.
         */
        threshold: [0, 0.12],
      },
    )

    for (const el of reveals) {
      const step = Number(el.dataset.reveal) || 0

      el.style.setProperty(
        '--reveal-delay',
        `${step * 90}ms`,
      )

      const rect = el.getBoundingClientRect()

      /*
       * Si el elemento ya está dentro del viewport cuando inicializamos
       * el hook, lo dejamos visible inmediatamente.
       *
       * Esto evita el problema donde quedaba atrapado en "pending"
       * después de Fast Refresh, navegación o hidratación.
       */
      if (
        rect.top < window.innerHeight * 0.92 &&
        rect.bottom > 0
      ) {
        el.dataset.revealState = 'shown'
      } else {
        el.dataset.revealState = 'pending'
      }

      const target =
        el.dataset.revealStyle === 'clip' &&
        el.parentElement
          ? el.parentElement
          : el

      targets.set(target, [
        ...(targets.get(target) ?? []),
        el,
      ])

      /*
       * Importante:
       * NO hacemos unobserve después del primer reveal.
       *
       * El elemento debe seguir siendo observado para poder:
       *
       * shown → pending → shown
       *
       * cuando el usuario baja y vuelve a subir.
       */
      io.observe(target)
    }

    // =========================================================
    // PARALLAX
    // =========================================================

    const parallax = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax]'),
    )

    const visible = new Set<HTMLElement>()

    const pio = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement

          if (entry.isIntersecting) {
            visible.add(el)
          } else {
            visible.delete(el)
          }
        }

        schedule()
      },
      {
        rootMargin: '20% 0px',
      },
    )

    parallax.forEach((el) => pio.observe(el))

    // =========================================================
    // GALERÍAS HORIZONTALES FIJADAS
    // =========================================================

    const wide = window.matchMedia('(min-width: 1000px)')

    const tracks = Array.from(
      document.querySelectorAll<HTMLElement>('[data-hscroll]'),
    ).map((section) => ({
      section,
      track: section.querySelector<HTMLElement>(
        '[data-hscroll-track]',
      ),
    }))

    const measure = () => {
      for (const { section, track } of tracks) {
        if (!track) continue

        if (!wide.matches) {
          section.dataset.hscrollActive = 'false'
          track.style.translate = ''
          continue
        }

        section.dataset.hscrollActive = 'true'

        const distance = Math.max(
          0,
          track.scrollWidth - track.clientWidth,
        )

        section.style.setProperty(
          '--hs-distance',
          `${distance}px`,
        )
      }
    }

    measure()

    // =========================================================
    // LÍNEAS DIBUJADAS CON SCROLL
    // =========================================================

    const draws = Array.from(
      document.querySelectorAll<HTMLElement>('[data-draw]'),
    )

    draws.forEach((el) => {
      el.dataset.drawActive = 'true'
    })

    // =========================================================
    // ELEMENTOS QUE DESAPARECEN AL SALIR POR ARRIBA
    // =========================================================

    const fades = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-scroll-fade]',
      ),
    )

    const root = document.documentElement

    // =========================================================
    // LOOP DE ACTUALIZACIÓN
    // =========================================================

    let frame = 0

    function schedule() {
      if (!frame) {
        frame = requestAnimationFrame(update)
      }
    }

    function update() {
      frame = 0

      const vh = window.innerHeight
      const max = root.scrollHeight - vh

      // Progreso general de lectura
      root.style.setProperty(
        '--scroll',
        max > 0
          ? (window.scrollY / max).toFixed(4)
          : '0',
      )

      // Fade al salir por arriba
      for (const el of fades) {
        const rect = (
          el.parentElement ?? el
        ).getBoundingClientRect()

        const gone = Math.min(
          1,
          Math.max(
            0,
            -rect.top / (rect.height * 0.75),
          ),
        )

        el.style.opacity = (1 - gone).toFixed(3)
      }

      // Líneas que se dibujan con el scroll
      for (const el of draws) {
        const rect = el.getBoundingClientRect()

        const p = Math.min(
          1,
          Math.max(
            0,
            (vh * 0.78 - rect.top) /
              Math.max(rect.height, 1),
          ),
        )

        el.style.setProperty(
          '--draw',
          p.toFixed(3),
        )
      }

      // Parallax
      for (const el of visible) {
        const speed =
          Number(el.dataset.parallax) || 0

        const rect = (
          el.parentElement ?? el
        ).getBoundingClientRect()

        const offset =
          rect.top +
          rect.height / 2 -
          vh / 2

        el.style.translate =
          `0 ${(offset * speed).toFixed(1)}px`
      }

      // Scroll horizontal
      for (const { section, track } of tracks) {
        if (
          !track ||
          section.dataset.hscrollActive !== 'true'
        ) {
          continue
        }

        const rect =
          section.getBoundingClientRect()

        const total =
          section.offsetHeight - vh

        const progress =
          total > 0
            ? Math.min(
                1,
                Math.max(
                  0,
                  -rect.top / total,
                ),
              )
            : 0

        const distance = Math.max(
          0,
          track.scrollWidth - track.clientWidth,
        )

        track.style.translate =
          `${(-progress * distance).toFixed(1)}px 0`

        section.style.setProperty(
          '--hs-progress',
          progress.toFixed(3),
        )
      }
    }

    // =========================================================
    // RESIZE + SCROLL
    // =========================================================

    const onResize = () => {
      measure()
      schedule()
    }

    window.addEventListener(
      'scroll',
      schedule,
      { passive: true },
    )

    window.addEventListener(
      'resize',
      onResize,
    )

    schedule()

    // =========================================================
    // CLEANUP
    // =========================================================

    return () => {
      draws.forEach((el) => {
        delete el.dataset.drawActive
      })

      io.disconnect()
      pio.disconnect()

      cancelAnimationFrame(frame)

      window.removeEventListener(
        'scroll',
        schedule,
      )

      window.removeEventListener(
        'resize',
        onResize,
      )
    }
  }, [pathname])
}