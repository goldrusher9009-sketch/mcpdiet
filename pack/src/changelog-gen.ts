#!/usr/bin/env node
import * as z from "zod/v4";
import { execFileSync } from "node:child_process";
import { main, tool } from "../shared/runner.js";

const T: Record<string, string> = { feat: "Features", fix: "Fixes", perf: "Performance", docs: "Docs", refactor: "Refactors", test: "Tests", chore: "Chores", ci: "CI", build: "Build" };
const t = tool({
  name: "changelog_gen",
  title: "Generate a changelog from git commits",
  description: "Group recent commits by conventional-commit type (feat, fix, docs...) into a markdown changelog.",
  schema: z.object({ path: z.string().default("."), since: z.string().default("30 days ago").describe('e.g. "2 weeks ago" or a tag like v1.2.0..HEAD') }),
  run: ({ path, since }) => {
    const range = /\.\./.test(since) ? [since] : [`--since=${since}`];
    const log = execFileSync("git", ["-C", path, "log", ...range, "--pretty=%s"], { encoding: "utf8" }).split("\n").filter(Boolean);
    const g = new Map<string, string[]>();
    for (const s of log) { const m = s.match(/^(\w+)(?:\(([^)]+)\))?!?:\s*(.+)$/); const k = m && T[m[1]] ? T[m[1]] : "Other"; (g.get(k) ?? g.set(k, []).get(k)!).push(m ? `${m[2] ? `**${m[2]}**: ` : ""}${m[3]}` : s); }
    return `## Changes (${log.length} commits)\n\n` + [...g].map(([k, v]) => `### ${k}\n${v.map((x) => "- " + x).join("\n")}`).join("\n\n");
  },
});
main("changelog-gen", "0.1.0", [t]);
