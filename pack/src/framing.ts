#!/usr/bin/env node
import * as z from "zod/v4";
import { main, tool } from "../shared/runner.js";

const t = tool({
  name: "framing_takeoff",
  title: "Wall framing takeoff",
  description: "Studs, plates and sheathing for a framed wall run. Standard 16 or 24 inch spacing, doubled top plate, extra studs per opening.",
  schema: z.object({ length_ft: z.number().positive(), height_ft: z.number().positive().default(9), spacing_in: z.union([z.literal(16), z.literal(24)]).default(16), openings: z.number().int().min(0).default(0), waste_pct: z.number().min(0).max(30).default(10) }),
  run: ({ length_ft: L, height_ft: H, spacing_in: s, openings, waste_pct: w }) => {
    const studs = Math.ceil((L * 12) / s) + 1 + 2 + openings * 4, k = 1 + w / 100;
    const plateLf = L * 3, plates = Math.ceil((plateLf / 12) * k);
    const sheets = Math.ceil(((L * H) / 32) * k);
    return `Studs: ${Math.ceil(studs * k)} (incl. ${w}% waste)\nPlate lumber: ${plateLf.toFixed(1)} LF (${plates} x 12-ft pieces)\n4x8 sheathing: ${sheets} sheets`;
  },
});
main("framing", "0.1.0", [t]);
