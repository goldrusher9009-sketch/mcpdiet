#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync } from "node:fs";
import { main, tool } from "../shared/runner.js";

function parseCsv(s: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], cur = "", q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"') { if (s[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n") { row.push(cur.replace(/\r$/, "")); rows.push(row); row = []; cur = ""; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
const t = tool({
  name: "csv_profile",
  title: "Profile a CSV file",
  description: "Column-by-column profile of a CSV: inferred type, missing values, unique count, min/max/mean for numbers, and duplicate rows.",
  schema: z.object({ path: z.string().describe("CSV file path") }),
  run: ({ path }) => {
    const rows = parseCsv(readFileSync(path, "utf8")).filter((r) => r.some((c) => c !== ""));
    if (rows.length < 2) throw new Error("CSV needs a header and at least one row.");
    const [head, ...data] = rows; const out: string[] = [`Rows: ${data.length}  Columns: ${head.length}`];
    const seen = new Set<string>(); let dup = 0;
    for (const r of data) { const k = r.join("\u0001"); if (seen.has(k)) dup++; else seen.add(k); }
    out.push(`Duplicate rows: ${dup}`, "");
    head.forEach((h, i) => {
      const vals = data.map((r) => r[i] ?? ""); const filled = vals.filter((v) => v.trim() !== "");
      const nums = filled.map(Number).filter((n) => Number.isFinite(n));
      const isNum = filled.length > 0 && nums.length === filled.length;
      let line = `${h}: ${isNum ? "number" : "text"}, missing ${vals.length - filled.length}, unique ${new Set(filled).size}`;
      if (isNum) line += `, min ${Math.min(...nums)}, max ${Math.max(...nums)}, mean ${(nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)}`;
      out.push(line);
    });
    return out.join("\n");
  },
});
main("csv-profile", "0.1.0", [t]);
