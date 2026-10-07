import { photo, type PhotoId } from '~/content/photos'

/** Foto real con srcset. Por defecto carga diferida; el hero usa priority. */
export function Photo({
  id,
  sizes = '(min-width: 1000px) 50vw, 100vw',
  className,
  priority,
}: {
  id: PhotoId
  sizes?: string
  className?: string
  priority?: boolean
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
    />
  )
}
