#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync } from "node:fs";
import { main, tool, tokens } from "../shared/runner.js";

const t = tool({
  name: "openapi_slim",
  title: "Slim an OpenAPI spec for LLMs",
  description: "Read an OpenAPI JSON file and print a compact endpoint list, plus how many tokens it saves versus the raw spec.",
  schema: z.object({ path: z.string().describe("OpenAPI .json file") }),
  run: ({ path }) => {
    const raw = readFileSync(path, "utf8"); const spec = JSON.parse(raw);
    if (!spec.paths) throw new Error("No 'paths' found. Is this an OpenAPI JSON file?");
    const out: string[] = [];
    for (const [p, ops] of Object.entries<any>(spec.paths))
      for (const [m, op] of Object.entries<any>(ops)) {
        if (!["get", "post", "put", "patch", "delete"].includes(m)) continue;
        const params = (op.parameters ?? []).map((x: any) => `${x.name}${x.required ? "*" : ""}`).join(",");
        out.push(`${m.toUpperCase()} ${p}${params ? ` (${params})` : ""} - ${(op.summary ?? op.operationId ?? "").slice(0, 80)}`);
      }
    const slim = out.join("\n"); const a = tokens(raw), b = tokens(slim);
    return `${out.length} endpoints. Raw ~${a.toLocaleString()} tokens, slim ~${b.toLocaleString()} (${(100 - (b / a) * 100).toFixed(0)}% smaller)\n\n${slim}`;
  },
});
main("openapi-slim", "0.1.0", [t]);
