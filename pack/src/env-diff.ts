#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync } from "node:fs";
import { main, tool } from "../shared/runner.js";

const keys = (p: string) => new Set(readFileSync(p, "utf8").split("\n").map((l) => l.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/)?.[1]).filter(Boolean) as string[]);
const t = tool({
  name: "env_diff",
  title: "Compare .env files",
  description: "Compare variable names (never values) between a .env and .env.example to find missing or undocumented variables.",
  schema: z.object({ env: z.string().default(".env"), example: z.string().default(".env.example") }),
  run: ({ env, example }) => {
    const a = keys(env), b = keys(example);
    const missing = [...b].filter((k) => !a.has(k)), extra = [...a].filter((k) => !b.has(k));
    return `Missing from ${env}: ${missing.join(", ") || "none"}\nNot in ${example}: ${extra.join(", ") || "none"}`;
  },
});
main("env-diff", "0.1.0", [t]);
