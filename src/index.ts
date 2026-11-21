#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { analyze, type Report } from "./analyze.js";
import { discoverServers } from "./configs.js";
import { renderMarkdown, renderTerminal } from "./report.js";

const VERSION = "0.1.0";
const argv = process.argv.slice(2);
const flag = (f: string) => argv.includes(f);
const opt = (f: string) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};
const configs = () => argv.flatMap((a, i) => (a === "--config" && argv[i + 1] ? [argv[i + 1]] : []));

const HELP = `mcpdiet ${VERSION} — weigh your MCP servers

Usage:
  npx mcpdiet [options]       scan every MCP config on this machine
  npx mcpdiet serve           run as an MCP server (2 tiny tools) so your agent can audit itself

Options:
  --config <file>   scan this config instead of auto-discovery (repeatable)
  --static          don't start servers; config-only checks (no token counts)
  --timeout <sec>   per-server startup limit (default 20)
  --json | --md     machine / markdown output
  --no-color        plain output

Scanning starts the stdio servers in your config exactly as your client would, lists their tools, then stops them.
Nothing leaves your machine. Env values are never printed.`;

async function scan(measure: boolean, timeoutSec: number, files: string[], onProgress?: (m: string) => void): Promise<Report> {
  const { servers, files: found } = discoverServers(files);
  return analyze(servers, found, { measure, timeoutMs: timeoutSec * 1000, onProgress });
}

let lastReport: Report | undefined;

function createServer(): McpServer {
  const server = new McpServer({ name: "mcpdiet", version: VERSION });
  server.registerTool(
    "mcpdiet_scan",
    {
      title: "Weigh MCP servers",
      description: "Measure token cost, dead servers and risky settings across all MCP servers configured on this machine. Returns a graded report with a fix list. Slow (starts each server).",
      inputSchema: z.strictObject({ measure: z.boolean().default(true).describe("false = config-only checks, fast") }),
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false }
    },
    async ({ measure }) => {
      lastReport = await scan(measure, 20, []);
      return { content: [{ type: "text", text: renderMarkdown(lastReport) }] };
    }
  );
  server.registerTool(
    "mcpdiet_server_detail",
    {
      title: "Tool-by-tool cost for one server",
      description: "After mcpdiet_scan: list one server's tools ranked by token cost, to pick what to allowlist or drop.",
      inputSchema: z.strictObject({ server: z.string().min(1).describe("Server name from the scan") }),
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false }
    },
    async ({ server: name }) => {
      const s = lastReport?.servers.find(x => x.name === name);
      if (!lastReport) return { isError: true, content: [{ type: "text", text: "Run mcpdiet_scan first." }] };
      if (!s) return { isError: true, content: [{ type: "text", text: `No server '${name}'. Known: ${lastReport.servers.map(x => x.name).join(", ")}` }] };
      const rows = [...s.measurement.tools].sort((a, b) => b.tokens - a.tokens).slice(0, 40).map(t => `- ${t.name}: ≈${t.tokens} tokens`);
      return { content: [{ type: "text", text: `# ${s.name} — ≈${s.tokens} tokens, ${s.toolCount} tools\n${rows.join("\n")}` }] };
    }
  );
  return server;
}

async function main() {
  if (flag("--help") || flag("-h")) return void console.log(HELP);
  if (flag("--version") || flag("-v")) return void console.log(VERSION);
  if (argv[0] === "serve") {
    serveStdio(createServer);
    console.error("mcpdiet running on stdio");
    return;
  }
  const timeout = Number(opt("--timeout") ?? 20);
  const quiet = flag("--json") || flag("--md");
  const report = await scan(!flag("--static"), timeout, configs(), quiet ? undefined : m => process.stderr.write(`\r\x1b[2Kweighing ${m}…`));
  if (!quiet) process.stderr.write("\r\x1b[2K");
  if (flag("--json")) console.log(JSON.stringify(report, null, 2));
  else if (flag("--md")) console.log(renderMarkdown(report));
  else console.log(renderTerminal(report));
  process.exit(report.grade === "F" || report.findings.some(f => f.severity === "high") ? 1 : 0);
}

main().catch(e => {
  console.error(e);
  process.exit(2);
});
