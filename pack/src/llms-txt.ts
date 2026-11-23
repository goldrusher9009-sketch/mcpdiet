#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { main, tool } from "../shared/runner.js";
import { walk, rel } from "../shared/fs.js";

const t = tool({
  name: "llms_txt_gen",
  title: "Generate an llms.txt for a project",
  description: "Build an llms.txt index (the file AI assistants read to understand a site or repo) from a folder's README and markdown or HTML docs.",
  schema: z.object({ path: z.string().default("."), base_url: z.string().default("").describe("Public site URL to prefix links with") }),
  run: ({ path, base_url }) => {
    const files = walk(path).filter((f) => /\.(md|mdx|html?)$/i.test(f)).sort();
    const title = (f: string) => { const s = readFileSync(f, "utf8"); return s.match(/^#\s+(.+)$/m)?.[1] ?? s.match(/<title>([^<]+)/i)?.[1] ?? basename(f); };
    const readme = files.find((f) => /readme\.md$/i.test(f)); const desc = readme ? readFileSync(readme, "utf8").split("\n").find((l) => l.trim() && !l.startsWith("#") && !l.startsWith("[") && !l.startsWith("!")) ?? "" : "";
    const lines = [`# ${basename(path === "." ? process.cwd() : path)}`, "", desc ? `> ${desc.trim()}` : "", "", "## Docs", ...files.slice(0, 60).map((f) => `- [${title(f).trim()}](${base_url.replace(/\/$/, "")}/${rel(path, f)})`)];
    return lines.join("\n");
  },
});
main("llms-txt", "0.1.0", [t]);
