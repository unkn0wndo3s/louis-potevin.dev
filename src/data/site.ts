/** Profile and links - single source of truth for the whole site. */
export const site = {
  name: 'Louis Potevin',
  email: 'contact@louis-potevin.dev',
  location: { city: 'Limoges', region: 'Nouvelle-Aquitaine', country: 'FR' },
  availability: { cdiFrom: '2026-09', freelance: true },
  links: {
    github: { label: 'GitHub', url: 'https://github.com/unkn0wndo3s' },
    gitea: { label: 'Gitea', url: 'https://git.novaprojects.dev/unkn0wn' },
    npm: { label: 'npm', url: 'https://www.npmjs.com/~unkn0wndo3s' },
    linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/louis-potevin' },
  },
} as const;

/** Everyday tools, shown on the home page. `icon` maps to simple-icons-astro names. */
export const stack = [
  { name: 'Astro', icon: 'Astro' },
  { name: 'Vue.js', icon: 'Vuedotjs' },
  { name: 'TypeScript', icon: 'Typescript' },
  { name: 'JavaScript', icon: 'Javascript' },
  { name: 'Sass', icon: 'Sass' },
  { name: 'Node.js', icon: 'Nodedotjs' },
  { name: 'PostgreSQL', icon: 'Postgresql' },
  { name: 'Docker', icon: 'Docker' },
  { name: 'Linux', icon: 'Linux' },
  { name: 'Cloudflare', icon: 'Cloudflare' },
  { name: 'Gitea CI/CD', icon: 'Gitea' },
  { name: 'Rust', icon: 'Rust' },
  { name: 'Python', icon: 'Python' },
  { name: 'Git', icon: 'Git' },
  { name: 'Figma', icon: 'Figma' },
] as const;
