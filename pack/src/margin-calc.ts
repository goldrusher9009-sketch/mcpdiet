#!/usr/bin/env node
import * as z from "zod/v4";
import { main, tool } from "../shared/runner.js";

const t = tool({
  name: "margin_calc",
  title: "Markup vs margin calculator",
  description: "Convert between markup and margin and compute the price for a target margin. Prevents the common markup/margin mix-up in bids.",
  schema: z.object({ cost: z.number().positive(), margin_pct: z.number().min(0).max(95).optional().describe("Target gross margin %"), markup_pct: z.number().min(0).max(1000).optional().describe("Markup % on cost") }),
  run: ({ cost, margin_pct, markup_pct }) => {
    if (margin_pct === undefined && markup_pct === undefined) throw new Error("Give margin_pct or markup_pct.");
    const price = margin_pct !== undefined ? cost / (1 - margin_pct / 100) : cost * (1 + markup_pct! / 100);
    const profit = price - cost;
    return `Cost: $${cost.toFixed(2)}\nPrice: $${price.toFixed(2)}\nProfit: $${profit.toFixed(2)}\nMargin: ${((profit / price) * 100).toFixed(2)}%\nMarkup: ${((profit / cost) * 100).toFixed(2)}%`;
  },
});
main("margin-calc", "0.1.0", [t]);
