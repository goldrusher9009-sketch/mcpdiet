import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
const cases = [
  ["repo-weigh", { path: "src", top: 3 }, /Estimated tokens/],
  ["envguard", { path: "t" }, /AWS access key/],
  ["cronwise", { expression: "*/15 9-17 * * 1-5", count: 3 }, /Valid/],
  ["license-check", { path: "." }, /Licenses/],
  ["dockerfile-doctor", { path: "t/Dockerfile" }, /unpinned/],
  ["gha-doctor", { path: "t" }, /permissions/],
  ["csv-profile", { path: "t/a.csv" }, /Duplicate rows: 1/],
  ["takeoff", { kind: "drywall", length_ft: 40, width_ft: 9 }, /sheets/],
  ["log-triage", { path: "t/app.log" }, /2x ERROR/],
  ["openapi-slim", { path: "t/api.json" }, /GET \/pets/],
  ["regex-lab", { pattern: "(\\d+)-(\\d+)", text: "10-20 x 3-4" }, /2 match/],
  ["prompt-lint", { prompt: "Write some good stuff" }, /Vague word/],
  ["tz-planner", { zones: ["America/New_York","Europe/London"], date: "2026-11-23" }, /UTC/],
  ["bid-total", { direct_costs: [41233.17, 18877.42] }, /786\.00/],
  ["gitstory", { path: "..", days: 365 }, /commits in/],
  ["readme-score", { path: "README.md" }, /Score: \d+\/10/],
  ["json-diff", { a: "t/api.json", b: "t/api.json" }, /identical/],
  ["margin-calc", { cost: 100, margin_pct: 20 }, /Price: \$125\.00/],
  ["env-diff", { env: "t/.env", example: "t/.env.example" }, /Missing from/],
  ["framing", { length_ft: 20, openings: 1 }, /Studs/],
  ["mcpseal", { target: "t/evil" }, /Seal: F/],
]; = 0;
for (const [n, args, re] of cases) {
  const c = new Client({ name: "t", version: "1" });
  await c.connect(new StdioClientTransport({ command: "node", args: [`dist/src/${n}.js`, "serve"] }));
  const tools = await c.listTools();
  const r = await c.callTool({ name: tools.tools[0].name, arguments: args });
  const text = r.content[0].text; const ok = !r.isError && re.test(text);
  const tk = Math.ceil(JSON.stringify(tools.tools).length / 4);
  console.log(`${ok ? "PASS" : "FAIL"} ${n} (${tools.tools[0].name}, ~${tk} tokens)`);
  if (!ok) { fail++; console.log(text); }
  await c.close();
}
process.exit(fail ? 1 : 0);
