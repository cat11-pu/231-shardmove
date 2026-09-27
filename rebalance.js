// rebalance.js：按预算搬迁
import { pickMax, pickMin, isBalanced } from "./shard.js";

function isNonNegInt(value) {
  return Number.isInteger(value) && value >= 0;
}

export function planMoves(spec) {
  const input = spec || {};
  if (!isNonNegInt(input.budget)) {
    const error = new Error("budget must be a non-negative integer");
    error.code = "E_BAD_BUDGET";
    throw error;
  }
  const nodes = input.nodes;
  if (!Array.isArray(nodes) || nodes.length === 0 || !nodes.every(isNonNegInt)) {
    const error = new Error("nodes must be a non-empty array of non-negative integers");
    error.code = "E_BAD_NODES";
    throw error;
  }

  const loads = nodes.slice();
  const moves = [];
  let remaining = input.budget;

  while (remaining > 0 && !isBalanced(loads)) {
    const from = pickMax(loads);
    const to = pickMin(loads);
    moves.push([from, to]);
    loads[from] -= 1;
    loads[to] += 1;
    remaining -= 1;
  }

  const balanced = isBalanced(loads);
  return {
    moves,
    move_count: moves.length,
    final: loads,
    gap: loads.length ? loads[pickMax(loads)] - loads[pickMin(loads)] : 0,
    balanced,
    exhausted: !balanced && remaining === 0
  };
}
