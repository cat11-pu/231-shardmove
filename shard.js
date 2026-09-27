// shard.js：挑选搬迁的两端，并列都取下标最小的那个
export function pickMax(loads) {
  let spot = 0;
  for (let i = 1; i < loads.length; i += 1) {
    if (loads[i] > loads[spot]) spot = i;
  }
  return spot;
}

export function pickMin(loads) {
  let spot = 0;
  for (let i = 1; i < loads.length; i += 1) {
    if (loads[i] < loads[spot]) spot = i;
  }
  return spot;
}

export function isBalanced(loads) {
  return loads[pickMax(loads)] - loads[pickMin(loads)] <= 1;
}
