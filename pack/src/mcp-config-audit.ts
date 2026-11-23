#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync } from "node:fs";
import { main, tool } from "../shared/runner.js";

const t = tool({
  name: "mcp_config_audit",
  title: "Audit an MCP config file",
  description: "Read a Claude Desktop, Cursor or .mcp.json file and flag unpinned npx packages, plain-HTTP servers, hard-coded secrets, and shell-wrapped commands.",
  schema: z.object({ path: z.string().describe("Path to the MCP config JSON") }),
  run: ({ path }) => {
    const j = JSON.parse(readFileSync(path, "utf8")); const servers = j.mcpServers ?? j.servers ?? {}; const out: string[] = [];
    for (const [name, s] of Object.entries<any>(servers)) {
      const args: string[] = s.args ?? [], cmd = String(s.command ?? "");
      if (/^(npx|bunx|pnpm|uvx)$/.test(cmd)) { const pkg = args.find((a) => !a.startsWith("-") && a !== "dlx"); if (pkg && !/@\d/.test(pkg.replace(/^@/, ""))) out.push(`${name}: "${pkg}" is not pinned to a version. Each run can pull new code.`); }
      if (/^(sh|bash|zsh|cmd|powershell)$/.test(cmd)) out.push(`${name}: runs through a shell (${cmd}). Prefer calling the program directly.`);
      if (s.url && /^http:\/\//.test(s.url) && !/localhost|127\.0\.0\.1/.test(s.url)) out.push(`${name}: uses plain HTTP to a remote host.`);
      for (const [k, v] of Object.entries<any>(s.env ?? {})) if (/(key|token|secret|pass)/i.test(k) && typeof v === "string" && v.length > 12 && !/^\$|\$\{/.test(v)) out.push(`${name}: secret ${k} is written into the config file. Use an environment variable.`);
      if (args.some((a) => /(--dangerously|--no-sandbox|--allow-all)/.test(a))) out.push(`${name}: uses a risky flag.`);
    }
    return `${Object.keys(servers).length} server(s) checked.\n` + (out.length ? out.map((x) => "  - " + x).join("\n") : "No issues found.");
  },
});
main("mcp-config-audit", "0.1.0", [t]);
