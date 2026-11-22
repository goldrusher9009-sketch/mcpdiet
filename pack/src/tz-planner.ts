#!/usr/bin/env node
import * as z from "zod/v4";
import { main, tool } from "../shared/runner.js";

const t = tool({
  name: "meeting_times",
  title: "Find meeting times across time zones",
  description: "Given IANA time zones, list the hours (UTC) that fall inside working hours for everyone.",
  schema: z.object({ zones: z.array(z.string()).min(2).describe('e.g. ["America/New_York","Europe/London"]'), start: z.number().int().min(0).max(23).default(9), end: z.number().int().min(1).max(24).default(17), date: z.string().optional().describe("YYYY-MM-DD, default today") }),
  run: ({ zones, start, end, date }) => {
    const day = date ?? new Date().toISOString().slice(0, 10); const ok: number[] = [];
    const hourIn = (z: string, d: Date) => Number(new Intl.DateTimeFormat("en-US", { timeZone: z, hour: "2-digit", hour12: false }).format(d)) % 24;
    for (let h = 0; h < 24; h++) { const d = new Date(`${day}T${String(h).padStart(2, "0")}:00:00Z`); if (zones.every((zn) => { const x = hourIn(zn, d); return x >= start && x < end; })) ok.push(h); }
    if (!ok.length) return `No shared ${start}:00-${end}:00 window on ${day}. Widen the hours or rotate who takes the early or late slot.`;
    return `Shared windows on ${day}:\n` + ok.map((h) => `${String(h).padStart(2, "0")}:00 UTC = ` + zones.map((zn) => `${zn.split("/").pop()} ${String(hourIn(zn, new Date(`${day}T${String(h).padStart(2, "0")}:00:00Z`))).padStart(2, "0")}:00`).join(", ")).join("\n");
  },
});
main("tz-planner", "0.1.0", [t]);
