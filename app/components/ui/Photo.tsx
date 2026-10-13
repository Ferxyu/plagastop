import { photo, type PhotoId } from '~/content/photos'

/** Foto real con srcset. Por defecto carga diferida; el hero usa priority. */
export function Photo({
  id,
  sizes = '(min-width: 1000px) 50vw, 100vw',
  className,
  priority,
  parallax,
}: {
  id: PhotoId
  sizes?: string
  className?: string
  priority?: boolean
  /** Velocidad de parallax (p. ej. 0.12). El contenedor debe recortar el desborde. */
  parallax?: number
}) {
  const p = photo(id)
  return (
    <img
      src={p.src}
      srcSet={p.srcSet}
      sizes={sizes}
      alt={p.alt}
      className={className}
      style={p.focus ? { objectPosition: p.focus } : undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
      data-parallax={parallax}
    />
  )
}
