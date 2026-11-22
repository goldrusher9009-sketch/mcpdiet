#!/usr/bin/env node
import * as z from "zod/v4";
import { main, tool, tokens } from "../shared/runner.js";

const t = tool({
  name: "prompt_lint",
  title: "Lint an LLM prompt",
  description: "Check a prompt for vague wording, missing output format, missing role or context, contradictions and bloat. Returns fixes.",
  schema: z.object({ prompt: z.string().min(1) }),
  run: ({ prompt }) => {
    const f: string[] = []; const p = prompt.toLowerCase();
    if (!/(format|json|bullet|table|markdown|words|sentences|steps|list)/.test(p)) f.push("No output format stated. Say what shape the answer should take.");
    if (!/(you are|act as|role|audience|for a|for an)/.test(p)) f.push("No role or audience. Say who the answer is for.");
    for (const w of ["good", "nice", "better", "some", "stuff", "things", "etc", "as needed", "appropriate"]) if (new RegExp(`\\b${w}\\b`).test(p)) f.push(`Vague word "${w}". Replace it with a concrete criterion.`);
    if (/\bdon't\b|\bdo not\b|\bnever\b/.test(p) && !/\binstead\b/.test(p)) f.push("Negative instructions without an alternative. Say what to do instead.");
    if (/\balways\b/.test(p) && /\bnever\b/.test(p)) f.push("Both 'always' and 'never' appear. Check for contradictions.");
    if (!/(example|e\.g\.|for instance)/.test(p) && prompt.length > 400) f.push("Long prompt with no example. One example often beats a paragraph of rules.");
    if (/(!!|\bIMPORTANT\b.*\bIMPORTANT\b|\bCRITICAL\b.*\bCRITICAL\b)/.test(prompt)) f.push("Repeated emphasis. Shouting lowers signal. Explain why instead.");
    const n = tokens(prompt);
    return `~${n} tokens\n` + (f.length ? f.map((x, i) => `${i + 1}. ${x}`).join("\n") : "No issues found.");
  },
});
main("prompt-lint", "0.1.0", [t]);
