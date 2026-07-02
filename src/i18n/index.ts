/**
 * i18n core - locale detection, path localization, dictionary access.
 *
 * Routing model (Astro i18n, `prefixDefaultLocale: false`):
 *   fr (default) -> /            /work  /work/[slug]  /about  /contact
 *   en           -> /en/         /en/work ...
 */
import { ui, type UIKey } from './ui';

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

export const LOCALE_LABELS: Record<Locale, string> = { fr: 'Français', en: 'English' };
export const OG_LOCALES: Record<Locale, string> = { fr: 'fr_FR', en: 'en_US' };
export const HTML_LANGS: Record<Locale, string> = { fr: 'fr', en: 'en' };

/** Extracts the locale from a pathname ("/en/work" -> "en", "/work" -> "fr"). */
export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  return (LOCALES as readonly string[]).includes(first) && first !== DEFAULT_LOCALE
    ? (first as Locale)
    : DEFAULT_LOCALE;
}

/** Prefixes a root-relative path for the given locale. localizePath('/work', 'en') -> '/en/work' */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === '/' ? `/${locale}/` : `/${locale}${clean}`;
}

/** Strips a locale prefix, giving the canonical route shared by all locales. */
export function unlocalizePath(pathname: string): string {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    if (pathname === `/${locale}` || pathname === `/${locale}/`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

/** Translation accessor bound to a locale: const t = useTranslations('fr'); t('nav.home') */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui[DEFAULT_LOCALE][key] ?? key;
  };
}

/** hreflang alternates for the current page (fr, en, x-default). */
export function getAlternates(url: URL, site: string) {
  const route = unlocalizePath(url.pathname);
  const abs = (p: string) => new URL(p, site).href;
  return [
    { hreflang: 'fr', href: abs(localizePath(route, 'fr')) },
    { hreflang: 'en', href: abs(localizePath(route, 'en')) },
    { hreflang: 'x-default', href: abs(localizePath(route, DEFAULT_LOCALE)) },
  ];
}
