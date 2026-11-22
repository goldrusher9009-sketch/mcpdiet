#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync } from "node:fs";
import { main, tool } from "../shared/runner.js";

const t = tool({
  name: "readme_score",
  title: "Score a README",
  description: "Score a README out of 10 on install steps, usage example, license, badges, description and structure.",
  schema: z.object({ path: z.string().default("README.md") }),
  run: ({ path }) => {
    const s = readFileSync(path, "utf8"); const checks: [string, boolean][] = [
      ["Title heading", /^#\s+\S/m.test(s)], ["One-line description near the top", /^#.*\n+[^#\n`].{20,}/m.test(s)],
      ["Install section or command", /(install|npm i|pip install|npx |brew )/i.test(s)], ["Usage example in a code block", /```[\s\S]*```/.test(s)],
      ["Several sections", (s.match(/^##\s/gm) ?? []).length >= 3], ["License mentioned", /licen[sc]e/i.test(s)],
      ["Links", /\]\(https?:\/\//.test(s)], ["Not too short", s.length > 500], ["Not too long", s.length < 20000], ["Contributing or support info", /(contribut|issues|support)/i.test(s)],
    ];
    const score = checks.filter((c) => c[1]).length;
    return `Score: ${score}/10\n` + checks.map(([n, ok]) => `${ok ? "PASS" : "MISS"}  ${n}`).join("\n");
  },
});
main("readme-score", "0.1.0", [t]);
