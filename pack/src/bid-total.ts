#!/usr/bin/env node
import * as z from "zod/v4";
import { main, tool } from "../shared/runner.js";

const t = tool({
  name: "bid_total",
  title: "Bid total with overhead and profit",
  description: "Sum direct costs, apply overhead and profit, and adjust O&P so the final total ends in a chosen suffix (default 786).",
  schema: z.object({ direct_costs: z.array(z.number().positive()).min(1), overhead_pct: z.number().min(0).max(40).default(10), profit_pct: z.number().min(0).max(40).default(10), suffix: z.number().int().min(0).max(999).default(786) }),
  run: ({ direct_costs, overhead_pct, profit_pct, suffix }) => {
    const direct = direct_costs.reduce((a, b) => a + b, 0);
    const base = direct * (1 + (overhead_pct + profit_pct) / 100);
    let total = Math.floor(base / 1000) * 1000 + suffix; if (total < base) total += 1000;
    const op = total - direct; const eff = (op / direct) * 100;
    const f = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `Direct cost: $${f(direct)}\nO&P (adjusted): $${f(op)} (${eff.toFixed(2)}% of direct; target ${overhead_pct + profit_pct}%)\nBid total: $${f(total)}`;
  },
});
main("bid-total", "0.1.0", [t]);
