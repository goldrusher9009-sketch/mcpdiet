#!/usr/bin/env node
import * as z from "zod/v4";
import { main, tool } from "../shared/runner.js";

function parseField(f: string, min: number, max: number): Set<number> {
  const out = new Set<number>();
  for (const part of f.split(",")) {
    const [r, stepS] = part.split("/"); const step = stepS ? Number(stepS) : 1;
    let lo = min, hi = max;
    if (r !== "*") { const [a, b] = r.split("-"); lo = Number(a); hi = b !== undefined ? Number(b) : stepS ? max : lo; }
    if (![lo, hi, step].every(Number.isFinite) || step < 1 || lo < min || hi > max || lo > hi) throw new Error(`Bad cron field: "${f}"`);
    for (let i = lo; i <= hi; i += step) out.add(i);
  }
  return out;
}
export function nextRuns(expr: string, from: Date, n: number): Date[] {
  const p = expr.trim().split(/\s+/);
  if (p.length !== 5) throw new Error("Expected 5 fields: minute hour day-of-month month day-of-week");
  const [mi, h, dom, mo, dow] = [parseField(p[0], 0, 59), parseField(p[1], 0, 23), parseField(p[2], 1, 31), parseField(p[3], 1, 12), parseField(p[4].replace(/7/g, "0"), 0, 6)];
  const domStar = p[2] === "*", dowStar = p[4] === "*";
  const d = new Date(from); d.setUTCSeconds(0, 0); d.setUTCMinutes(d.getUTCMinutes() + 1);
  const out: Date[] = [];
  for (let i = 0; i < 600000 && out.length < n; i++, d.setUTCMinutes(d.getUTCMinutes() + 1)) {
    if (!mi.has(d.getUTCMinutes()) || !h.has(d.getUTCHours()) || !mo.has(d.getUTCMonth() + 1)) continue;
    const a = dom.has(d.getUTCDate()), b = dow.has(d.getUTCDay());
    if (domStar || dowStar ? a && b : a || b) out.push(new Date(d));
  }
  return out;
}
const t = tool({
  name: "cron_explain",
  title: "Explain a cron expression",
  description: "Validate a 5-field cron expression and list its next run times in UTC.",
  schema: z.object({ expression: z.string().describe('e.g. "*/15 9-17 * * 1-5"'), count: z.number().int().min(1).max(20).default(5) }),
  run: ({ expression, count }) => {
    const runs = nextRuns(expression, new Date(), count);
    return `Valid: ${expression}\nNext ${runs.length} runs (UTC):\n${runs.map((r) => r.toISOString().replace(".000Z", "Z")).join("\n")}`;
  },
});
main("cronwise", "0.1.0", [t]);
