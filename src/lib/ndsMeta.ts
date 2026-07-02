/**
 * Nova Design System metadata - never hard-coded again.
 *
 * - The component list (and therefore the count) is parsed from the installed
 *   package's export index at build time: what npm ships is what we display.
 * - The version is fetched from the npm registry at build time so the site
 *   shows the LATEST published release even if the local dependency lags;
 *   if the registry is unreachable, we fall back to the installed version.
 */
import indexRaw from '../../node_modules/@unkn0wndo3s/nova-design-system/src/components/index.ts?raw';
import pkgRaw from '../../node_modules/@unkn0wndo3s/nova-design-system/package.json?raw';

export const NDS_PACKAGE = '@unkn0wndo3s/nova-design-system';

/** Every exported component name, alphabetical. */
export const NDS_COMPONENTS: string[] = [...indexRaw.matchAll(/export \{ default as (\w+) \}/g)]
  .map((m) => m[1]!)
  .sort((a, b) => a.localeCompare(b));

export const NDS_COMPONENT_COUNT = NDS_COMPONENTS.length;

export const NDS_INSTALLED_VERSION: string = (JSON.parse(pkgRaw) as { version: string }).version;

let cached: string | null = null;

/** Latest published version (npm registry, build-time), falling back to the installed one. */
export async function getNdsVersion(): Promise<string> {
  if (cached) return cached;
  try {
    const res = await fetch(`https://registry.npmjs.org/${NDS_PACKAGE}/latest`, {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const { version } = (await res.json()) as { version: string };
      if (version) {
        cached = version;
        return version;
      }
    }
  } catch {
    /* offline build - installed version is the best truth we have */
  }
  cached = NDS_INSTALLED_VERSION;
  return cached;
}
