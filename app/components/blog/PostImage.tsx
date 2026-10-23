import type { BlogImage } from '~/lib/cms'
import { Photo } from '~/components/ui/Photo'

/**
 * Imagen de un artículo: foto del catálogo del sitio o imagen de WordPress con su srcset.
 * Carga diferida salvo que sea la principal de la página (priority).
 */
export function PostImage({ image, sizes, priority }: { image: BlogImage; sizes: string; priority?: boolean }) {
  if (image.photo) return <Photo id={image.photo} sizes={sizes} priority={priority} />
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}
