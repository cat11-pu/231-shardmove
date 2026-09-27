// rebalance.js：按预算搬迁（基线：一律不搬）
import { pickMax, pickMin, isBalanced } from "./shard.js";

export function planMoves(spec) {
  return { moves: [], move_count: 0, final: spec.nodes || [], gap: 0, balanced: true, exhausted: false };
}
