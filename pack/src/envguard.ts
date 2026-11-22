#!/usr/bin/env node
import * as z from "zod/v4";
import { main, tool } from "../shared/runner.js";
import { walk, rel, readText } from "../shared/fs.js";

const RULES: [string, RegExp][] = [
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
  ["npm token", /\bnpm_[A-Za-z0-9]{30,}\b/],
  ["Slack token", /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ["Stripe live key", /\b[sr]k_live_[A-Za-z0-9]{16,}\b/],
  ["Private key block", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["Generic secret assignment", /\b(?:api[_-]?key|secret|passwd|password|token)\b\s*[:=]\s*["'][A-Za-z0-9_\-\/+=]{16,}["']/i],
];
const mask = (s: string) => (s.length <= 8 ? "****" : s.slice(0, 4) + "…" + s.slice(-2));

const t = tool({
  name: "envguard_scan",
  title: "Scan a folder for leaked secrets",
  description: "Find API keys, tokens and private keys committed in a folder. Values are masked in the output.",
  schema: z.object({ path: z.string().default(".").describe("Folder to scan") }),
  run: ({ path }) => {
    const hits: string[] = [];
    for (const f of walk(path)) {
      const s = readText(f); if (!s) continue;
      s.split("\n").forEach((line, i) => {
        for (const [name, re] of RULES) { const m = line.match(re); if (m) { hits.push(`${rel(path, f)}:${i + 1}  ${name}  ${mask(m[0])}`); break; } }
      });
    }
    return hits.length ? `${hits.length} possible secret(s):\n${hits.slice(0, 100).join("\n")}\n\nRotate anything real, then remove it from git history.` : "No secrets found.";
  },
});
main("envguard", "0.1.0", [t]);
