import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { Report } from "./analyze.js";

type Snapshot = Record<string, Record<string, string>>; // server -> tool -> hash

export function snapshot(r: Report): Snapshot {
  const out: Snapshot = {};
  for (const s of r.servers) {
    if (s.measurement.status !== "ok") continue;
    out[s.name] = Object.fromEntries(s.measurement.tools.map(t => [t.name, t.hash]));
  }
  return out;
}

export const saveBaseline = (r: Report, file: string) => writeFileSync(file, JSON.stringify({ version: 1, servers: snapshot(r) }, null, 2));

/** Compare today's tools with a saved baseline. Any change to a tool you already trusted is a rug-pull signal. */
export function diffBaseline(r: Report, file: string): { changed: string[]; added: string[]; removed: string[] } {
  if (!existsSync(file)) throw new Error(`No baseline at ${file}. Create one with --save-baseline ${file}`);
  const base: Snapshot = JSON.parse(readFileSync(file, "utf8")).servers ?? {};
  const now = snapshot(r);
  const changed: string[] = [], added: string[] = [], removed: string[] = [];
  for (const [srv, tools] of Object.entries(now)) {
    for (const [t, h] of Object.entries(tools)) {
      const prev = base[srv]?.[t];
      if (prev === undefined) added.push(`${srv}/${t}`);
      else if (prev !== h) changed.push(`${srv}/${t}`);
    }
    for (const t of Object.keys(base[srv] ?? {})) if (!(t in tools)) removed.push(`${srv}/${t}`);
  }
  for (const srv of Object.keys(base)) if (!(srv in now)) removed.push(`${srv}/*`);
  return { changed, added, removed };
}
