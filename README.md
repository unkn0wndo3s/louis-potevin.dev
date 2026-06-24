# louis-potevin.dev

Professional portfolio of **Louis Potevin** — full-stack developer.
Static multi-page website built with **Astro + TypeScript + Sass**, styled
**exclusively** by the in-house design system **`@unkn0wndo3s/nova-design-system`**
(tokens, components), featuring a 3D space background controlled via scrolling.

---

## Getting Started

```bash
npm install
npm run dev      # dev server       → http://localhost:4321
npm run build    # static build     → ./dist
npm run preview  # preview the build
```

> **Installation Note.** `@lucide/astro` has not yet declared its
compatibility with Astro 7 in its `peerDependencies`. The **`.npmrc`**
> file therefore enables `legacy-peer-deps=true` so that `npm install` succeeds.
> Functionality is not affected.

---

## Edit Before Going Live

All modifiable content is centralized. Values to be confirmed are
marked with `TODO` in the code :

- **`src/data/site.ts`** — name, role, email, external links (Gitea, GitHub,
npm, LinkedIn). In particular, verify :
- **`src/data/projects.ts`** — la liste des projets (les « stations »).
  Chaque entrée : résumé, contexte, contributions, stack, liens.

---

## Structure

```
src/
├─ data/
│  ├─ site.ts            # profile + links (single source of truth)
│  └─ projects.ts        # project content
├─ layouts/
│  └─ BaseLayout.astro   # NDS styles + 3D background + nav + footer + HUD
├─ components/
│  ├─ scene/scene.ts     # Three.js background (stars, nebula, ambient asteroid)
│  ├─ SpaceBackground.astro
│  ├─ ProjectCard.astro  # project card (NDS Card component)
│  ├─ SiteNav / SiteFooter / Eyebrow / TechIcon / BrandLinkedin
└─ pages/
   ├─ index.astro        # home
   ├─ work/index.astro   # all projects
   ├─ work/[slug].astro  # project details (getStaticPaths)
   ├─ about.astro
   └─ contact.astro
```

## Design system

Components come from `@unkn0wndo3s/nova-design-system` :
`import { Button, Card, Badge, Navbar, Breadcrumb, TextField, Select, ... }`.
Global styles and tokens : `import '@unkn0wndo3s/nova-design-system/styles'`
(done once in `BaseLayout.astro`).

The package ships its raw `.astro`/`.scss` source files - Astro compiles them
on the consumer side. Since its `exports` field does not publish token partials
individually, the typography partial is exposed via a Sass
`loadPath` (see `astro.config.mjs`) and then re-exported by
`src/styles/_type.scss` (mixins `text-sm` … `text-5xl`).

Icons : `@lucide/astro` (UI) and `simple-icons-astro` (tech). Since LinkedIn is
no longer distributed by either of them (trademark policy), its glyph is provided
locally in `BrandLinkedin.astro`.

## 3D Background

An ambient asteroid slowly rotates and floats in the background, in the middle of a
starfield and a discrete nebula (Three.js). It does not follow scroll actions
and produces no engine flame effects: it is a backdrop, not the subject.

- **Without WebGL** : the canvas hides cleanly, the site remains readable.

## SEO

Meticulous search engine optimization, pre-configured:

- Per-page metadata (title, description, keywords), canonical URLs;
- Open Graph + Twitter Card with `public/og.png` (1200×630) ;
- Structured data JSON-LD (`Person` + `WebSite`) ;
- `sitemap-index.xml` (via `@astrojs/sitemap`) + `public/robots.txt`.

Remember to update `og.png` if you change your job title, and confirm the
links in `site.ts` (used in the `sameAs` property of the structured data).

## Contact Form

The site is 100% static: the form in `contact.astro` does not have a
backend. The **Send** button opens the user's mail client with a
pre-filled message (`mailto:`). For a server-side submission, connect a service
(Formspree, Resend, edge function…) to the `#cf-send` button.

---

Built with Astro + Nova Design System.
