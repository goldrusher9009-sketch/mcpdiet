#!/usr/bin/env node
import * as z from "zod/v4";
import { main, tool, tokens } from "../shared/runner.js";
import { walk, rel, readText } from "../shared/fs.js";

const t = tool({
  name: "repo_weigh",
  title: "Weigh a codebase in LLM tokens",
  description: "Estimate how many LLM tokens a folder costs to read. Lists the heaviest files and what share of a 200K context window the repo uses.",
  schema: z.object({ path: z.string().default(".").describe("Folder to scan"), top: z.number().int().min(1).max(50).default(10).describe("Heaviest files to list") }),
  run: ({ path, top }) => {
    const rows: { f: string; t: number }[] = [];
    for (const f of walk(path)) { const s = readText(f); if (s) rows.push({ f: rel(path, f), t: tokens(s) }); }
    const total = rows.reduce((a, r) => a + r.t, 0);
    rows.sort((a, b) => b.t - a.t);
    const lines = rows.slice(0, top).map((r) => `${String(r.t).padStart(8)}  ${r.f}`);
    return `Files: ${rows.length}\nEstimated tokens: ${total.toLocaleString()}\nShare of a 200K window: ${((total / 200000) * 100).toFixed(1)}%\n\nHeaviest files:\n${lines.join("\n")}`;
  },
});
main("repo-weigh", "0.1.0", [t]);
