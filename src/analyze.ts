import type { ServerEntry } from "./configs.js";
import { measureServer, type Measurement } from "./measure.js";

export type Severity = "high" | "medium" | "low";
export interface Finding {
  severity: Severity;
  server?: string;
  title: string;
  fix: string;
  savesTokens?: number;
}

export interface ServerReport {
  name: string;
  source: string;
  kind: "stdio" | "remote";
  measurement: Measurement;
  tokens: number;
  toolCount: number;
}

export interface Report {
  generatedAt: string;
  servers: ServerReport[];
  totalTokens: number;
  totalTools: number;
  contextWindow: number;
  percentOfWindow: number;
  grade: "A" | "B" | "C" | "D" | "F";
  findings: Finding[];
  potentialSavings: number;
  measured: boolean;
  configFiles: string[];
}

const CONTEXT_WINDOW = 200_000;

export function gradeFor(tokens: number): Report["grade"] {
  if (tokens < 3_000) return "A";
  if (tokens < 8_000) return "B";
  if (tokens < 15_000) return "C";
  if (tokens < 30_000) return "D";
  return "F";
}

const INJECTION: [RegExp, string][] = [
  [/<\s*important\s*>/i, "hidden <IMPORTANT> block in a tool description"],
  [/ignore (all |any )?(previous|prior|above) (instructions|rules)/i, "'ignore previous instructions' phrasing"],
  [/do not (tell|mention|inform|reveal)[^.]{0,40}(user|human)/i, "tells the model to hide something from the user"],
  [/(~\/\.ssh|id_rsa|\.aws\/credentials|\.env\b)/i, "tool text references secret files"],
  [/[​-‏‪-‮⁠-⁤﻿]/, "invisible unicode characters in tool text"]
];
const SECRET_ARG = /(sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[abp]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|eyJ[A-Za-z0-9_-]{20,}\.)/;

export interface ScanOptions {
  measure: boolean;
  timeoutMs: number;
  onProgress?: (msg: string) => void;
}

export async function analyze(servers: ServerEntry[], configFiles: string[], opts: ScanOptions): Promise<Report> {
  // Skip ourselves (npx mcpdiet serve) so serve mode can't recurse into itself
  const isSelf = (s: ServerEntry) => [s.command ?? "", ...s.args].some(t => /^mcpdiet(@[\w.-]+)?$/.test(t.split(/[\\/]/).pop() ?? ""));
  const active = servers.filter(s => !s.disabled && !isSelf(s));
  const reports: ServerReport[] = [];

  // Measure in small parallel batches so a big config doesn't take minutes
  const BATCH = 4;
  for (let i = 0; i < active.length; i += BATCH) {
    const batch = active.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(async s => {
        opts.onProgress?.(s.name);
        const m: Measurement = opts.measure
          ? await measureServer(s, opts.timeoutMs)
          : { status: s.url ? "remote" : "skipped", tools: [], error: "config-only scan (--static)" };
        return { s, m };
      })
    );
    for (const { s, m } of results) {
      reports.push({
        name: s.name,
        source: s.source,
        kind: s.url && !s.command ? "remote" : "stdio",
        measurement: m,
        tokens: m.tools.reduce((a, t) => a + t.tokens, 0),
        toolCount: m.tools.length
      });
    }
  }
  reports.sort((a, b) => b.tokens - a.tokens);

  const findings: Finding[] = [];
  const byName = new Map<string, string[]>();

  for (const r of reports) {
    const entry = active.find(s => s.name === r.name && s.source === r.source)!;
    const m = r.measurement;

    if (m.status === "failed") {
      findings.push({ severity: "medium", server: r.name, title: `Won't start: ${m.error}`, fix: `Fix or remove '${r.name}' from ${r.source}. A dead server still slows every launch and clutters your setup.` });
    }
    if (r.tokens > 8_000) {
      findings.push({ severity: "high", server: r.name, title: `${r.tokens.toLocaleString()} tokens across ${r.toolCount} tools`, fix: `Disable '${r.name}' unless you use it daily, or allowlist only the tools you need.`, savesTokens: r.tokens });
    } else if (r.tokens > 3_000) {
      findings.push({ severity: "medium", server: r.name, title: `${r.tokens.toLocaleString()} tokens across ${r.toolCount} tools`, fix: `Toggle '${r.name}' on only for the sessions that need it.`, savesTokens: r.tokens });
    }
    if (r.toolCount > 0) {
      const avg = m.tools.reduce((a, t) => a + t.description.length, 0) / r.toolCount;
      if (avg > 700 && r.tokens <= 8_000) {
        findings.push({ severity: "low", server: r.name, title: `Essay-length tool descriptions (avg ${Math.round(avg)} chars)`, fix: "Ask the maintainer for shorter descriptions or use a tool allowlist." });
      }
    }
    for (const t of m.tools) {
      byName.set(t.name, [...(byName.get(t.name) ?? []), r.name]);
      for (const [re, why] of INJECTION) {
        if (re.test(t.name + " " + t.description)) {
          findings.push({ severity: "high", server: r.name, title: `Possible tool poisoning in '${t.name}': ${why}`, fix: `Review '${r.name}' before trusting it (heuristic match — verify manually).` });
          break;
        }
      }
    }
    const cmdline = [entry.command ?? "", ...entry.args].join(" ");
    if (SECRET_ARG.test(cmdline) || SECRET_ARG.test(entry.url ?? "")) {
      findings.push({ severity: "high", server: r.name, title: "Looks like a secret is hard-coded in the command/URL", fix: "Move it to an env var or your OS keychain so it doesn't leak into logs, process lists and shared configs." });
    }
    if (entry.command && /^(npx|bunx|pnpm dlx|uvx)$/.test(entry.command.split(/[\\/]/).pop() ?? "")) {
      const pkg = entry.args.find(a => !a.startsWith("-"));
      if (pkg && !/@\d/.test(pkg.replace(/^@/, "")) ) {
        findings.push({ severity: "low", server: r.name, title: `Unpinned package '${pkg}' runs the latest version on every launch`, fix: `Pin a version (e.g. ${pkg}@1.2.3) so a compromised release can't silently reach you.` });
      }
    }
    if (entry.url && /^http:\/\//i.test(entry.url) && !/localhost|127\.0\.0\.1/.test(entry.url)) {
      findings.push({ severity: "high", server: r.name, title: "Remote server over plain HTTP", fix: "Use https:// — tool calls and tokens are otherwise readable on the network." });
    }
  }
  for (const [tool, owners] of byName) {
    const uniq = [...new Set(owners)];
    if (uniq.length > 1) {
      findings.push({ severity: "medium", title: `Tool name '${tool}' exists in ${uniq.join(" + ")}`, fix: "Duplicate names confuse tool selection and enable shadowing. Keep one." });
    }
  }

  const order: Record<Severity, number> = { high: 0, medium: 1, low: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity] || (b.savesTokens ?? 0) - (a.savesTokens ?? 0));

  const totalTokens = reports.reduce((a, r) => a + r.tokens, 0);
  return {
    generatedAt: new Date().toISOString(),
    servers: reports,
    totalTokens,
    totalTools: reports.reduce((a, r) => a + r.toolCount, 0),
    contextWindow: CONTEXT_WINDOW,
    percentOfWindow: Math.round((totalTokens / CONTEXT_WINDOW) * 1000) / 10,
    grade: gradeFor(totalTokens),
    findings,
    potentialSavings: findings.reduce((a, f) => a + (f.savesTokens ?? 0), 0),
    measured: opts.measure,
    configFiles
  };
}
