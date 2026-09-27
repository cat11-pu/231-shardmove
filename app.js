// app.js：渲染结果
import { pickMax, pickMin, isBalanced } from "./shard.js";
import { planMoves } from "./rebalance.js";

export function render(spec) {
  const nodes = spec.nodes || [];
  const view = planMoves(spec);
  const final = view.final || [];
  const tight = planMoves({ budget: 1, nodes: nodes });
  const tightFinal = tight.final || [];
  const total = nodes.reduce(function (sum, count) { return sum + count; }, 0);
  const finalTotal = final.reduce(function (sum, count) { return sum + count; }, 0);
  return { moves: view.moves || [], move_count: view.move_count || 0, final: final,
           gap: view.gap || 0, balanced: !!view.balanced, exhausted: !!view.exhausted,
           conserved: finalTotal === total, tight_exhausted: !!tight.exhausted,
           tight_gap: tight.gap || 0, count: nodes.length,
           tail: isBalanced([2, 1]) ? 1 : 0 };
}
