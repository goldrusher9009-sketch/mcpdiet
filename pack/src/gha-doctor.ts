#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { main, tool } from "../shared/runner.js";
import { walk, rel } from "../shared/fs.js";

const t = tool({
  name: "gha_doctor",
  title: "Audit GitHub Actions workflows",
  description: "Find security and reliability problems in .github/workflows: unpinned actions, broad permissions, pull_request_target risks, script injection, missing timeouts.",
  schema: z.object({ path: z.string().default(".").describe("Repo root") }),
  run: ({ path }) => {
    const dir = join(path, ".github", "workflows");
    if (!existsSync(dir)) throw new Error("No .github/workflows folder found.");
    const out: string[] = [];
    for (const f of walk(dir).filter((x) => /\.ya?ml$/.test(x))) {
      const lines = readFileSync(f, "utf8").split("\n"); const name = rel(path, f);
      const text = lines.join("\n");
      if (!/^permissions:/m.test(text)) out.push(`${name}  No top-level "permissions:". Default token may be write-all.`);
      if (!/timeout-minutes:/.test(text)) out.push(`${name}  No timeout-minutes on jobs.`);
      if (/pull_request_target/.test(text) && /actions\/checkout/.test(text) && /head\.(sha|ref)/.test(text)) out.push(`${name}  pull_request_target checks out PR head code. Dangerous.`);
      lines.forEach((l, i) => {
        const u = l.match(/uses:\s*([^\s#]+)/);
        if (u && !u[1].startsWith("./") && !u[1].startsWith("docker://") && !/@[0-9a-f]{40}$/.test(u[1])) out.push(`${name}:${i + 1}  ${u[1]} is not pinned to a commit SHA.`);
        if (/\$\{\{\s*github\.(event\.(issue|pull_request|comment|head_commit)\.[a-z_.]*(title|body|message|ref|name)|head_ref)/.test(l) && /run:|\|/.test(lines.slice(Math.max(0, i - 6), i + 1).join("\n"))) out.push(`${name}:${i + 1}  Untrusted input in a shell step (script injection risk).`);
      });
    }
    return out.length ? `${out.length} finding(s):\n${out.join("\n")}` : "No findings.";
  },
});
main("gha-doctor", "0.1.0", [t]);
