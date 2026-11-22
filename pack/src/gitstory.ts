#!/usr/bin/env node
import * as z from "zod/v4";
import { execFileSync } from "node:child_process";
import { main, tool } from "../shared/runner.js";

const t = tool({
  name: "git_story",
  title: "Summarize recent git history",
  description: "Summarize a repo's recent commits: authors, most-changed files and commit-type breakdown.",
  schema: z.object({ path: z.string().default("."), days: z.number().int().min(1).max(365).default(30) }),
  run: ({ path, days }) => {
    const out = execFileSync("git", ["-C", path, "log", `--since=${days} days ago`, "--name-only", "--pretty=format:@@%an|%s"], { encoding: "utf8", maxBuffer: 50_000_000 });
    const authors = new Map<string, number>(), files = new Map<string, number>(), types = new Map<string, number>(); let commits = 0;
    for (const line of out.split("\n")) {
      if (line.startsWith("@@")) { commits++; const [a, s] = line.slice(2).split("|"); authors.set(a, (authors.get(a) ?? 0) + 1); const ty = s.match(/^(\w+)(\(.+\))?!?:/)?.[1] ?? "other"; types.set(ty, (types.get(ty) ?? 0) + 1); }
      else if (line.trim()) files.set(line, (files.get(line) ?? 0) + 1);
    }
    const top = (m: Map<string, number>, n: number) => [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `  ${v}  ${k}`).join("\n");
    return `${commits} commits in ${days} days\n\nAuthors:\n${top(authors, 5)}\n\nMost-changed files:\n${top(files, 8)}\n\nCommit types:\n${top(types, 6)}`;
  },
});
main("gitstory", "0.1.0", [t]);
