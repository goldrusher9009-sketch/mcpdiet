import { existsSync, readFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join, resolve } from "node:path";

export interface ServerEntry {
  name: string;
  source: string; // which client/config file it came from
  command?: string;
  args: string[];
  env: Record<string, string>;
  url?: string;
  disabled?: boolean;
}

function readJson(path: string): any | undefined {
  try {
    if (!existsSync(path)) return undefined;
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return undefined;
  }
}

function normalize(map: any, source: string): ServerEntry[] {
  if (!map || typeof map !== "object") return [];
  const out: ServerEntry[] = [];
  for (const [name, raw] of Object.entries<any>(map)) {
    if (!raw || typeof raw !== "object") continue;
    out.push({
      name,
      source,
      command: typeof raw.command === "string" ? raw.command : undefined,
      args: Array.isArray(raw.args) ? raw.args.map(String) : [],
      env: raw.env && typeof raw.env === "object" ? Object.fromEntries(Object.entries(raw.env).map(([k, v]) => [k, String(v)])) : {},
      url: typeof raw.url === "string" ? raw.url : typeof raw.serverUrl === "string" ? raw.serverUrl : undefined,
      disabled: raw.disabled === true
    });
  }
  return out;
}

function candidatePaths(): { path: string; label: string }[] {
  const home = homedir();
  const cwd = process.cwd();
  const os = platform();
  const desktop =
    os === "darwin"
      ? join(home, "Library/Application Support/Claude/claude_desktop_config.json")
      : os === "win32"
        ? join(process.env.APPDATA ?? join(home, "AppData/Roaming"), "Claude/claude_desktop_config.json")
        : join(home, ".config/Claude/claude_desktop_config.json");
  return [
    { path: desktop, label: "Claude Desktop" },
    { path: join(home, ".claude.json"), label: "Claude Code" },
    { path: join(cwd, ".mcp.json"), label: "Claude Code (project)" },
    { path: join(home, ".cursor/mcp.json"), label: "Cursor" },
    { path: join(cwd, ".cursor/mcp.json"), label: "Cursor (project)" },
    { path: join(cwd, ".vscode/mcp.json"), label: "VS Code (project)" },
    { path: join(home, ".codeium/windsurf/mcp_config.json"), label: "Windsurf" }
  ];
}

/** Find every MCP server configured on this machine (or in the given config files). */
export function discoverServers(extraPaths: string[] = []): { servers: ServerEntry[]; files: string[] } {
  const targets = extraPaths.length
    ? extraPaths.map(p => ({ path: resolve(p), label: resolve(p) }))
    : candidatePaths();
  const servers: ServerEntry[] = [];
  const files: string[] = [];
  const seen = new Set<string>();
  for (const { path, label } of targets) {
    const json = readJson(path);
    if (!json) continue;
    files.push(label);
    const found: ServerEntry[] = [
      ...normalize(json.mcpServers, label),
      ...normalize(json.servers, label), // VS Code
      ...normalize(json.mcp?.servers, label)
    ];
    // Claude Code keeps per-project servers inside ~/.claude.json
    if (json.projects && typeof json.projects === "object") {
      for (const [proj, v] of Object.entries<any>(json.projects)) {
        if (proj === process.cwd()) found.push(...normalize(v?.mcpServers, `${label} (${proj})`));
      }
    }
    for (const s of found) {
      const key = `${s.name}|${s.command}|${s.args.join(" ")}|${s.url}`;
      if (seen.has(key)) continue;
      seen.add(key);
      servers.push(s);
    }
  }
  return { servers, files };
}
