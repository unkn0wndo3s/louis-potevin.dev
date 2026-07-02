/**
 * Brand icon paths, extracted from the installed `simple-icons-astro` package
 * at build time (`?raw` + regex). Why not use its components directly? Two
 * validator-breaking issues: the generated <svg> carries a duplicate `fill`
 * attribute, and each icon embeds a <title> that doubles every name for
 * screen readers and text extraction ("AstroAstro"). Rendering the raw path
 * ourselves fixes both, and stays in sync with the package version.
 */
import apache from '../../node_modules/simple-icons-astro/dist/Apache.astro?raw';
import astro from '../../node_modules/simple-icons-astro/dist/Astro.astro?raw';
import cloudflare from '../../node_modules/simple-icons-astro/dist/Cloudflare.astro?raw';
import docker from '../../node_modules/simple-icons-astro/dist/Docker.astro?raw';
import figma from '../../node_modules/simple-icons-astro/dist/Figma.astro?raw';
import git from '../../node_modules/simple-icons-astro/dist/Git.astro?raw';
import gitea from '../../node_modules/simple-icons-astro/dist/Gitea.astro?raw';
import github from '../../node_modules/simple-icons-astro/dist/Github.astro?raw';
import javascript from '../../node_modules/simple-icons-astro/dist/Javascript.astro?raw';
import linux from '../../node_modules/simple-icons-astro/dist/Linux.astro?raw';
import nodedotjs from '../../node_modules/simple-icons-astro/dist/Nodedotjs.astro?raw';
import npm from '../../node_modules/simple-icons-astro/dist/Npm.astro?raw';
import postgresql from '../../node_modules/simple-icons-astro/dist/Postgresql.astro?raw';
import python from '../../node_modules/simple-icons-astro/dist/Python.astro?raw';
import rust from '../../node_modules/simple-icons-astro/dist/Rust.astro?raw';
import sass from '../../node_modules/simple-icons-astro/dist/Sass.astro?raw';
import threedotjs from '../../node_modules/simple-icons-astro/dist/Threedotjs.astro?raw';
import typescript from '../../node_modules/simple-icons-astro/dist/Typescript.astro?raw';
import vuedotjs from '../../node_modules/simple-icons-astro/dist/Vuedotjs.astro?raw';

export interface BrandIcon {
  d: string;
  brand: string;
}

function parse(raw: string, label: string): BrandIcon {
  const d = raw.match(/ d="([^"]+)"/)?.[1];
  const brand = raw.match(/fill="(#[0-9A-Fa-f]{3,8})"/)?.[1] ?? 'currentColor';
  if (!d) throw new Error(`brandIcons: no path found for ${label}`);
  return { d, brand };
}

export const BRAND_ICONS: Record<string, BrandIcon> = {
  Apache: parse(apache, 'Apache'),
  Astro: parse(astro, 'Astro'),
  Cloudflare: parse(cloudflare, 'Cloudflare'),
  Docker: parse(docker, 'Docker'),
  Figma: parse(figma, 'Figma'),
  Git: parse(git, 'Git'),
  Gitea: parse(gitea, 'Gitea'),
  Github: parse(github, 'Github'),
  Javascript: parse(javascript, 'Javascript'),
  Linux: parse(linux, 'Linux'),
  Nodedotjs: parse(nodedotjs, 'Nodedotjs'),
  Npm: parse(npm, 'Npm'),
  Postgresql: parse(postgresql, 'Postgresql'),
  Python: parse(python, 'Python'),
  Rust: parse(rust, 'Rust'),
  Sass: parse(sass, 'Sass'),
  Threedotjs: parse(threedotjs, 'Threedotjs'),
  Typescript: parse(typescript, 'Typescript'),
  Vuedotjs: parse(vuedotjs, 'Vuedotjs'),
};
