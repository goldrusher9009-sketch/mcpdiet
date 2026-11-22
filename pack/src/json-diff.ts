#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync } from "node:fs";
import { main, tool } from "../shared/runner.js";

function diff(a: any, b: any, p: string, out: string[]) {
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (a && b && typeof a === "object" && typeof b === "object" && Array.isArray(a) === Array.isArray(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(k in a)) out.push(`+ ${p}.${k} = ${JSON.stringify(b[k]).slice(0, 80)}`);
      else if (!(k in b)) out.push(`- ${p}.${k}`);
      else diff(a[k], b[k], `${p}.${k}`, out);
    }
  } else out.push(`~ ${p}: ${JSON.stringify(a).slice(0, 60)} -> ${JSON.stringify(b).slice(0, 60)}`);
}
const t = tool({
  name: "json_diff",
  title: "Diff two JSON files",
  description: "Show added, removed and changed keys between two JSON files.",
  schema: z.object({ a: z.string().describe("First JSON file"), b: z.string().describe("Second JSON file") }),
  run: ({ a, b }) => { const out: string[] = []; diff(JSON.parse(readFileSync(a, "utf8")), JSON.parse(readFileSync(b, "utf8")), "$", out); return out.length ? `${out.length} difference(s):\n${out.slice(0, 200).join("\n")}` : "Files are identical."; },
});
main("json-diff", "0.1.0", [t]);
