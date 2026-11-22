import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SKIP = new Set(["node_modules", ".git", "dist", "build", ".next", "coverage", "__pycache__", ".venv", "venv", "target", ".cache"]);
export function walk(root: string, max = 5000): string[] {
  const out: string[] = [];
  const rec = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (out.length >= max) return;
      if (e.isDirectory()) { if (!SKIP.has(e.name)) rec(join(d, e.name)); }
      else if (e.isFile()) out.push(join(d, e.name));
    }
  };
  rec(root);
  return out;
}
export const rel = (root: string, p: string) => relative(root, p) || p;
export function readText(p: string, maxBytes = 1_000_000): string | null {
  try {
    if (statSync(p).size > maxBytes) return null;
    const b = readFileSync(p);
    if (b.includes(0)) return null;
    return b.toString("utf8");
  } catch { return null; }
}
