// rebalance.js：按预算搬迁，每轮从最多搬一个到最少
import { pickMax, pickMin, isBalanced } from "./shard.js";

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

export function planMoves(spec) {
  const budget = spec && spec.budget;
  const nodes = spec && spec.nodes;
  if (!Number.isInteger(budget) || budget < 0) {
    fail("E_BAD_BUDGET", "预算必须是非负整数");
  }
  if (!Array.isArray(nodes) || nodes.length === 0
      || nodes.some(function (count) { return !Number.isInteger(count) || count < 0; })) {
    fail("E_BAD_NODES", "节点表不能为空，且分片数必须是非负整数");
  }

  const final = nodes.slice();
  const moves = [];
  let left = budget;
  while (!isBalanced(final) && left > 0) {
    const from = pickMax(final);
    const to = pickMin(final);
    final[from] -= 1;
    final[to] += 1;
    moves.push([from, to]);
    left -= 1;
  }

  const balanced = isBalanced(final);
  return {
    moves: moves,
    move_count: moves.length,
    final: final,
    gap: final[pickMax(final)] - final[pickMin(final)],
    balanced: balanced,
    exhausted: !balanced && left === 0
  };
}
