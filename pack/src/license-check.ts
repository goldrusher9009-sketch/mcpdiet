#!/usr/bin/env node
import * as z from "zod/v4";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { main, tool } from "../shared/runner.js";

const COPYLEFT = /(AGPL|GPL|LGPL|SSPL|EUPL|MPL|CC-BY-SA)/i;
function pkgs(nm: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(nm, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name.startsWith(".")) continue;
    if (e.name.startsWith("@")) for (const s of readdirSync(join(nm, e.name))) out.push(join(nm, e.name, s));
    else out.push(join(nm, e.name));
  }
  return out;
}
const t = tool({
  name: "license_check",
  title: "Audit dependency licenses",
  description: "Summarize licenses of installed npm dependencies and flag copyleft or missing licenses.",
  schema: z.object({ path: z.string().default(".").describe("Project folder containing node_modules") }),
  run: ({ path }) => {
    const nm = join(path, "node_modules");
    if (!existsSync(nm)) throw new Error("No node_modules found. Run npm install first.");
    const counts = new Map<string, number>(); const flagged: string[] = [];
    for (const d of pkgs(nm)) {
      try {
        const j = JSON.parse(readFileSync(join(d, "package.json"), "utf8"));
        const lic = typeof j.license === "string" ? j.license : j.license?.type ?? (Array.isArray(j.licenses) ? j.licenses.map((l: any) => l.type).join(" OR ") : "UNKNOWN");
        counts.set(lic, (counts.get(lic) ?? 0) + 1);
        if (lic === "UNKNOWN" || COPYLEFT.test(lic)) flagged.push(`${j.name}@${j.version}  ${lic}`);
      } catch {}
    }
    const summary = [...counts].sort((a, b) => b[1] - a[1]).map(([l, c]) => `${String(c).padStart(5)}  ${l}`).join("\n");
    return `Licenses:\n${summary}\n\n${flagged.length ? `Needs review (${flagged.length}):\n${flagged.join("\n")}` : "No copyleft or unknown licenses."}`;
  },
});
main("license-check", "0.1.0", [t]);
