import { Client } from "@modelcontextprotocol/client";
import { getDefaultEnvironment, StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import type { ServerEntry } from "./configs.js";

export interface MeasuredTool {
  name: string;
  description: string;
  schemaChars: number;
  tokens: number;
}

export interface Measurement {
  status: "ok" | "failed" | "remote" | "skipped";
  error?: string;
  startMs?: number;
  tools: MeasuredTool[];
}

/** Rough token estimate (chars ÷ 4). Good enough to rank servers; not a billing figure. */
export const estimateTokens = (chars: number): number => Math.ceil(chars / 4);

async function withTimeout<T>(p: Promise<T>, ms: number, what: string): Promise<T> {
  let t: NodeJS.Timeout;
  const timeout = new Promise<never>((_, rej) => (t = setTimeout(() => rej(new Error(`${what} timed out after ${ms / 1000}s`)), ms)));
  try {
    return await Promise.race([p, timeout]);
  } finally {
    clearTimeout(t!);
  }
}

/** Start a configured stdio server, list its tools exactly as an agent would see them, then shut it down. */
export async function measureServer(entry: ServerEntry, timeoutMs: number): Promise<Measurement> {
  if (!entry.command) {
    return { status: entry.url ? "remote" : "skipped", tools: [], error: entry.url ? "remote server (not measured)" : "no command" };
  }
  const client = new Client({ name: "mcpdiet", version: "0.1.0" });
  const started = Date.now();
  try {
    const transport = new StdioClientTransport({
      command: entry.command,
      args: entry.args,
      env: { ...getDefaultEnvironment(), ...entry.env },
      stderr: "ignore"
    });
    await withTimeout(client.connect(transport), timeoutMs, "startup");
    const startMs = Date.now() - started;
    const tools: MeasuredTool[] = [];
    let cursor: string | undefined;
    do {
      const page = await withTimeout(client.listTools(cursor ? { cursor } : undefined), timeoutMs, "tools/list");
      for (const t of page.tools) {
        // What the model actually pays for: name + description + input schema (+ title/annotations are small)
        const payload = JSON.stringify({ name: t.name, description: t.description ?? "", inputSchema: t.inputSchema, outputSchema: (t as any).outputSchema });
        tools.push({
          name: t.name,
          description: t.description ?? "",
          schemaChars: payload.length,
          tokens: estimateTokens(payload.length)
        });
      }
      cursor = page.nextCursor;
    } while (cursor);
    return { status: "ok", startMs, tools };
  } catch (e) {
    return { status: "failed", error: (e as Error).message.split("\n")[0].slice(0, 160), tools: [] };
  } finally {
    try {
      await client.close();
    } catch {
      /* already gone */
    }
  }
}
