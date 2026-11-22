#!/usr/bin/env node
import * as z from "zod/v4";
import { main, tool } from "../shared/runner.js";

const t = tool({
  name: "construction_takeoff",
  title: "Construction material takeoff",
  description: "Quick material quantities for concrete slab, drywall, or paint. Includes a waste factor.",
  schema: z.object({
    kind: z.enum(["concrete_slab", "drywall", "paint"]),
    length_ft: z.number().positive(), width_ft: z.number().positive().describe("Width, or wall height for drywall/paint"),
    thickness_in: z.number().positive().default(4).describe("Slab thickness (concrete only)"),
    waste_pct: z.number().min(0).max(30).default(10),
  }),
  run: ({ kind, length_ft: L, width_ft: W, thickness_in: T, waste_pct: w }) => {
    const k = 1 + w / 100;
    if (kind === "concrete_slab") { const cy = (L * W * (T / 12)) / 27 * k; return `Concrete: ${cy.toFixed(2)} cubic yards (incl. ${w}% waste)\n80-lb bags: ${Math.ceil(cy * 45)}`; }
    const area = L * W;
    if (kind === "drywall") return `Area: ${area.toFixed(1)} sq ft\n4x8 sheets: ${Math.ceil((area / 32) * k)} (incl. ${w}% waste)\nJoint compound: about ${Math.ceil(area / 400)} gal\nScrews: about ${Math.ceil((area / 32) * k * 32)}`;
    return `Area: ${area.toFixed(1)} sq ft (one coat)\nPaint: ${(area / 350 * k).toFixed(1)} gal per coat (incl. ${w}% waste), ${(area / 350 * k * 2).toFixed(1)} gal for two coats`;
  },
});
main("takeoff", "0.1.0", [t]);
