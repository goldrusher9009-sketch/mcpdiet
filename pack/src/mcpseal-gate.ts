#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync } from "node:fs";
import { main, tool } from "../shared/runner.js";
import { checkLicense } from "../shared/license.js";
import { checkTarget } from "./mcpseal.js";

const ORDER = "ABCDF";
const t = tool({
  name: "mcpseal_gate",
  title: "CI gate: fail if any MCP server is below a grade (Pro)",
  description: "Pro. Check a list of npm packages (comma-separated or a file with one per line) and fail if any grade is below the minimum. Needs MCPSEAL_KEY.",
  schema: z.object({ packages: z.string().describe("Comma-separated names, or a file path with one name per line"), min_grade: z.enum(["A", "B", "C", "D"]).default("B") }),
  run: ({ packages, min_grade }) => {
    const lic = checkLicense(process.env.MCPSEAL_KEY);
    let list: string[];
    try { list = readFileSync(packages, "utf8").split("\n").map((x) => x.trim()).filter((x) => x && !x.startsWith("#")); } catch { list = packages.split(",").map((x) => x.trim()).filter(Boolean); }
    const rows = list.map((p) => { try { const r = checkTarget(p); return { p, g: r.grade, s: r.score, err: "" }; } catch (e) { return { p, g: "?", s: 0, err: (e as Error).message }; } });
    const bad = rows.filter((r) => r.g === "?" || ORDER.indexOf(r.g) > ORDER.indexOf(min_grade));
    const out = rows.map((r) => `${r.g === "?" ? "ERR" : r.g}  ${String(r.s).padStart(3)}  ${r.p}${r.err ? "  " + r.err : ""}`).join("\n");
    if (bad.length) throw new Error(`${out}\n\nFAILED: ${bad.length} of ${rows.length} below ${min_grade} (licensed to ${lic.email}).`);
    return `${out}\n\nPASSED: all ${rows.length} at ${min_grade} or better (licensed to ${lic.email}).`;
  },
});
main("mcpseal-gate", "0.1.0", [t]);
