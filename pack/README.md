# mcp-pack

Small, keyless MCP connectors. Each runs as a CLI (`node dist/src/<name>.js <path>`) or as a stdio MCP server (`... serve`).

20 connectors: see `src/`. Install: `npx @hashshabbir/mcp-pack`-style bins such as `repo-weigh`, `envguard`, `bid-total`.

`npm install && npm run build && npm test`

## mcpseal: check an MCP server before you install it

Every MCP server you install runs a stranger's code next to your files and keys. mcpseal grades a package A-F first.

    npx -p @hashshabbir/mcp-pack mcpseal @scope/some-mcp-server
    npx -p @hashshabbir/mcp-pack mcpseal ./my-server --badge seal.svg

It flags install scripts, credential-file access, dynamic code, shell use, and sends-to-webhook patterns. Authors can add the badge to their README. Static check only: it cannot prove a package is safe.
