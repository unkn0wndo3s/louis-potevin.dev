# louis-potevin.dev — Portfolio v2

Portfolio bilingue (FR/EN) construit avec **Astro 7**, **Nova Design System**, **Three.js** et **Lenis**.
Accueil = un « voyage » : le scroll ne fait jamais défiler une page, il pilote une caméra 3D
et l'animation continue. Chaque projet a sa propre scène sur-mesure.

## Stack

- [Astro 7](https://astro.build) — SSG, i18n natif, zéro JS par défaut
- [`@unkn0wndo3s/nova-design-system`](https://www.npmjs.com/package/@unkn0wndo3s/nova-design-system) — composants + tokens (source unique du design)
- [Three.js](https://threejs.org) — le moteur du voyage (accueil)
- [Lenis](https://lenis.darkroom.engineering) — smooth scroll ; toutes les animations lisent le scroll depuis Lenis, d'où la sensation d'une seule courbe de mouvement
- Sass — les mixins typographiques NDS sont exposés via un `loadPath` (voir `astro.config.mjs`)

## Démarrer

```bash
npm install        # .npmrc force legacy-peer-deps (requis par @lucide/astro avec Astro 7)
npm run dev        # http://localhost:4321
npm run build      # sortie statique dans dist/
npm run check      # astro check (TS + diagnostics) - 0 erreur attendu
```

Node >= 22.12 (contrainte du NDS).

## Structure

```
src/
├── data/          site.ts (profil, liens), projects.ts (projets localisés + stages du showcase NDS)
├── i18n/          index.ts (helpers locale/chemins/hreflang), ui.ts (dictionnaires FR/EN)
├── lib/seo.ts     JSON-LD : Person, WebSite, BreadcrumbList, SoftwareSourceCode, ProfilePage
├── lib/smooth.ts  Singleton Lenis · lib/scrub.ts - progression 0..1 des scènes épinglées
├── layouts/       BaseLayout.astro (head SEO complet, nav, footer, init Lenis)
├── components/
│   ├── scene/     voyage.ts - moteur de l'accueil · scene.ts - fond ambiant des sous-pages
│   ├── scenes/    InfraScene, BlueprintScene, SorterScene - scènes projet sur-mesure
│   └── showcase/  ComponentShowcase.astro - composants NDS "volants" (page projet NDS)
├── views/         La logique de chaque page (partagée entre locales)
└── pages/         Routes minces : / (FR, défaut) et /en/* (miroirs)
```

**Règle i18n** : une page = une view. Les routes (`pages/` et `pages/en/`) ne font
qu'importer la view ; la locale est déduite de l'URL (`getLocaleFromUrl`).
`/` = français (cible : recruteurs FR), `/en/` = anglais. Pour inverser, changer
`DEFAULT_LOCALE` dans `src/i18n/index.ts` **et** `i18n.defaultLocale` dans `astro.config.mjs`.

## Le voyage (accueil)

`voyage.ts` transforme la hauteur de scroll en **timeline** : les sections HTML sont des
overlays fixes, et le scroll avance une caméra sur une courbe Catmull-Rom à travers
nébuleuses, ceinture d'astéroïdes (une balise lumineuse par projet) et portail final.

- **Scroll down** → les astéroïdes dérivent et se percutent (collisions élastiques,
  étincelles additives).
- **Scroll up** → **vortex gravitationnel** : spirale vers la formation d'origine.
- Barre de progression + points de navigation latéraux (clic = seek animé).
- Les ancres (`/#about`, `/#contact`…) deviennent des seeks sur la timeline.
- Progressive enhancement : le même markup rend une page normale empilée sans JS,
  sans WebGL ou avec `prefers-reduced-motion` (la classe `html.cinema` n'est jamais posée).

## Métadonnées NDS toujours à jour

`src/lib/ndsMeta.ts` : la liste des composants (et leur nombre) est parsée depuis
l'index d'exports du paquet installé, et la version est récupérée sur le registre
npm **au moment du build** (fallback : version installée si hors-ligne). La forge,
les textes de la home et la fiche projet NDS lisent tous cette source — plus aucun
chiffre en dur à maintenir.

## /docs — la documentation technique

Une page dédiée (`/docs`, FR/EN) documente tout le fonctionnement du site en 13 chapitres,
avec sommaire sticky (scrollspy) et snippets **extraits du vrai code source au build**
(imports Vite `?raw` + découpe par marqueurs — si un marqueur disparaît, le build échoue
au lieu de publier une doc périmée). Coloration syntaxique Shiki via `astro:components`.

## Scènes projet sur-mesure

Toutes épinglées (section haute + stage sticky), pilotées par `scrub.ts`, fallback statique :

| Projet | Scène |
| --- | --- |
| nova-design-system | `ComponentShowcase` (« la forge ») — 3 actes : les tokens (vrais swatches) convergent, 8 vrais composants NDS défilent dans un tunnel 3D avec specs + snippet d'usage, la bibliothèque se fige en grille avec compteurs |
| nova-infra | `InfraScene` — le graphe Visiteur → Cloudflare → Apache/VPS se dessine au scroll, puis un paquet circule en continu |
| portfolio | `BlueprintScene` — le wireframe du site se trace (dashoffset) puis s'allume aux couleurs NDS |
| file-organizer | `SorterScene` — 20 fichiers éparpillés (seed déterministe) se rangent en colonnes au scroll |

## SEO

- `hreflang` fr / en / x-default + canonical sur chaque page
- JSON-LD : `Person` (@id partagé), `WebSite`, `BreadcrumbList` par page,
  `SoftwareSourceCode` par projet, `ProfilePage` sur /about
- Open Graph + Twitter cards localisés (`og-fr.png` / `og-en.png`)
- Sitemap i18n (`@astrojs/sitemap`) + `robots.txt`
- Pas de meta `keywords` (ignorées par Google, signal spam pour certains crawlers)

## À faire côté déploiement

1. **Désactiver « Email Address Obfuscation »** dans Cloudflare (Scrape Shield) :
   sinon CF injecte `email-decode.min.js`, casse le mailto sans JS et affiche
   « [email protected] » aux crawlers de recruteurs.
2. **`public/og-fr.png` et `public/og-en.png`** (1200×630) — visuels de partage.
2. Brancher le workflow **Gitea Actions** existant (`npm ci && npm run build`, publier `dist/`).
3. `/about` et `/contact` redirigent vers `/#about` et `/#contact` (config Astro) —
   les anciennes URL indexées ne cassent pas.
4. Tester le voyage sur un vrai GPU/trackpad et ajuster les poids `data-weight`
   des sections dans `HomeView.astro` (durée relative de chaque étape).
