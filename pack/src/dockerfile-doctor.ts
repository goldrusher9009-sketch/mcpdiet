#!/usr/bin/env node
import * as z from "zod/v4";
import { readFileSync } from "node:fs";
import { main, tool } from "../shared/runner.js";

const t = tool({
  name: "dockerfile_doctor",
  title: "Lint a Dockerfile",
  description: "Find common Dockerfile problems: unpinned base images, running as root, cache-busting layers, ADD misuse, apt without cleanup.",
  schema: z.object({ path: z.string().default("Dockerfile").describe("Path to Dockerfile") }),
  run: ({ path }) => {
    const lines = readFileSync(path, "utf8").split("\n");
    const f: string[] = []; let user = false, from = 0;
    lines.forEach((raw, i) => {
      const l = raw.trim(), n = i + 1;
      if (/^FROM\s/i.test(l)) { from++; const img = l.split(/\s+/)[1]; if (!img.includes("@sha256") && (!img.includes(":") || img.endsWith(":latest")) && img !== "scratch") f.push(`L${n}  Base image "${img}" is unpinned. Pin a version tag or digest.`); }
      if (/^USER\s/i.test(l)) user = !/^USER\s+root\s*$/i.test(l);
      if (/^ADD\s/i.test(l) && !/https?:\/\/|\.tar/.test(l)) f.push(`L${n}  Use COPY instead of ADD for local files.`);
      if (/apt-get install/.test(l) && !/--no-install-recommends/.test(l)) f.push(`L${n}  apt-get install without --no-install-recommends.`);
      if (/apt-get install/.test(l) && !/rm -rf \/var\/lib\/apt\/lists/.test(l)) f.push(`L${n}  apt lists not cleaned in the same layer.`);
      if (/apt-get update\s*$/.test(l)) f.push(`L${n}  apt-get update alone in a layer goes stale. Chain it with install.`);
      if (/npm install(?!.*--omit=dev)/.test(l) && /^RUN/i.test(l)) f.push(`L${n}  Prefer "npm ci" for reproducible builds.`);
      if (/curl .*\|\s*(sh|bash)/.test(l)) f.push(`L${n}  Piping curl to a shell is unsafe. Verify a checksum.`);
    });
    if (!user) f.push("No non-root USER set. Container runs as root.");
    if (from === 1 && lines.length > 25) f.push("Consider a multi-stage build to shrink the final image.");
    return f.length ? `${f.length} issue(s):\n${f.join("\n")}` : "No issues found.";
  },
});
main("dockerfile-doctor", "0.1.0", [t]);
