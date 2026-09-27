import assert from "node:assert";
import { pickMax, pickMin, isBalanced } from "../shard.js";
import { planMoves } from "../rebalance.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("pickMax returns an index", () => {
  assert.strictEqual(typeof pickMax([1, 2]), "number");
});

check("pickMin returns an index", () => {
  assert.strictEqual(typeof pickMin([1, 2]), "number");
});

check("isBalanced returns a flag", () => {
  assert.strictEqual(typeof isBalanced([1, 1]), "boolean");
});

check("planMoves returns moves", () => {
  assert.ok(Array.isArray(planMoves({ budget: 0, nodes: [1] }).moves));
});

check("render exposes balanced flag", () => {
  assert.strictEqual(typeof render({ budget: 0, nodes: [1] }).balanced, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
