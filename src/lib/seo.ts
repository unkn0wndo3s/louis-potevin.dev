/**
 * JSON-LD builders. Each returns a plain object serialized by the layout.
 * Kept framework-agnostic so it can be unit-tested without Astro.
 */
import { site } from '../data/site';
import type { Project } from '../data/projects';
import type { Locale } from '../i18n';

const SITE_URL = 'https://louis-potevin.dev';

const PERSON_ID = `${SITE_URL}/#person`;

export function personLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    jobTitle: locale === 'fr' ? 'Développeur full-stack' : 'Full-stack Developer',
    url: SITE_URL,
    email: `mailto:${site.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: site.location.country,
    },
    knowsAbout: [
      'Web development',
      'TypeScript',
      'JavaScript',
      'Astro',
      'Vue.js',
      'Node.js',
      'Sass',
      'PostgreSQL',
      'Docker',
      'CI/CD',
      'Rust',
    ],
    knowsLanguage: ['fr', 'en'],
    sameAs: Object.values(site.links).map((l) => l.url),
  };
}

export function webSiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: `${site.name} - Portfolio`,
    url: SITE_URL,
    inLanguage: ['fr-FR', 'en-US'],
    publisher: { '@id': PERSON_ID },
  };
}

export interface Crumb {
  name: string;
  url: string;
}

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: new URL(c.url, SITE_URL).href,
    })),
  };
}

export function projectLd(project: Project, locale: Locale, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.name,
    description: project.summary[locale],
    url: pageUrl,
    codeRepository: project.links[0]?.url,
    programmingLanguage: project.stack.map((s) => s.name),
    author: { '@id': PERSON_ID },
    inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
  };
}

export function profilePageLd(pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: pageUrl,
    mainEntity: { '@id': PERSON_ID },
  };
}
