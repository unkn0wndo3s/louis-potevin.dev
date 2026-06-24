// Projects - real content. Edit freely.
// `icon` matches a simple-icons-astro component (using PascalCase elsewhere).

export type ProjectStatus = 'live' | 'maintained' | 'archived' | 'r&d';

export interface ProjectLink {
  label: string;
  url: string;
  icon?: string;
}

export interface Project {
  slug: string;
  designation: string; // catalog index, e.g. "01"
  title: string;
  tagline: string;
  period: string;
  role: string;
  status: ProjectStatus;
  featured: boolean;
  summary: string;
  context: string[];
  contributions: string[];
  stack: { icon: string; label: string }[];
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    slug: 'nova-design-system',
    designation: '01',
    title: 'Nova Design System',
    tagline: 'Astro component library - tokens, accessibility, npm distribution.',
    period: '2026 - ongoing',
    role: 'Author · maintainer',
    status: 'maintained',
    featured: true,
    summary:
      'A library of 29 Astro components across six families, with a complete token system (color, typography, spacing, radius) and a light/dark theme driven by CSS variables. Currently at version 1.2.1, it powers this portfolio and will be progressively adapted to my other projects, including outside the Astro ecosystem (a GPUI/Rust binding is planned for File Organizer).',
    context: [
      'Designed for clean, technical interfaces: mono fonts for headings, sans-serif for body text.',
      'Distributed under the npm scope @unkn0wndo3s, published automatically via a CI pipeline.',
      'License: free to use, resale of the design system as a standalone product is prohibited.',
      'Adoption is currently internal: the download spikes seen on npm in the days after each release are mostly bot/CI traffic rather than organic external adoption so far.',
    ],
    contributions: [
      'Architecture of tokens and components (Custom Elements, typed events, slots).',
      'Gitea Actions CI/CD pipeline for automated npm publishing: checkout, version check, install, publish — about 19s end to end.',
      'Current documentation: component list and status at nds.louis-potevin.dev, with technical usage docs coming next.',
      '6-12 month roadmap: automatic component export on every release, new components, complete documentation. Longer term (12+ months): ports to Vue.js, React, Svelte, Java, and a Rust package, with docs kept up to date for each target.',
    ],
    stack: [
      { icon: 'astro', label: 'Astro' },
      { icon: 'typescript', label: 'TypeScript' },
      { icon: 'sass', label: 'Sass' },
      { icon: 'gitea', label: 'Gitea CI' },
    ],
    links: [
      { label: 'Nova Design System v1.2.1', url: 'https://nds.louis-potevin.dev/', icon: 'astro' },
      { label: 'npm', url: 'https://www.npmjs.com/package/@unkn0wndo3s/nova-design-system', icon: 'npm' },
      { label: 'Sources (Gitea)', url: 'https://git.novaprojects.dev/unkn0wn/nova-design-system', icon: 'gitea' },
    ],
  },
  {
    slug: 'nova-infra',
    designation: '02',
    title: 'Self-hosted Infrastructure & Deployment',
    tagline: 'Containerized services, CI/CD, and secured ingress on a dedicated server.',
    period: '2025 - ongoing',
    role: 'Design & operations',
    status: 'live',
    featured: true,
    summary:
      'Self-hosted infrastructure running on a dedicated OVH server. Four application containers currently active alongside the hosted sites, with Git, secret management, and exposure through an Apache reverse proxy.',
    context: [
      'Containerized with Docker on a dedicated OVH server.',
      'Services exposed through an Apache reverse proxy, suited to a dedicated-machine setup.',
      'Two domains managed: novaprojects.dev (4+ subdomains for self-hosted services) and louis-potevin.dev (1 subdomain).',
    ],
    contributions: [
      'Setup and administration of a self-hosted Gitea instance with a Postgres backend and one Actions runner.',
      'Lightweight CI/CD pipelines (build, test, publish), running in about 10-20 seconds.',
      'Day-to-day operations: Docker networks, volumes, DNS, diagnostics.',
      'Identified improvement areas: no monitoring or backup strategy in place yet — next iteration of the infrastructure.',
    ],
    stack: [
      { icon: 'docker', label: 'Docker' },
      { icon: 'linux', label: 'Linux' },
      { icon: 'apache', label: 'Apache (reverse proxy)' },
      { icon: 'gitea', label: 'Gitea' },
    ],
    links: [{ label: 'Gitea', url: 'https://git.novaprojects.dev/unkn0wn', icon: 'gitea' }],
  },
  {
    slug: 'portfolio',
    designation: '03',
    title: 'louis-potevin.dev',
    tagline: 'This website. Multi-page Astro app, 3D space background, 100% powered by Nova Design System.',
    period: '2026',
    role: 'Design & development',
    status: 'live',
    featured: true,
    summary:
      'A static multi-page portfolio (5 pages), entirely composed with Nova components, with a subtle Three.js space background. Built in one day, recently shipped.',
    context: [
      'Three.js background: starfield, nebula, and an ambient asteroid.',
      'UI entirely composed using the in-house design system.',
      'Astro with Static Site Generation (SSG), chosen for its simplicity over Svelte (already comfortable with Vue.js, and not fond of the Svelte DX).',
    ],
    contributions: [
      'Full integration of Nova tokens and components.',
      'Respects prefers-reduced-motion and degrades gracefully when WebGL is unavailable.',
      'Current Lighthouse scores: Accessibility 100, Best Practices 100, SEO 92, Performance 92.',
      'Roadmap: multilingual version, dark/light mode toggle. No audience data yet (site just went live), no CV download for now.',
    ],
    stack: [
      { icon: 'astro', label: 'Astro' },
      { icon: 'typescript', label: 'TypeScript' },
      { icon: 'sass', label: 'Sass' },
    ],
    links: [{ label: 'Unkn0wn Projects', url: 'https://louis-potevin.dev/', icon: 'astro' }],
  },
  {
    slug: 'rust-file-organizer',
    designation: '04',
    title: 'File Organizer - Java to Rust',
    tagline: 'File sorting tool, currently being ported from Java to Rust.',
    period: '2025 - ongoing',
    role: 'Development',
    status: 'r&d',
    featured: false,
    summary:
      'An automatic sorting tool that moves downloaded files and folders into dedicated directories (executables, archives, etc.) at the root of the downloads folder, alongside the existing images/videos/documents directories. The Java version, functional on Windows, is being ported to Rust for Linux compatibility, cleaner code, and a simpler build.',
    context: [
      'Current Java version: many dependencies, slower build, loosely structured code, requires Java installed (or shipping the executable).',
      'Rust version: better organized code, simpler compilation, expected scan performance on par with or better than Java.',
      'GUI built with GPUI (used for the interface only), with a side console for monitoring/diagnosing errors.',
    ],
    contributions: [
      'Sorting logic: moves files/folders into type-specific directories (executables, archives, etc.), with subfolders grouped into a "folders" directory.',
      'Sorting safety under review: the Java version copied then deleted the source after the copy completed (to prevent data loss); the approach will be revisited in Rust.',
      'Key goal of the port: deep recursive scanning — the Java version only knows about files/folders it has moved or seen at the surface level, not nested contents.',
      'Current state: UI nearly complete, sorting logic still to be rewritten; tested on small volumes so far, targeting 10k+ files at once since it runs on startup.',
      'Open source on GitHub; will move to Gitea once the Rust port is finished.',
    ],
    stack: [
      { icon: 'rust', label: 'Rust' },
      { icon: 'linux', label: 'Linux (upcoming)' },
    ],
    links: [],
  },
  {
    slug: 'llm-tooling',
    designation: '05',
    title: 'LLM Training & Inference',
    tagline: 'Language models trained on a Reddit conversation dataset, aiming for a voice-capable, autonomous assistant.',
    period: '2025 - ongoing',
    role: 'Development',
    status: 'r&d',
    featured: false,
    summary:
      'A language model training and inference project on a dedicated machine, scaling up progressively: 100M, then 500M, 1B, and potentially 3B parameters. The end goal is a voice-capable conversational AI that learns from its conversations and gains a degree of autonomy.',
    context: [
      'Dedicated machine: Ryzen 9 9900X, RTX 5070 Ti, 64GB DDR5 6400MHz CL32.',
      'Dataset: Reddit conversations, starting at roughly 100GB with a target of scaling up to 1-2TB.',
      'Custom in-house inference script (currently being designed).',
    ],
    contributions: [
      'Assembling and structuring the Reddit conversation dataset.',
      'Setting up the training pipeline, currently in the preparation phase (training has not started yet, so no quality metrics are available at this stage).',
    ],
    stack: [
      { icon: 'python', label: 'Python' },
      { icon: 'linux', label: 'Linux' },
    ],
    links: [],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const statusMeta: Record<ProjectStatus, { label: string; tone: 'success' | 'primary' | 'neutral' | 'warning' }> = {
  live: { label: 'Live', tone: 'success' },
  maintained: { label: 'Maintained', tone: 'primary' },
  'r&d': { label: 'In Progress', tone: 'warning' },
  archived: { label: 'Archived', tone: 'neutral' },
};