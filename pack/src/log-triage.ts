#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync } from "node:fs";
import { main, tool } from "../shared/runner.js";

const t = tool({
  name: "log_triage",
  title: "Triage a log file",
  description: "Group a log file's errors and warnings by normalized message so repeated failures surface first.",
  schema: z.object({ path: z.string().describe("Log file path"), top: z.number().int().min(1).max(30).default(10) }),
  run: ({ path, top }) => {
    const lines = readFileSync(path, "utf8").split("\n");
    const groups = new Map<string, { n: number; level: string; first: number; sample: string }>();
    lines.forEach((l, i) => {
      const m = l.match(/\b(ERROR|FATAL|CRITICAL|WARN(?:ING)?|Exception|Traceback)\b/i);
      if (!m) return;
      const key = l.replace(/\d{4}-\d\d-\d\d[T ][\d:.,]+Z?/g, "").replace(/\b[0-9a-f]{8,}\b/gi, "<id>").replace(/\d+/g, "<n>").replace(/\s+/g, " ").trim().slice(0, 160);
      const g = groups.get(key) ?? { n: 0, level: m[1].toUpperCase(), first: i + 1, sample: l.trim().slice(0, 200) };
      g.n++; groups.set(key, g);
    });
    const rows = [...groups.values()].sort((a, b) => b.n - a.n).slice(0, top);
    if (!rows.length) return `Scanned ${lines.length} lines. No errors or warnings found.`;
    return `Scanned ${lines.length} lines, ${groups.size} distinct problem(s):\n` + rows.map((g) => `${String(g.n).padStart(6)}x ${g.level} (first at line ${g.first})  ${g.sample}`).join("\n");
  },
});
main("log-triage", "0.1.0", [t]);
