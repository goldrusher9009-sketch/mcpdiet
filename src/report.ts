import type { Report } from "./analyze.js";

const useColor = process.stdout.isTTY && !process.env.NO_COLOR && !process.argv.includes("--no-color");
const c = (code: number) => (s: string) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);
const bold = c(1), dim = c(2), red = c(31), green = c(32), yellow = c(33), cyan = c(36);
const gradeColor = (g: string) => (g === "A" || g === "B" ? green : g === "C" ? yellow : red);
const n = (x: number) => x.toLocaleString("en-US");

export function shareLine(r: Report): string {
  return `My MCP setup burns ${n(r.totalTokens)} tokens (${r.percentOfWindow}% of the context window) across ${r.totalTools} tools before I type a word — grade ${r.grade}. Weigh yours: npx mcpdiet`;
}

export function renderTerminal(r: Report): string {
  const L: string[] = [];
  const g = gradeColor(r.grade);
  L.push("");
  L.push(`${bold("MCPDIET")}  ${dim("· what your MCP servers cost before you say a word")}`);
  L.push("");
  if (r.servers.length === 0) {
    L.push("No MCP servers found. Pass a config with --config <file>.");
    return L.join("\n");
  }
  if (r.measured) L.push(`  ${bold(n(r.totalTokens))} tokens  ${dim(`(${r.percentOfWindow}% of a ${n(r.contextWindow / 1000)}K window)`)}   ${r.totalTools} tools   Grade ${g(bold(r.grade))}`);
  else L.push(dim("  config-only scan: token counts unavailable (run without --static to measure)"));
  L.push("");
  const max = Math.max(1, ...r.servers.map(s => s.tokens));
  const w = Math.max(6, ...r.servers.map(s => s.name.length));
  L.push(dim(`  ${"server".padEnd(w)}  ${"tools".padStart(5)}  ${"tokens".padStart(7)}`));
  for (const s of r.servers) {
    const bar = "█".repeat(Math.round((s.tokens / max) * 18));
    const status = s.measurement.status === "failed" ? red(" ✗ failed") : s.measurement.status === "remote" ? dim(" remote") : "";
    const col = s.tokens > 8000 ? red : s.tokens > 3000 ? yellow : green;
    L.push(`  ${s.name.padEnd(w)}  ${String(s.toolCount).padStart(5)}  ${n(s.tokens).padStart(7)}  ${col(bar)}${status}`);
  }
  if (r.findings.length) {
    L.push("");
    L.push(bold("Fix list"));
    const icon = { high: red("●"), medium: yellow("●"), low: dim("●") };
    for (const f of r.findings.slice(0, 12)) {
      L.push(`  ${icon[f.severity]} ${f.server ? cyan(f.server) + ": " : ""}${f.title}`);
      L.push(`    ${dim("→ " + f.fix)}`);
    }
    if (r.findings.length > 12) L.push(dim(`  …and ${r.findings.length - 12} more (use --json)`));
  }
  if (r.potentialSavings > 0) {
    L.push("");
    L.push(`${green(bold("Cut up to " + n(r.potentialSavings) + " tokens"))} per session by trimming the servers above.`);
  }
  L.push("");
  if (r.measured) L.push(dim("Share: ") + shareLine(r));
  L.push(dim("Token counts ≈ chars÷4 of each tool's name, description and schema. Security checks are heuristics, not a guarantee."));
  L.push("");
  return L.join("\n");
}

export function renderMarkdown(r: Report): string {
  const rows = r.servers.map(s => `| ${s.name} | ${s.toolCount} | ${n(s.tokens)} |`).join("\n");
  const fixes = r.findings.slice(0, 10).map(f => `- **${f.severity.toUpperCase()}** ${f.server ? `\`${f.server}\`: ` : ""}${f.title} — ${f.fix}`).join("\n");
  return [
    `# MCP diet report — Grade ${r.grade}`,
    `**${n(r.totalTokens)} tokens** (${r.percentOfWindow}% of a ${n(r.contextWindow / 1000)}K window) across ${r.totalTools} tools.`,
    "",
    "| Server | Tools | ≈Tokens |",
    "|---|---:|---:|",
    rows,
    "",
    fixes ? "## Fix list\n" + fixes : "Nothing to fix. 🎉",
    r.potentialSavings ? `\n**Potential savings: ${n(r.potentialSavings)} tokens/session.**` : "",
    "",
    `_${shareLine(r)}_`,
    "_Token counts are estimates (chars÷4). Security checks are heuristics._"
  ].join("\n");
}
