import type { MetaDescriptor } from 'react-router'
import { SITE_URL, company, officeArea, salesArea } from '~/content/company'
import { servedRegions } from '~/content/coverage'
import { services } from '~/content/services'

/**
 * Imagen para compartir en redes (1200 × 630): foto real del equipo en la sede, con el logo.
 * Se genera desde «imágenes plagastop/Nueva foto corporativa para landing de empresa.png».
 */
const DEFAULT_IMAGE = '/og/plagastop-equipo-og.jpg'
const DEFAULT_IMAGE_ALT = 'Equipo de Plagastop en el jardín de su sede en Concepción'
const DEFAULT_IMAGE_SIZE = { width: 1200, height: 630 }

/** Identificadores schema.org: una sola entidad de empresa, referenciada por @id desde las demás páginas. */
export const ORG_ID = `${SITE_URL}/#empresa`
export const WEBSITE_ID = `${SITE_URL}/#sitio`

/** Referencia a la empresa desde otras páginas (mismo @id, con nombre para lectores que no siguen el enlace). */
const orgRef = { '@type': 'LocalBusiness', '@id': ORG_ID, name: company.name, url: `${SITE_URL}/` }

interface MetaInput {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  noindex?: boolean
  /** El título ya incluye la marca. */
  rawTitle?: boolean
  /** Título y descripción para redes (Open Graph / Twitter) cuando difieren de los de Google. */
  social?: { title: string; description: string }
  jsonLd?: object[]
  /** Artículo del blog: og:type article, fechas y sección. */
  article?: { published: string; modified?: string; section?: string; author?: string; imageAlt?: string }
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

/**
 * Metadatos de una página: title, description, canonical, robots, Open Graph, Twitter Card y JSON-LD.
 * Las páginas indexables reciben además un WebPage enlazado al sitio y a la empresa por @id.
 */
export function buildMeta({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  imageAlt,
  noindex,
  rawTitle,
  social,
  jsonLd = [],
  article,
}: MetaInput): MetaDescriptor[] {
  const fullTitle = rawTitle ? title : `${title} | Plagastop`
  const url = absoluteUrl(path)
  const ogTitle = social?.title ?? fullTitle
  const ogDescription = social?.description ?? description
  const isDefaultImage = image === DEFAULT_IMAGE
  const alt = article?.imageAlt ?? imageAlt ?? (isDefaultImage ? DEFAULT_IMAGE_ALT : undefined)
  const articleMeta: MetaDescriptor[] = article
    ? [
        { property: 'article:published_time', content: article.published },
        ...(article.modified ? [{ property: 'article:modified_time', content: article.modified }] : []),
        ...(article.section ? [{ property: 'article:section', content: article.section }] : []),
        ...(article.author ? [{ property: 'article:author', content: article.author }] : []),
      ]
    : []
  const page = noindex ? [] : [webPageLd({ url, name: fullTitle, description, article: Boolean(article) })]
  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { name: 'robots', content: noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large' },
    { property: 'og:type', content: article ? 'article' : 'website' },
    { property: 'og:locale', content: 'es_CL' },
    { property: 'og:site_name', content: company.name },
    { property: 'og:title', content: ogTitle },
    { property: 'og:description', content: ogDescription },
    { property: 'og:url', content: url },
    { property: 'og:image', content: absoluteUrl(image) },
    ...(isDefaultImage
      ? [
          { property: 'og:image:type', content: 'image/jpeg' },
          { property: 'og:image:width', content: String(DEFAULT_IMAGE_SIZE.width) },
          { property: 'og:image:height', content: String(DEFAULT_IMAGE_SIZE.height) },
        ]
      : []),
    ...(alt ? [{ property: 'og:image:alt', content: alt }] : []),
    ...articleMeta,
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: ogTitle },
    { name: 'twitter:description', content: ogDescription },
    { name: 'twitter:image', content: absoluteUrl(image) },
    ...(alt ? [{ name: 'twitter:image:alt', content: alt }] : []),
    ...[...page, ...jsonLd].map((data) => ({ 'script:ld+json': data })),
  ]
}

const areaServedLd = servedRegions.map((name) => ({ '@type': 'AdministrativeArea', name }))

/**
 * Entidad principal (solo en el home). El resto de las páginas la referencian con { '@id': ORG_ID }.
 * Teléfono principal: la línea fija; el WhatsApp del Área Comercial va como punto de contacto de ventas,
 * igual que en la web. Horario: el de atención comercial (la prestación del servicio es 24/7).
 */
export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': ORG_ID,
  name: company.name,
  alternateName: `${company.name} - ${company.slogan}`,
  legalName: company.legalName,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/og/plagastop-og.png'),
  image: absoluteUrl(DEFAULT_IMAGE),
  description:
    'Empresa con más de 25 años de experiencia en control de plagas, fumigaciones, manejo integrado de plagas y tratamientos fitosanitarios para empresas e industrias.',
  slogan: company.slogan,
  telephone: officeArea.phone,
  email: salesArea.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    addressRegion: 'Biobío',
    addressCountry: 'CL',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: company.hours.days,
    opens: company.hours.opens,
    closes: company.hours.closes,
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: salesArea.phone,
      email: salesArea.email,
      availableLanguage: 'es',
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: officeArea.phone,
      email: officeArea.email,
      availableLanguage: 'es',
    },
  ],
  sameAs: [company.social.instagram, company.social.linkedin],
  areaServed: areaServedLd,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de control de plagas',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@id': serviceId(s.slug), '@type': 'Service', name: s.name, url: absoluteUrl(`/servicios/${s.slug}`) },
    })),
  },
}

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: absoluteUrl('/'),
  name: company.name,
  inLanguage: 'es-CL',
  publisher: orgRef,
}

function webPageLd({ url, name, description, article }: { url: string; name: string; description: string; article: boolean }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#pagina`,
    url,
    name,
    description,
    inLanguage: 'es-CL',
    isPartOf: { '@id': WEBSITE_ID },
    ...(article ? { mainEntity: { '@id': `${url}#article` } } : { about: { '@id': ORG_ID } }),
  }
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/**
 * Preguntas frecuentes visibles en la página. Se mantiene como marcado válido, sin esperar resultados
 * enriquecidos: Google los limita a sitios gubernamentales y de salud.
 */
export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

/** Schema BlogPosting de un artículo. Editor: la empresa (mismo @id que en el home). */
export function blogPostingLd(post: {
  slug: string
  title: string
  description: string
  date: string
  modified?: string
  author?: string
  section: string
  image?: string
  wordCountText: string
}) {
  const url = absoluteUrl(`/blog/${post.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@id': `${url}#pagina` },
    url,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.modified ?? post.date,
    articleSection: post.section,
    inLanguage: 'es-CL',
    wordCount: post.wordCountText.split(' ').filter(Boolean).length,
    ...(post.image ? { image: [absoluteUrl(post.image)] } : {}),
    author: post.author ? { '@type': 'Person', name: post.author } : orgRef,
    publisher: orgRef,
  }
}

function serviceId(slug: string) {
  return `${absoluteUrl(`/servicios/${slug}`)}#servicio`
}

export function serviceLd(service: { name: string; shortName: string; summary: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': serviceId(service.slug),
    name: service.name,
    serviceType: service.shortName,
    description: service.summary,
    url: absoluteUrl(`/servicios/${service.slug}`),
    provider: orgRef,
    areaServed: areaServedLd,
  }
}

/** Lista de servicios del índice /servicios: cada elemento apunta al Service de su página. */
export function serviceListLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Servicios de control de plagas de Plagastop',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/servicios/${s.slug}`),
      name: s.name,
    })),
  }
}
