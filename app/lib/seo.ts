import type { MetaDescriptor } from 'react-router'
import { SITE_URL, company, contactAreas } from '~/content/company'
import { areaServed } from '~/content/coverage'

const DEFAULT_IMAGE = '/og/plagastop-og.png'

interface MetaInput {
  title: string
  description: string
  path: string
  image?: string
  noindex?: boolean
  /** El título ya incluye la marca. */
  rawTitle?: boolean
  jsonLd?: object[]
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

export function buildMeta({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  noindex,
  rawTitle,
  jsonLd = [],
}: MetaInput): MetaDescriptor[] {
  const fullTitle = rawTitle ? title : `${title} | Plagastop`
  const url = absoluteUrl(path)
  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'es_CL' },
    { property: 'og:site_name', content: 'Plagastop' },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: absoluteUrl(image) },
    { name: 'twitter:card', content: 'summary_large_image' },
    ...(noindex ? [{ name: 'robots', content: 'noindex, follow' }] : []),
    ...jsonLd.map((data) => ({ 'script:ld+json': data })),
  ]
}

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: company.name,
  url: SITE_URL,
  logo: absoluteUrl('/og/plagastop-og.png'),
  image: absoluteUrl('/og/plagastop-og.png'),
  description: company.tagline,
  foundingDate: String(company.foundingYear),
  telephone: contactAreas[0].phone,
  email: contactAreas[0].email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    addressRegion: company.address.region,
    addressCountry: 'CL',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    opens: company.hours.opens,
    closes: company.hours.closes,
  },
  areaServed: areaServed.map((name) => ({ '@type': 'Place', name })),
  sameAs: [company.social.facebook, company.social.instagram],
  contactPoint: contactAreas.map((a) => ({
    '@type': 'ContactPoint',
    contactType: a.name,
    ...(a.phoneUnconfirmed ? {} : { telephone: a.phone }),
    ...(a.email ? { email: a.email } : {}),
    areaServed: 'CL',
    availableLanguage: 'es',
  })),
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

export function serviceLd(service: { name: string; summary: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.summary,
    url: absoluteUrl(`/servicios/${service.slug}`),
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: areaServed.map((name) => ({ '@type': 'Place', name })),
  }
}
