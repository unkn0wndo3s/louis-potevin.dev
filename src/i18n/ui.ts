import { NDS_COMPONENT_COUNT } from '../lib/ndsMeta';

/**
 * UI dictionaries. Keys are grouped by surface (nav, home, work, about, contact, footer).
 * Project content lives in `src/data/projects.ts` (localized per field).
 */
const fr = {
  // Meta
  'meta.home.title': 'Louis Potevin - Développeur full-stack TypeScript/Node · Limoges & remote',
  'meta.home.description':
    "Louis Potevin, développeur web full-stack : front-end, back-end, TypeScript, Astro, Node. Disponible en CDI dès septembre 2026 et en freelance, partout en France ou en remote.",
  'meta.work.title': 'Projets - Louis Potevin, développeur full-stack',
  'meta.work.description':
    "Design system publié sur npm, infrastructure auto-hébergée, outils Rust : les projets de Louis Potevin, développeur web full-stack.",
  'meta.docs.title': 'Docs - Comment ce portfolio est construit, de A à Z',
  'meta.docs.description':
    "Documentation technique complète du portfolio de Louis Potevin : Astro, i18n, Lenis, Three.js, scènes scroll-driven, design system, SEO, déploiement - avec le vrai code source.",
  'meta.about.title': 'À propos - Louis Potevin, développeur full-stack',
  'meta.about.description':
    "Parcours de Louis Potevin : BUT MMI, alternance chez Legrand, projets personnels. Développeur full-stack TypeScript / Node, disponible en CDI et freelance.",
  'meta.contact.title': 'Contact - Louis Potevin, développeur full-stack',
  'meta.contact.description':
    "Contacter Louis Potevin, développeur web full-stack. CDI dès septembre 2026 ou mission freelance, partout en France, sur site ou en remote.",

  // Nav
  'nav.home': 'Accueil',
  'nav.work': 'Projets',
  'nav.docs': "Comment c'est fait",
  'nav.about': 'À propos',
  'nav.contact': 'Contact',
  'nav.cta': 'Me contacter',
  'nav.skip': 'Aller au contenu',
  'nav.lang': 'Langue',

  // Availability
  'avail.badge': 'Disponible',
  'avail.line': 'CDI dès septembre 2026 · Freelance dès maintenant',
  'avail.where': 'Partout en France, sur site ou en remote',

  // Home
  'home.hero.title.role': 'Développeur full-stack',
  'home.hero.lead':
    "Deux ans sur une application métier en production chez Legrand, un design system publié sur npm, une infra que j'héberge moi-même. Ce site tourne sur tout ça.",
  'home.hero.viewProjects': 'Voir les projets',
  'home.hero.contact': 'Me contacter',

  'home.profile.eyebrow': 'Profil',
  'home.profile.title': 'Un profil full-stack, à l’aise sur toute la chaîne.',
  'home.profile.body1':
    "Depuis avril 2025, je développe une application métier utilisée dans les ateliers de production de Legrand France - stage, puis job d'été, puis alternance, toujours sur le même produit. Du code que de vraies équipes utilisent tous les jours (sous NDA, donc pas de détails ici).",
  'home.profile.body2':
    "À côté, je construis mes propres outils : Nova Design System sur npm, un Gitea et sa CI sur mon VPS. Pas pour la ligne de CV - parce que maintenir un truc dans la durée apprend plus que le recommencer.",
  'home.profile.front.title': 'Front-end',
  'home.profile.front.body': `Vue.js chez Legrand, Astro sur mes projets, TypeScript partout. Et un design system maison de ${NDS_COMPONENT_COUNT} composants pour ne rien réécrire deux fois.`,
  'home.profile.back.title': 'Back-end',
  'home.profile.back.body':
    'Node et Express en production chez Legrand, PostgreSQL pour les données.',
  'home.profile.ops.title': 'Outils & déploiement',
  'home.profile.ops.body':
    "Mon Gitea, mes runners, mon Apache, mon VPS : quand ce site se déploie, c'est ma CI qui tourne, pas celle de quelqu'un d'autre.",

  'home.projects.eyebrow': 'Projets phares',
  'home.projects.title': 'Projets',
  'home.projects.all': 'Tous les projets',
  'home.projects.view': 'Voir le projet',

  'home.stack.eyebrow': 'Stack technique',
  'home.stack.title': 'Mes outils du quotidien.',

  'home.cta.title': 'Un poste, une mission, une question ?',
  'home.cta.body':
    "CDI full-stack à partir de septembre 2026, freelance dès maintenant. Basé à Limoges, mobile partout en France, à l'aise en remote. Un mail suffit.",
  'home.cta.contact': 'Me contacter',
  'home.cta.more': 'En savoir plus',

  // Work
  'work.title': 'Projets',
  'work.lead':
    "Un design system sur npm, une infra auto-hébergée, ce portfolio, et un outil Rust en cours. Le détail, les choix et les ratés de chacun.",
  'work.status.live': 'En production',
  'work.status.maintained': 'Maintenu',
  'work.status.wip': 'En cours',
  'work.backToList': 'Tous les projets',
  'work.stack': 'Stack',
  'work.links': 'Liens',
  'work.highlights': 'Points clés',
  'work.next': 'Projet suivant',

  // NDS showcase
  'nds.showcase.eyebrow': 'Exploration interactive',
  'nds.showcase.title': 'Les composants, un à un.',
  'nds.showcase.hint': 'Faites défiler pour parcourir les composants',
  'nds.showcase.tokens': 'Tokens utilisés',

  // About
  'about.title': 'À propos',
  'about.lead':
    "Développeur full-stack, formé en BUT MMI (parcours développement web) et aguerri en entreprise chez Legrand - du stage à l'alternance, sur la même application métier en production.",
  'about.exp.eyebrow': 'Expérience',
  'about.exp.title': 'Parcours',
  'about.values.eyebrow': 'Méthode',
  'about.values.title': 'Ma façon de travailler',
  'about.cv': 'Télécharger mon CV',

  // Contact
  'contact.title': 'Contact',
  'contact.lead':
    'Un poste en CDI, une mission freelance ou simplement une question : écrivez-moi, je réponds vite.',
  'contact.email.label': 'E-mail',
  'contact.email.copy': "Copier l'adresse",
  'contact.email.copied': 'Adresse copiée !',
  'contact.email.write': 'Écrire un e-mail',
  'contact.form.name': 'Votre nom',
  'contact.form.email': 'Votre e-mail',
  'contact.form.subject': 'Sujet',
  'contact.form.subject.cdi': 'Opportunité CDI',
  'contact.form.subject.freelance': 'Mission freelance',
  'contact.form.subject.other': 'Autre',
  'contact.form.message': 'Votre message',
  'contact.form.send': 'Envoyer le message',
  'contact.form.note':
    "Le bouton ouvre votre client mail avec le message pré-rempli - aucune donnée n'est stockée sur ce site.",
  'contact.elsewhere': 'Me trouver ailleurs',

  // Footer
  'footer.role': 'Développeur full-stack · Limoges · Nouvelle-Aquitaine',
  'footer.madeWith': 'Construit avec Astro + Nova Design System',

  // Voyage (home cinematic scroll)
  'voyage.hint': 'Scrollez - le voyage commence',
  'voyage.progress': 'Progression du voyage',
  'home.projects.intro.title': 'Un design system, une infra, un outil Rust. Et ce site.',
  'home.projects.intro.body':
    'Quatre projets publics, avec leur statut réel - y compris ce qui est encore en chantier.',
  'home.about.summary':
    "BUT MMI (dév. web) à l'IUT du Limousin, et deux ans chez Legrand sur la même application métier - du stage à l'alternance.",

  // Docs
  'docs.eyebrow': 'Documentation',
  'docs.title': 'Sous le capot.',
  'docs.lead':
    "Comment ce site anime le scroll, expliqué avec des démos qui tournent sous vos yeux et le vrai code du dépôt. Si vous lisez tout, vous savez le refaire.",
  'docs.toc': 'Sommaire',
  'docs.file': 'Fichier',
  'docs.why': 'Pourquoi ça marche',
  'docs.live': 'Démo - ça tourne en vrai',
  'docs.tryIt': 'Scrollez, regardez',
  'docs.trap': 'Piège',
  'docs.reading': 'Lecture ~20 min, molette obligatoire',

  // Project scenes
  'scene.hint': 'Faites défiler - la scène est pilotée par le scroll',
  'scene.infra.eyebrow': 'Sous le capot',
  'scene.infra.title': 'Le trajet d’une requête.',
  'scene.blueprint.eyebrow': 'Plan de construction',
  'scene.blueprint.title': 'Du wireframe au produit.',
  'scene.sorter.eyebrow': 'Démonstration',
  'scene.sorter.title': 'Du chaos au rangé.',

  // Misc
  'a11y.langSwitch': 'Changer de langue',
  'notfound.title': 'Page introuvable',
  'notfound.body': "Cette page n'existe pas (ou plus). Le reste du site, lui, fonctionne très bien.",
  'notfound.back': "Retour à l'accueil",
} as const;

const en: Record<UIKey, string> = {
  'meta.home.title': 'Louis Potevin - Full-stack TypeScript/Node developer · Limoges & remote',
  'meta.home.description':
    'Louis Potevin, full-stack web developer: front-end, back-end, TypeScript, Astro, Node. Available for a permanent contract (CDI) from September 2026 and for freelance work, anywhere in France or remote.',
  'meta.work.title': 'Projects - Louis Potevin, full-stack developer',
  'meta.work.description':
    'A design system published on npm, self-hosted infrastructure, Rust tooling: the projects of Louis Potevin, full-stack web developer.',
  'meta.docs.title': 'Docs - How this portfolio is built, from A to Z',
  'meta.docs.description':
    "Complete technical documentation of Louis Potevin's portfolio: Astro, i18n, Lenis, Three.js, scroll-driven scenes, design system, SEO, deployment - with the real source code.",
  'meta.about.title': 'About - Louis Potevin, full-stack developer',
  'meta.about.description':
    "Louis Potevin's background: BUT MMI degree, apprenticeship at Legrand, personal projects. Full-stack TypeScript / Node developer, open to permanent and freelance roles.",
  'meta.contact.title': 'Contact - Louis Potevin, full-stack developer',
  'meta.contact.description':
    'Get in touch with Louis Potevin, full-stack web developer. Permanent contract from September 2026 or freelance work, anywhere in France, on-site or remote.',

  'nav.home': 'Home',
  'nav.work': 'Projects',
  'nav.docs': "How it's built",
  'nav.about': 'About me',
  'nav.contact': 'Contact',
  'nav.cta': 'Get in touch',
  'nav.skip': 'Skip to content',
  'nav.lang': 'Language',

  'avail.badge': 'Available',
  'avail.line': 'Permanent contract from September 2026 · Freelance now',
  'avail.where': 'Anywhere in France, on-site or remote',

  'home.hero.title.role': 'Full-stack developer',
  'home.hero.lead':
    'Two years on a business application in production at Legrand, a design system published on npm, infrastructure I host myself. This site runs on all of it.',
  'home.hero.viewProjects': 'View projects',
  'home.hero.contact': 'Contact me',

  'home.profile.eyebrow': 'Profile',
  'home.profile.title': 'A full-stack profile, comfortable across the entire stack.',
  'home.profile.body1':
    "Since April 2025 I've been building a business application used in Legrand France's production workshops - internship, then summer job, then apprenticeship, always on the same product. Code that real teams use every day (under NDA, so no details here).",
  'home.profile.body2':
    "On the side I build my own tools: Nova Design System on npm, a Gitea and its CI on my VPS. Not for the résumé line - because maintaining something over time teaches more than restarting it.",
  'home.profile.front.title': 'Front-end',
  'home.profile.front.body': `Vue.js at Legrand, Astro on my own projects, TypeScript everywhere. Plus a ${NDS_COMPONENT_COUNT}-component in-house design system so nothing gets written twice.`,
  'home.profile.back.title': 'Back-end',
  'home.profile.back.body':
    'Node and Express in production at Legrand, PostgreSQL for the data.',
  'home.profile.ops.title': 'Tools & deployment',
  'home.profile.ops.body':
    "My Gitea, my runners, my Apache, my VPS: when this site deploys, it's my CI running, not someone else's.",

  'home.projects.eyebrow': 'Featured projects',
  'home.projects.title': 'Projects',
  'home.projects.all': 'All projects',
  'home.projects.view': 'View project',

  'home.stack.eyebrow': 'Tech stack',
  'home.stack.title': 'My everyday tools.',

  'home.cta.title': 'A role, a mission, a question?',
  'home.cta.body':
    'Full-stack permanent role from September 2026, freelance right now. Based in Limoges, mobile anywhere in France, comfortable remote. One email is all it takes.',
  'home.cta.contact': 'Contact me',
  'home.cta.more': 'Learn more',

  'work.title': 'Projects',
  'work.lead':
    'A design system on npm, self-hosted infrastructure, this portfolio, and a Rust tool in progress. The details, choices and missteps of each.',
  'work.status.live': 'Live',
  'work.status.maintained': 'Maintained',
  'work.status.wip': 'In progress',
  'work.backToList': 'All projects',
  'work.stack': 'Stack',
  'work.links': 'Links',
  'work.highlights': 'Highlights',
  'work.next': 'Next project',

  'nds.showcase.eyebrow': 'Interactive tour',
  'nds.showcase.title': 'The components, one by one.',
  'nds.showcase.hint': 'Scroll to browse the components',
  'nds.showcase.tokens': 'Tokens in use',

  'about.title': 'About me',
  'about.lead':
    'Full-stack developer, trained through a BUT MMI degree (web development track) and battle-tested at Legrand - from internship to apprenticeship, on the same business application in production.',
  'about.exp.eyebrow': 'Experience',
  'about.exp.title': 'Background',
  'about.values.eyebrow': 'Method',
  'about.values.title': 'How I work',
  'about.cv': 'Download my resume',

  'contact.title': 'Contact',
  'contact.lead':
    'A permanent role, a freelance mission or just a question: write to me, I reply fast.',
  'contact.email.label': 'E-mail',
  'contact.email.copy': 'Copy address',
  'contact.email.copied': 'Address copied!',
  'contact.email.write': 'Write an e-mail',
  'contact.form.name': 'Your name',
  'contact.form.email': 'Your e-mail',
  'contact.form.subject': 'Subject',
  'contact.form.subject.cdi': 'Permanent position (CDI)',
  'contact.form.subject.freelance': 'Freelance mission',
  'contact.form.subject.other': 'Other',
  'contact.form.message': 'Your message',
  'contact.form.send': 'Send message',
  'contact.form.note':
    'The button opens your mail client with the message pre-filled - no data is stored on this site.',
  'contact.elsewhere': 'Find me elsewhere',

  'footer.role': 'Full-stack developer · Limoges · Nouvelle-Aquitaine, France',
  'footer.madeWith': 'Built with Astro + Nova Design System',

  'voyage.hint': 'Scroll - the journey begins',
  'voyage.progress': 'Journey progress',
  'home.projects.intro.title': 'A design system, an infra, a Rust tool. And this site.',
  'home.projects.intro.body':
    'Four public projects, with their real status - including what is still under construction.',
  'home.about.summary':
    'BUT MMI degree (web dev) at IUT du Limousin, and two years at Legrand on the same business application - from internship to apprenticeship.',

  'docs.eyebrow': 'Documentation',
  'docs.title': 'Under the hood.',
  'docs.lead':
    'How this site animates scrolling, explained with demos running before your eyes and the real code from the repo. Read it all and you can rebuild it.',
  'docs.toc': 'Contents',
  'docs.file': 'File',
  'docs.why': 'Why it works',
  'docs.live': 'Demo - running for real',
  'docs.tryIt': 'Scroll and watch',
  'docs.trap': 'Gotcha',
  'docs.reading': '~20 min read, scroll wheel required',

  'scene.hint': 'Keep scrolling - the scene is driven by scroll',
  'scene.infra.eyebrow': 'Under the hood',
  'scene.infra.title': 'The journey of a request.',
  'scene.blueprint.eyebrow': 'Blueprint',
  'scene.blueprint.title': 'From wireframe to product.',
  'scene.sorter.eyebrow': 'Live demo',
  'scene.sorter.title': 'From chaos to order.',

  'a11y.langSwitch': 'Switch language',
  'notfound.title': 'Page not found',
  'notfound.body': "This page doesn't exist (anymore). The rest of the site works just fine.",
  'notfound.back': 'Back to home',
};

export type UIKey = keyof typeof fr;
export const ui = { fr, en } as const;
