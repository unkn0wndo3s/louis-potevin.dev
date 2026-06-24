export const site = {
  name: "Louis Potevin",
  handle: "unkn0wn",
  role: "Full-stack developer",
  domain: "louis-potevin.dev",
  location: "Limoges · Nouvelle-Aquitaine",
  // Job Search
  availability: "Permanent contract (CDI) — September 2026",
  mobility: "Anywhere in France, on-site or remote",
  // Contact
  email: "contact@louis-potevin.dev",
  // External links (icons via simple-icons-astro)
  links: {
    gitea: {
      label: "Gitea",
      url: "https://git.novaprojects.dev/unkn0wn",
      icon: "gitea",
    },
    github: {
      label: "GitHub",
      url: "https://github.com/unkn0wndo3s",
      icon: "github",
    },
    npm: {
      label: "npm",
      url: "https://www.npmjs.com/~unkn0wndo3s",
      icon: "npm",
    },
    linkedin: {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/louis-potevin",
      icon: "linkedin",
    },
  },
} as const;

export type SiteLink = { label: string; url: string; icon: string };
