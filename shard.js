// shard.js：挑选搬迁的两端（并列取下标最小者）与均衡判定
export function pickMax(loads) {
  let idx = 0;
  for (let i = 1; i < loads.length; i++) {
    if (loads[i] > loads[idx]) idx = i;
  }
  return idx;
}

export function pickMin(loads) {
  let idx = 0;
  for (let i = 1; i < loads.length; i++) {
    if (loads[i] < loads[idx]) idx = i;
  }
  return idx;
}

export function isBalanced(loads) {
  if (loads.length === 0) return true;
  let max = loads[0];
  let min = loads[0];
  for (let i = 1; i < loads.length; i++) {
    if (loads[i] > max) max = loads[i];
    if (loads[i] < min) min = loads[i];
  }
  return max - min <= 1;
}
