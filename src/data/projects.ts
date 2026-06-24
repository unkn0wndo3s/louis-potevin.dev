// ─────────────────────────────────────────────────────────────────────────────
// Projects — real content. Edit freely.
// `icon` matches a simple-icons-astro component (using PascalCase elsewhere).
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectStatus = 'live' | 'maintenu' | 'archive' | 'r&d';

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
    tagline: 'Astro component library — tokens, accessibility, npm distribution.',
    period: '2026 — ongoing',
    role: 'Author · maintainer',
    status: 'maintenu',
    featured: true,
    summary:
      'The design system that powers this website and will power my other projects. 29 Astro components across six families, a complete set of tokens (color, typography, spacing, radius), and a light/dark theme managed via CSS variables.',
    context: [
      'Designed for clean, technical interfaces: mono fonts for headings, sans-serif for body text.',
      'Distributed under the npm scope @unkn0wndo3s, automatically published via a CI pipeline.',
      'License: free to use, resale of the design system as a standalone product is prohibited.',
    ],
    contributions: [
      'Architecture of tokens and components (Custom Elements, typed events, slots).',
      'Gitea Actions CI/CD pipeline for automated npm publishing and documentation deployment.',
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
    tagline: 'Containerized services, CI/CD, and secured ingress on a fully controlled infrastructure.',
    period: '2025 — ongoing',
    role: 'Design & operations',
    status: 'live',
    featured: true,
    summary:
      'A comprehensive self-hosted infrastructure: Git hosting, secret management, and application services, all containerized with Docker and continuously deployed.',
    context: [
      'Fully containerized with Docker, orchestrated, and reproducible.',
      'Certificates and DNS managed through Cloudflare.',
      'Services cleanly exposed using a reverse proxy.',
    ],
    contributions: [
      'Setup of a self-hosted Gitea instance with a Postgres backend and action runners.',
      'End-to-end automated CI/CD pipelines (build, test, publish).',
      'Day-to-day operations: Docker networks, volume mounts, DNS, and diagnostics.',
    ],
    stack: [
      { icon: 'docker', label: 'Docker' },
      { icon: 'linux', label: 'Linux' },
      { icon: 'cloudflare', label: 'Cloudflare Tunnel' },
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
      'A static multi-page portfolio website. The content is entirely built using Nova components, featuring a subtle, discrete Three.js space background.',
    context: [
      'Three.js space background: starfield, nebula, and an ambient asteroid.',
      'UI entirely composed using the in-house design system.',
      'Astro multi-page setup with Static Site Generation (SSG), optimized for SEO.',
    ],
    contributions: [
      'Full integration using Nova tokens and components.',
      'Adherence to prefers-reduced-motion and graceful degradation when WebGL is unavailable.',
      'Meticulous SEO: metadata, structured data, and sitemap generation.',
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
    title: 'File Organizer — Java to Rust',
    tagline: 'File sorting tool, currently being ported from Java to Rust.',
    period: '2025 — ongoing',
    role: 'Development',
    status: 'r&d',
    featured: false,
    summary:
      'A file organizer tool that currently runs in Java on Windows. It is being converted to Rust to achieve cross-platform Linux compatibility and optimize file search performance.',
    context: [
      'Current version: operational in Java, targeting Windows.',
      'Gradual porting to Rust for performance gains and low-level control.',
    ],
    contributions: [
      'Rewriting sorting logic from Java to Rust.',
      'Setting objectives for Linux compatibility and file search optimization.',
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
    tagline: 'Small language model trained on a Reddit conversation dataset.',
    period: '2025 — ongoing',
    role: 'Development',
    status: 'r&d',
    featured: false,
    summary:
      'A language model training and inference project running on a dedicated machine. The model is trained on a custom dataset of Reddit conversations. Development is ongoing.',
    context: [
      'Execution on a dedicated workstation optimized for training and inference.',
      'Dataset: conversation threads sourced from Reddit.',
    ],
    contributions: [
      'Assembling and preprocessing the conversation dataset.',
      'Setting up the training and inference loop, currently iterating on results.',
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
  maintenu: { label: 'Maintained', tone: 'primary' },
  'r&d': { label: 'In Progress', tone: 'warning' },
  archive: { label: 'Archived', tone: 'neutral' },
};