# mcpdiet 🥗

**Your MCP servers are eating your context window. Weigh them.**

```bash
npx github:goldrusher9009-sketch/mcpdiet
```

(`npx mcpdiet` once it's on npm.)

One command finds every MCP server in Claude Desktop, Claude Code, Cursor, VS Code and Windsurf, starts each one exactly like your client does, and tells you:

- **What it costs** — tokens each server burns *before you type a word* (tool names, descriptions and schemas are re-sent every session)
- **What's dead** — servers that no longer start but still clutter your setup
- **What's risky** — hard-coded secrets, unpinned `npx` packages, plain-HTTP remotes, duplicate tool names (shadowing), and tool-poisoning phrasing in descriptions
- **What to do** — a ranked fix list with the tokens you'd save

```
  14,659 tokens  (7.3% of a 200K window)   43 tools   Grade C

  server  tools   tokens
  fat        40   14,400  ██████████████████
  lean        2      162
  dead        0        0   ✗ failed
```

Every run ends with a one-line brag/shame you can paste anywhere.

## Why

Every MCP server dumps its full tool list into the model's context on every session. Three popular servers can cost 30–55K tokens before your first message — slower, pricier, and measurably less accurate tool choice. Security scanners tell you what's malicious; mcpdiet tells you what's *wasteful*, and covers the basic security hygiene in the same pass.

## Use it from your agent

mcpdiet is also an MCP server — and it practices what it preaches (2 tools, <700 tokens).

```json
{ "mcpServers": { "mcpdiet": { "command": "npx", "args": ["-y", "github:goldrusher9009-sketch/mcpdiet", "serve"] } } }
```

Then ask: *"Audit my MCP setup and tell me what to cut."*

## Options

| Flag | Meaning |
|---|---|
| `--config <file>` | Scan this config instead of auto-discovery (repeatable) |
| `--static` | Don't start servers; config-only checks |
| `--json` / `--md` | Machine / markdown output |
| `--timeout <s>` | Per-server startup limit (default 20) |

Exit code is `1` on grade F or any high-severity finding, so you can gate CI.

## Honest limits

- Scanning **starts your configured stdio servers** (as your client would), lists tools, and stops them. Remote servers are not measured.
- Token counts are estimates (chars÷4), good for ranking, not billing.
- Security checks are heuristics. Use a dedicated scanner for audits.
- Nothing leaves your machine; env values are never printed.

MIT licensed.

## CI & teams

Stop bloat and silent tool swaps before they ship:

```bash
npx github:goldrusher9009-sketch/mcpdiet --budget 12000                  # fail the build over 12K tokens
npx github:goldrusher9009-sketch/mcpdiet --save-baseline mcp.lock.json   # fingerprint every tool
npx github:goldrusher9009-sketch/mcpdiet --check-baseline mcp.lock.json  # fail if a trusted tool changed (rug-pull alert)
```

```yaml
# .github/workflows/mcpdiet.yml
on: [pull_request]
jobs:
  mcpdiet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx -y github:goldrusher9009-sketch/mcpdiet --config .mcp.json --budget 12000 --check-baseline mcp.lock.json
```

Need audits for your company's MCP setup or a custom connector? Open an issue.
