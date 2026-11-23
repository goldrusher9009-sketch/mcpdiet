#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { main, tool } from "../shared/runner.js";

const t = tool({
  name: "sbom_lite",
  title: "List every dependency from package-lock.json",
  description: "Read package-lock.json and list all installed packages with versions and licenses, split into direct and indirect, with install-script flags.",
  schema: z.object({ path: z.string().default(".") }),
  run: ({ path }) => {
    const f = join(path, "package-lock.json"); if (!existsSync(f)) throw new Error("No package-lock.json found.");
    const lock = JSON.parse(readFileSync(f, "utf8")); const pk = lock.packages ?? {}; const root = pk[""] ?? {}; const direct = new Set([...Object.keys(root.dependencies ?? {}), ...Object.keys(root.devDependencies ?? {})]);
    const rows = Object.entries<any>(pk).filter(([k]) => k).map(([k, v]) => ({ name: k.split("node_modules/").pop()!, v: v.version, lic: v.license ?? "?", scripts: !!v.hasInstallScript, dev: !!v.dev }));
    const d = rows.filter((r) => direct.has(r.name));
    return `${rows.length} packages (${d.length} direct, ${rows.length - d.length} indirect)\nWith install scripts: ${rows.filter((r) => r.scripts).map((r) => r.name).join(", ") || "none"}\nUnknown license: ${rows.filter((r) => r.lic === "?").length}\n\nDirect:\n` + d.map((r) => `  ${r.name}@${r.v}  ${r.lic}${r.dev ? "  (dev)" : ""}`).join("\n");
  },
});
main("sbom-lite", "0.1.0", [t]);
