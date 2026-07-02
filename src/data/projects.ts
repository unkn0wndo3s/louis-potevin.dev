import type { Locale } from '../i18n';

/** A string localized in both site languages. */
export type Localized = Record<Locale, string>;

import { NDS_COMPONENT_COUNT } from '../lib/ndsMeta';

export type ProjectStatus = 'live' | 'maintained' | 'wip';

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  name: string;
  status: ProjectStatus;
  tagline: Localized;
  summary: Localized;
  /** Long-form body, one paragraph per entry. */
  body: Localized[];
  highlights: Localized[];
  stack: { name: string; icon: string }[];
  links: ProjectLink[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: 'nova-design-system',
    name: 'Nova Design System',
    status: 'maintained',
    featured: true,
    tagline: {
      fr: 'Bibliothèque de composants Astro - tokens, accessibilité, distribution npm.',
      en: 'Astro component library - tokens, accessibility, npm distribution.',
    },
    summary: {
      fr: `${NDS_COMPONENT_COUNT} composants Astro, un système complet de tokens (couleur, typographie, espacement, rayons) et un thème clair/sombre piloté par variables CSS. Publié sur npm, il propulse ce portfolio.`,
      en: `A library of ${NDS_COMPONENT_COUNT} Astro components, a complete token system (color, typography, spacing, radius) and a light/dark theme driven by CSS variables. Published on npm, it powers this portfolio.`,
    },
    body: [
      {
        fr: "Nova Design System est né d'un besoin simple : arrêter de réécrire les mêmes boutons, champs et modales d'un projet à l'autre. Chaque composant est développé avec son interface TypeScript, ses états (hover, focus, disabled) et ses styles isolés en SCSS.",
        en: 'Nova Design System started from a simple need: stop rewriting the same buttons, fields and modals from one project to the next. Every component ships with its TypeScript interface, its states (hover, focus, disabled) and isolated SCSS styles.',
      },
      {
        fr: "La distribution se fait via npm (paquet public `@unkn0wndo3s/nova-design-system`), avec une CI Gitea Actions auto-hébergée qui vérifie, versionne et publie chaque release en 10 à 20 secondes. Le paquet livre ses sources `.astro`/`.scss` brutes, compilées côté consommateur.",
        en: 'Distribution happens through npm (public package `@unkn0wndo3s/nova-design-system`), with a self-hosted Gitea Actions CI that checks, versions and publishes each release in 10 to 20 seconds. The package ships raw `.astro`/`.scss` sources, compiled on the consumer side.',
      },
      {
        fr: "La suite : adapter progressivement NDS à mes autres projets, y compris hors de l'écosystème Astro - un binding GPUI/Rust est prévu pour File Organizer.",
        en: 'Next up: progressively adapting NDS to my other projects, including outside the Astro ecosystem - a GPUI/Rust binding is planned for File Organizer.',
      },
    ],
    highlights: [
      { fr: `${NDS_COMPONENT_COUNT} composants exportés sur npm`, en: `${NDS_COMPONENT_COUNT} components exported on npm` },
      { fr: 'Tokens couleur / typo / espacement / rayons, thème clair-sombre', en: 'Color / type / spacing / radius tokens, light-dark theme' },
      { fr: 'CI/CD Gitea Actions auto-hébergée, publication npm en ~15 s', en: 'Self-hosted Gitea Actions CI/CD, npm publish in ~15 s' },
      { fr: 'Licence maison : usage libre, monétisation du DS interdite', en: 'Custom license: free to use, monetizing NDS itself prohibited' },
    ],
    stack: [
      { name: 'Astro', icon: 'Astro' },
      { name: 'TypeScript', icon: 'Typescript' },
      { name: 'Sass', icon: 'Sass' },
      { name: 'Gitea CI', icon: 'Gitea' },
      { name: 'npm', icon: 'Npm' },
    ],
    links: [
      { label: 'npm', url: 'https://www.npmjs.com/package/@unkn0wndo3s/nova-design-system' },
      { label: 'Gitea', url: 'https://git.novaprojects.dev/unkn0wn/nova-design-system' },
    ],
  },
  {
    slug: 'nova-infra',
    name: 'Self-hosted Infrastructure',
    status: 'live',
    featured: true,
    tagline: {
      fr: 'Services conteneurisés, CI/CD et ingress sécurisé sur serveur dédié.',
      en: 'Containerized services, CI/CD and secured ingress on a dedicated server.',
    },
    summary: {
      fr: "Infrastructure auto-hébergée sur serveur OVH : forge Git (Gitea), gestionnaire de secrets (Vaultwarden), runners CI et sites hébergés, exposés derrière un reverse proxy Apache et Cloudflare.",
      en: 'Self-hosted infrastructure on an OVH server: Git forge (Gitea), secret manager (Vaultwarden), CI runners and hosted sites, exposed behind an Apache reverse proxy and Cloudflare.',
    },
    body: [
      {
        fr: "Tout mon outillage de développement tourne sur ma propre infrastructure : Gitea pour le code et les releases, Vaultwarden pour les secrets, un runner Gitea Actions pour la CI/CD, et les sites de production (dont celui-ci).",
        en: 'All my development tooling runs on my own infrastructure: Gitea for code and releases, Vaultwarden for secrets, a Gitea Actions runner for CI/CD, and the production sites (including this one).',
      },
      {
        fr: "Chaque service est conteneurisé et isolé ; l'exposition passe par un reverse proxy Apache avec TLS, derrière Cloudflare pour le DNS et la protection. Les déploiements sont entièrement automatisés : un push sur `main` suffit.",
        en: 'Each service is containerized and isolated; exposure goes through an Apache reverse proxy with TLS, behind Cloudflare for DNS and protection. Deployments are fully automated: a push to `main` is all it takes.',
      },
    ],
    highlights: [
      { fr: 'Forge Git + CI/CD + secrets 100 % auto-hébergés', en: '100% self-hosted Git forge + CI/CD + secrets' },
      { fr: 'Reverse proxy Apache, TLS, DNS et protection Cloudflare', en: 'Apache reverse proxy, TLS, Cloudflare DNS and protection' },
      { fr: 'Déploiement continu : push sur main = mise en production', en: 'Continuous deployment: push to main = production release' },
    ],
    stack: [
      { name: 'Docker', icon: 'Docker' },
      { name: 'Linux', icon: 'Linux' },
      { name: 'Apache', icon: 'Apache' },
      { name: 'Gitea', icon: 'Gitea' },
      { name: 'Cloudflare', icon: 'Cloudflare' },
    ],
    links: [{ label: 'Gitea', url: 'https://git.novaprojects.dev/unkn0wn' }],
  },
  {
    slug: 'portfolio',
    name: 'louis-potevin.dev',
    status: 'live',
    featured: true,
    tagline: {
      fr: 'Ce site. Astro multi-pages, fond 3D, bilingue, 100 % Nova Design System.',
      en: 'This website. Multi-page Astro app, 3D background, bilingual, 100% Nova Design System.',
    },
    summary: {
      fr: "Portfolio statique bilingue (FR/EN), entièrement composé avec les composants Nova, avec une scène spatiale Three.js pilotée par le scroll et un SEO complet (hreflang, JSON-LD, sitemap).",
      en: 'A bilingual (FR/EN) static portfolio, entirely composed with Nova components, featuring a scroll-driven Three.js space scene and full SEO (hreflang, JSON-LD, sitemap).',
    },
    body: [
      {
        fr: "Le site sert de vitrine et de banc d'essai au design system : chaque bouton, badge, champ ou fil d'Ariane provient du paquet npm `@unkn0wndo3s/nova-design-system`, sans style dupliqué.",
        en: 'The site doubles as a showcase and test bench for the design system: every button, badge, field or breadcrumb comes from the `@unkn0wndo3s/nova-design-system` npm package, with no duplicated styling.',
      },
      {
        fr: "Côté 3D, une ceinture d'astéroïdes réagit au scroll sur la page d'accueil et les composants du design system flottent en 3D sur sa page projet. Le tout se coupe proprement sans WebGL ou quand l'utilisateur préfère réduire les animations.",
        en: 'On the 3D side, an asteroid belt reacts to scroll on the home page and the design system components float in 3D on its project page. Everything degrades cleanly without WebGL or when the user prefers reduced motion.',
      },
    ],
    highlights: [
      { fr: 'Bilingue FR/EN avec hreflang et sitemap localisé', en: 'Bilingual FR/EN with hreflang and localized sitemap' },
      { fr: 'Scène Three.js pilotée par le scroll, fallback sans WebGL', en: 'Scroll-driven Three.js scene, no-WebGL fallback' },
      { fr: 'JSON-LD Person / WebSite / BreadcrumbList / SoftwareSourceCode', en: 'Person / WebSite / BreadcrumbList / SoftwareSourceCode JSON-LD' },
    ],
    stack: [
      { name: 'Astro', icon: 'Astro' },
      { name: 'TypeScript', icon: 'Typescript' },
      { name: 'Sass', icon: 'Sass' },
      { name: 'Three.js', icon: 'Threedotjs' },
    ],
    links: [{ label: 'Gitea', url: 'https://git.novaprojects.dev/unkn0wn/portfolio' }],
  },
  {
    slug: 'file-organizer',
    name: 'File Organizer',
    status: 'wip',
    featured: false,
    tagline: {
      fr: "Portage Java vers Rust d'un organiseur de fichiers, UI native avec GPUI.",
      en: 'Java-to-Rust port of a file organizer, native UI with GPUI.',
    },
    summary: {
      fr: "Réécriture en Rust d'un outil d'organisation de fichiers initialement en Java : surveillance du système de fichiers avec `notify`, interface native GPUI, et architecture qui sépare strictement la logique fichiers de l'UI.",
      en: 'A Rust rewrite of a file-organizing tool originally built in Java: filesystem watching with `notify`, a native GPUI interface, and an architecture that strictly separates file logic from the UI.',
    },
    body: [
      {
        fr: "L'objectif du portage : gagner en performance et en fiabilité, et apprendre Rust sur un vrai projet. La logique métier (règles de tri, déplacement, surveillance) est pure et testable, indépendante de la couche de rendu.",
        en: 'The goal of the port: gain performance and reliability, and learn Rust on a real project. The business logic (sorting rules, moves, watching) is pure and testable, independent from the rendering layer.',
      },
    ],
    highlights: [
      { fr: 'Logique filesystem pure, découplée de l’UI', en: 'Pure filesystem logic, decoupled from the UI' },
      { fr: 'Surveillance temps réel avec le crate notify', en: 'Real-time watching with the notify crate' },
    ],
    stack: [
      { name: 'Rust', icon: 'Rust' },
      { name: 'GPUI', icon: 'Rust' },
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/unkn0wndo3s/file-organizer' }],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/* ── NDS showcase data (project page "flying components" tour) ─────────────── */

export interface ShowcaseStage {
  id: string;
  component: string;
  title: Localized;
  description: Localized;
  tokens: string[];
}

export const ndsShowcase: ShowcaseStage[] = [
  {
    id: 'button',
    component: 'Button',
    title: { fr: 'Button - quatre intentions, trois tailles', en: 'Button - four intents, three sizes' },
    description: {
      fr: 'Primary, secondary, ghost et danger. Rendu en lien ou en bouton selon la prop href, focus visible au clavier.',
      en: 'Primary, secondary, ghost and danger. Renders as a link or a button depending on the href prop, visible keyboard focus.',
    },
    tokens: ['--nds-primary', '--nds-on-primary', '--nds-radius-md', '--nds-ring'],
  },
  {
    id: 'badge',
    component: 'Badge',
    title: { fr: 'Badge - statuts sémantiques', en: 'Badge - semantic statuses' },
    description: {
      fr: 'Six types (primary, neutral, success, warning, error, info) en deux variantes, soft et solid, dérivées des tokens de statut.',
      en: 'Six types (primary, neutral, success, warning, error, info) in two variants, soft and solid, derived from the status tokens.',
    },
    tokens: ['--nds-success-medium', '--nds-warning-low', '--nds-radius-full'],
  },
  {
    id: 'textfield',
    component: 'TextField',
    title: { fr: 'TextField - saisie avec compteur', en: 'TextField - input with counter' },
    description: {
      fr: 'Texte, e-mail, mot de passe ou textarea, avec label lié, placeholder et compteur de caractères optionnel.',
      en: 'Text, e-mail, password or textarea, with a bound label, placeholder and optional character counter.',
    },
    tokens: ['--nds-surface', '--nds-border', '--nds-text', '--nds-ring'],
  },
  {
    id: 'toggle',
    component: 'Toggle',
    title: { fr: 'Toggle - Web Component', en: 'Toggle - Web Component' },
    description: {
      fr: "Implémenté selon le pattern Web Components : état interne, événements natifs, utilisable hors d'Astro.",
      en: 'Built on the Web Components pattern: internal state, native events, usable outside Astro.',
    },
    tokens: ['--nds-primary', '--nds-surface-2', '--nds-radius-full'],
  },
  {
    id: 'select',
    component: 'Select',
    title: { fr: 'Select - liste déroulante accessible', en: 'Select - accessible dropdown' },
    description: {
      fr: 'Select et SelectOption composables, navigation clavier, valeur par défaut et état désactivé.',
      en: 'Composable Select and SelectOption, keyboard navigation, default value and disabled state.',
    },
    tokens: ['--nds-surface', '--nds-border-strong', '--nds-shadow-md'],
  },
  {
    id: 'pagination',
    component: 'Pagination',
    title: { fr: 'Pagination - navigation par pages', en: 'Pagination - page navigation' },
    description: {
      fr: 'Pagination et PaginationNumber composables, état courant et bornes gérés par le composant.',
      en: 'Composable Pagination and PaginationNumber, current state and bounds handled by the component.',
    },
    tokens: ['--nds-primary-soft', '--nds-text', '--nds-radius-md'],
  },
];
