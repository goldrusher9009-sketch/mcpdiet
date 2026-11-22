import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

export interface Tool<S extends z.ZodObject = z.ZodObject> {
  name: string;
  title: string;
  description: string;
  schema: S;
  run: (args: z.infer<S>) => Promise<string> | string;
}

export function tool<S extends z.ZodObject>(t: Tool<S>): Tool<S> {
  return t;
}

export const tokens = (s: string): number => Math.ceil(s.length / 4);

function createServerFor(name: string, version: string, tools: Tool[]): () => McpServer {
  return () => {
    const server = new McpServer({ name, version });
    for (const t of tools) {
      server.registerTool(
        t.name,
        { title: t.title, description: t.description, inputSchema: t.schema, annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false } },
        async (args: unknown) => {
          try {
            return { content: [{ type: "text" as const, text: await t.run(args as never) }] };
          } catch (e) {
            return { isError: true, content: [{ type: "text" as const, text: (e as Error).message }] };
          }
        }
      );
    }
    return server;
  };
}

/** `<cmd> serve` runs the MCP server; `<cmd> <path> [--key value]` runs the first tool as a CLI. */
export async function main(name: string, version: string, tools: Tool[]): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv[0] === "serve") {
    serveStdio(createServerFor(name, version, tools));
    console.error(`${name} running on stdio`);
    return;
  }
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(`${name} ${version}\n\n${tools[0].description}\n\nUsage:\n  npx ${name} <path> [--option value]\n  npx ${name} serve    (run as an MCP server)`);
    return;
  }
  const t = tools[0];
  const keys = Object.keys(t.schema.shape);
  const raw: Record<string, string> = {};
  let positional = 0;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) raw[argv[i].slice(2)] = argv[++i] ?? "true";
    else if (positional < keys.length) raw[keys[positional++]] = argv[i];
  }
  try {
    const args = t.schema.parse(Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v === "true" ? true : v === "false" ? false : v])));
    console.log(await t.run(args as never));
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}
