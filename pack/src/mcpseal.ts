#!/usr/bin/env node
import * as z from "zod/v4";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { main, tool } from "../shared/runner.js";
import { walk, rel, readText } from "../shared/fs.js";

type Finding = { sev: "high" | "medium" | "low" | "info"; cost: number; msg: string };
const CODE_RULES: [RegExp, Finding][] = [
  [/\b(eval\s*\(|new Function\s*\()/, { sev: "high", cost: 15, msg: "Runs dynamic code (eval / new Function)" }],
  [/(\.ssh|\.aws\/credentials|id_rsa|\.npmrc|\.netrc|\.gnupg|Login Data|\.config\/gcloud)/, { sev: "high", cost: 20, msg: "References credential or key files" }],
  [/JSON\.stringify\(\s*process\.env\s*\)|Object\.(entries|keys|values)\(\s*process\.env\s*\)/, { sev: "high", cost: 20, msg: "Reads all environment variables at once" }],
  [/https?:\/\/(?!127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, { sev: "medium", cost: 10, msg: "Contacts a hard-coded IP address" }],
  [/child_process/, { sev: "medium", cost: 8, msg: "Can run shell commands (child_process)" }],
  [/(atob|Buffer\.from)\([^)]{20,}\)[\s\S]{0,80}(eval|Function|exec)/, { sev: "high", cost: 15, msg: "Decodes hidden data then executes it" }],
  [/(pastebin\.com|webhook\.site|ngrok\.io|requestbin|discord(app)?\.com\/api\/webhooks)/i, { sev: "high", cost: 20, msg: "Sends data to a paste or webhook site" }],
];
const NET = /\b(fetch\(|https?\.request|axios|XMLHttpRequest|net\.connect)/;

function grade(s: number) { return s >= 90 ? "A" : s >= 80 ? "B" : s >= 65 ? "C" : s >= 50 ? "D" : "F"; }
function badge(g: string, s: number) {
  const col = { A: "#2ea44f", B: "#6cc24a", C: "#dfb317", D: "#fe7d37", F: "#e05d44" }[g as "A"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="20" role="img" aria-label="mcpseal: ${g} ${s}"><rect width="78" height="20" fill="#555"/><rect x="78" width="72" height="20" fill="${col}"/><g fill="#fff" font-family="Verdana,sans-serif" font-size="11"><text x="8" y="14">mcpseal</text><text x="86" y="14">${g} · ${s}/100</text></g></svg>`;
}

function inspect(dir: string, meta: any, fromRegistry: boolean) {
  const f: Finding[] = [];
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  for (const k of ["preinstall", "install", "postinstall"]) if (pkg.scripts?.[k]) f.push({ sev: "high", cost: 25, msg: `Runs "${k}" script on install: ${String(pkg.scripts[k]).slice(0, 60)}` });
  if (!pkg.license) f.push({ sev: "low", cost: 8, msg: "No license declared" });
  if (!pkg.repository) f.push({ sev: "low", cost: 8, msg: "No source repository linked" });
  const deps = Object.keys(pkg.dependencies ?? {}).length;
  if (deps > 50) f.push({ sev: "medium", cost: 10, msg: `${deps} direct dependencies (large attack surface)` });
  else if (deps > 25) f.push({ sev: "low", cost: 5, msg: `${deps} direct dependencies` });
  if (fromRegistry && meta) {
    if (meta.deprecated) f.push({ sev: "high", cost: 30, msg: `Deprecated: ${String(meta.deprecated).slice(0, 80)}` });
    const created = meta.time?.created ? Date.parse(meta.time.created) : 0;
    if (created && Date.now() - created < 14 * 864e5) f.push({ sev: "medium", cost: 10, msg: "Package is less than 14 days old" });
    const m = Array.isArray(meta.maintainers) ? meta.maintainers.length : 0;
    if (m === 1) f.push({ sev: "info", cost: 0, msg: "Single maintainer account" });
  }
  let net = false; const seen = new Set<string>();
  for (const file of walk(dir)) {
    if (!/\.(m?js|cjs|ts|json)$/.test(file) || /node_modules|(^|[\/])(tests?|__tests__|scripts|examples?|docs?)[\/]|\.(test|spec)\./.test(rel(dir, file))) continue;
    const s = readText(file); if (!s) continue;
    if (NET.test(s)) net = true;
    for (const [re, fd] of CODE_RULES) if (re.test(s) && !seen.has(fd.msg)) { seen.add(fd.msg); f.push({ ...fd, msg: `${fd.msg} (${rel(dir, file)})` }); }
  }
  if (net) f.push({ sev: "info", cost: 0, msg: "Makes network requests. Check where it sends data." });
  return { name: pkg.name, version: pkg.version, findings: f };
}

const t = tool({
  name: "mcpseal_check",
  title: "Safety-check an MCP server before installing",
  description: "Grade an npm package or local folder A-F for supply-chain risk before you install it: install scripts, credential access, dynamic code, shell use, hidden network calls. Optionally write a README badge SVG.",
  schema: z.object({ target: z.string().describe("npm package name (e.g. @scope/server) or a local folder"), badge: z.string().optional().describe("Write a badge SVG to this path") }),
  run: ({ target, badge: badgePath }) => {
    let dir = target, meta: any = null, reg = false;
    if (!(existsSync(target) && statSync(target).isDirectory())) {
      if (!/^(@[a-z0-9._~-]+\/)?[a-z0-9._~-]+(@[\w.^~-]+)?$/i.test(target)) throw new Error("Give an npm package name or an existing folder.");
      const tmp = mkdtempSync(join(tmpdir(), "mcpseal-")); reg = true;
      try { meta = JSON.parse(execFileSync("npm", ["view", target, "--json"], { encoding: "utf8", timeout: 60000 })); } catch { throw new Error(`Could not find "${target}" on npm.`); }
      if (Array.isArray(meta)) meta = meta[meta.length - 1];
      const out = execFileSync("npm", ["pack", target, "--json", "--pack-destination", tmp], { encoding: "utf8", timeout: 120000 });
      const file = JSON.parse(out)[0].filename;
      execFileSync("tar", ["-xzf", join(tmp, file), "-C", tmp]);
      dir = join(tmp, "package");
    }
    const r = inspect(dir, meta, reg);
    const score = Math.max(0, 100 - r.findings.reduce((a, x) => a + x.cost, 0)), g = grade(score);
    if (badgePath) writeFileSync(badgePath, badge(g, score));
    const order = { high: 0, medium: 1, low: 2, info: 3 };
    const lines = r.findings.sort((a, b) => order[a.sev] - order[b.sev]).map((x) => `  [${x.sev.toUpperCase()}] ${x.msg}`);
    return `${r.name}@${r.version}\nSeal: ${g}  (${score}/100)\n\n${lines.length ? lines.join("\n") : "  No findings."}\n\nStatic check only. It cannot prove a package is safe. Review anything graded C or lower before installing.${badgePath ? `\n\nBadge written to ${badgePath}. Add to your README:\n![mcpseal](${badgePath})` : ""}`;
  },
});
main("mcpseal", "0.1.0", [t]);
