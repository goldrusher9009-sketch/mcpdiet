#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync } from "node:fs";
import { main, tool } from "../shared/runner.js";

const RULES: [string, RegExp][] = [
  ["Tries to override earlier instructions", /\b(ignore|disregard|forget)\b[^.\n]{0,30}\b(previous|prior|above|earlier|all)\b[^.\n]{0,20}\b(instructions?|rules?|prompts?)\b/i],
  ["Hidden instruction to the AI", /<(important|system|instructions?|secret)>|\[(system|hidden)\]/i],
  ["Asks to hide actions from the user", /\b(do not|don't|never)\b[^.\n]{0,30}\b(tell|mention|show|reveal|inform)\b[^.\n]{0,20}\b(the )?user\b/i],
  ["Asks to read secrets or key files", /(~\/\.ssh|id_rsa|\.env\b|\.aws\/credentials|api[_ ]?keys?|private key)/i],
  ["Asks to send data elsewhere", /\b(send|post|upload|forward|exfiltrate)\b[^.\n]{0,40}\b(to|at)\b[^.\n]{0,30}(https?:\/\/|@[\w.-]+\.\w+)/i],
  ["Claims special authority", /\b(you must|you are required to)\b[^.\n]{0,30}\b(always|before|first)\b/i],
  ["Invisible characters (possible hidden text)", /[​-‏⁠‪-‮⁦-⁩﻿]/],
];
const t = tool({
  name: "injection_scan",
  title: "Scan text for prompt-injection patterns",
  description: "Check tool descriptions, web pages, or documents (text or a file path) for hidden instructions aimed at an AI: overrides, secrecy, secret access, data sending, invisible characters.",
  schema: z.object({ input: z.string().describe("Text to scan, or a file path") }),
  run: ({ input }) => {
    let text = input; try { text = readFileSync(input, "utf8"); } catch {}
    const hits = RULES.filter(([, re]) => re.test(text)).map(([n]) => n);
    return hits.length ? `${hits.length} suspicious pattern(s):\n${hits.map((h) => "  - " + h).join("\n")}\n\nHeuristic only. Review the text before trusting it.` : "No known injection patterns found. This does not prove the text is safe.";
  },
});
main("injection-scan", "0.1.0", [t]);
