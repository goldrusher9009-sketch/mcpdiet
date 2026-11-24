import { createServer } from "node:http";
import { McpServer, createMcpHandler } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { t as margin } from "./margin-calc.js";
import { t as meeting } from "./tz-planner.js";
import { t as cron } from "./cronwise.js";
import { t as prompt } from "./prompt-lint.js";
import { checkTarget } from "./mcpseal.js";
import { page as sitePage, robots, sitemap } from "./site.js";

const PKG = /^(@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;
const hits = new Map<string, number[]>();
const limited = (ip: string): boolean => {
  const now = Date.now(), a = (hits.get(ip) ?? []).filter((x) => now - x < 3600_000);
  a.push(now); hits.set(ip, a);
  return a.length > 20;
};

const seal = {
  name: "mcpseal_check",
  title: "Safety-check an MCP server before installing",
  description: "Grade a public npm package A-F for supply-chain risk before you install it: install scripts, credential access, dynamic code, shell use, hidden network calls. Static heuristic; cannot prove a package is safe.",
  schema: z.object({ package: z.string().describe("npm package name, e.g. @scope/server") }),
  run: (a: { package: string }) => {
    if (!PKG.test(a.package) || a.package.length > 100) throw new Error("Give a plain npm package name like @scope/name.");
    const r = checkTarget(a.package);
    const order = { high: 0, medium: 1, low: 2, info: 3 } as const;
    const lines = r.findings.sort((x, y) => order[x.sev] - order[y.sev]).map((x) => `  [${x.sev.toUpperCase()}] ${x.msg}`);
    return `${r.name}@${r.version}\nSeal: ${r.grade}  (${r.score}/100)\n\n${lines.length ? lines.join("\n") : "  No findings."}\n\nStatic check only. It cannot prove a package is safe.`;
  },
};

const tools = [margin, meeting, cron, prompt, seal] as unknown as { name: string; title: string; description: string; schema: z.ZodObject; run: (a: never) => string | Promise<string> }[];
const open = new Set(["margin_calc", "meeting_times", "cron_explain", "prompt_lint"]);

const handler = createMcpHandler(() => {
  const s = new McpServer({ name: "mcp-pack-hosted", version: "0.3.0" });
  for (const t of tools) {
    s.registerTool(t.name, { title: t.title, description: t.description, inputSchema: t.schema, annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: !open.has(t.name) } },
      async (args: unknown) => {
        try { return { content: [{ type: "text" as const, text: await t.run(args as never) }] }; }
        catch (e) { return { isError: true, content: [{ type: "text" as const, text: (e as Error).message }] }; }
      });
  }
  return s;
});


async function contact(req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse) {
  const ip = String(req.headers["x-forwarded-for"] ?? req.socket.remoteAddress).split(",")[0].trim();
  const chunks: Buffer[] = [];
  for await (const c of req) { chunks.push(c as Buffer); if (chunks.reduce((n, b) => n + b.length, 0) > 10_000) { res.writeHead(413).end(); return; } }
  let b: Record<string, string> = {};
  try { b = JSON.parse(Buffer.concat(chunks).toString()); } catch { res.writeHead(400).end(); return; }
  if (b.website) { res.writeHead(200).end("ok"); return; }
  const name = String(b.name ?? "").slice(0, 100), email = String(b.email ?? "").slice(0, 150), message = String(b.message ?? "").slice(0, 3000);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !message) { res.writeHead(400).end(); return; }
  if (limited("c" + ip)) { res.writeHead(429).end(); return; }
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    const to = process.env.MAIL_TO ?? "husham@allamericancg.com";
    const fr = await fetch(`https://formsubmit.co/ajax/${to}`, { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify({ name, email, message, _subject: `MCP SEAL contact: ${name.replace(/[\r\n]/g, " ")}`, _replyto: email, _captcha: "false" }) });
    res.writeHead(fr.ok ? 200 : 502).end(fr.ok ? "ok" : "failed"); return;
  }
  const esc = (x: string) => x.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from: process.env.MAIL_FROM ?? "MCP SEAL <contact@mcpseal.dev>", to: [process.env.MAIL_TO ?? "husham@allamericancg.com"], reply_to: email, subject: `MCP SEAL contact: ${name.replace(/[\r\n]/g, " ")}`, html: `<p><b>${esc(name)}</b> (${esc(email)})</p><p>${esc(message).replace(/\n/g, "<br>")}</p>` }),
  });
  res.writeHead(r.ok ? 200 : 502).end(r.ok ? "ok" : "failed");
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://x");
    if (url.pathname === "/health") { res.writeHead(200).end("ok"); return; }
    if (url.pathname === "/") { res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(sitePage); return; }
    if (url.pathname === "/robots.txt") { res.writeHead(200, { "content-type": "text/plain" }).end(robots); return; }
    if (url.pathname === "/sitemap.xml") { res.writeHead(200, { "content-type": "application/xml" }).end(sitemap); return; }
    if (url.pathname === "/contact" && req.method === "POST") { await contact(req, res); return; }
    if (url.pathname !== "/mcp") { res.writeHead(404).end("not found"); return; }
    const ip = String(req.headers["x-forwarded-for"] ?? req.socket.remoteAddress).split(",")[0].trim();
    const chunks: Buffer[] = [];
    for await (const c of req) { chunks.push(c as Buffer); if (chunks.reduce((n, b) => n + b.length, 0) > 100_000) { res.writeHead(413).end(); return; } }
    const body = Buffer.concat(chunks);
    if (body.includes("mcpseal_check") && limited(ip)) { res.writeHead(429).end("rate limited"); return; }
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) if (v) headers.set(k, Array.isArray(v) ? v.join(",") : v);
    const r = await handler.fetch(new Request(`https://${req.headers.host}${req.url}`, { method: req.method, headers, body: ["GET", "HEAD"].includes(req.method ?? "") ? undefined : body }));
    res.writeHead(r.status, Object.fromEntries(r.headers));
    res.end(Buffer.from(await r.arrayBuffer()));
  } catch (e) { res.writeHead(500).end(String((e as Error).message)); }
}).listen(Number(process.env.PORT ?? 8080), () => console.log("mcp-pack hosted on", process.env.PORT ?? 8080));
