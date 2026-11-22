#!/usr/bin/env node
import * as z from "zod/v4";
import { main, tool } from "../shared/runner.js";

const t = tool({
  name: "regex_lab",
  title: "Test a regex",
  description: "Run a JavaScript regex against text and list every match with its index and capture groups. Warns about catastrophic backtracking patterns.",
  schema: z.object({ pattern: z.string(), text: z.string(), flags: z.string().default("g") }),
  run: ({ pattern, text, flags }) => {
    const warn = /\((?:[^()]*[+*])\)[+*]|\(\.\*\)[+*]/.test(pattern) ? "Warning: nested quantifiers can backtrack catastrophically.\n" : "";
    const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    const out: string[] = []; let m: RegExpExecArray | null;
    while ((m = re.exec(text)) && out.length < 50) { out.push(`@${m.index}  "${m[0]}"${m.length > 1 ? `  groups: ${JSON.stringify(m.slice(1))}` : ""}`); if (m[0] === "") re.lastIndex++; }
    return `${warn}${out.length} match(es)\n${out.join("\n")}`;
  },
});
main("regex-lab", "0.1.0", [t]);
