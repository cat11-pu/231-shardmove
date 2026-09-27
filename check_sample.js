import fs from "node:fs";
import { pickMax, pickMin, isBalanced } from "./shard.js";
import { planMoves } from "./rebalance.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/nodes.json", "utf8"));
const view = render(spec);

emit("搬迁序列 =", JSON.stringify(view.moves));
emit("搬迁次数 =", view.move_count);
emit("收尾分片表 =", JSON.stringify(view.final));
emit("收尾差值 =", view.gap);
emit("达成均衡 =", view.balanced);
emit("预算用尽 =", view.exhausted);
emit("守恒复核 =", view.conserved);
emit("紧预算超支 =", view.tight_exhausted);
emit("紧预算收尾差值 =", view.tight_gap);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  planMoves({ budget: -1, nodes: [1, 1] });
  emit("预算写错的错误码", "没有报错");
} catch (error) {
  emit("预算写错的错误码", error && error.code ? error.code : String(error.message));
}
try {
  planMoves({ budget: 1, nodes: [] });
  emit("节点写错的错误码", "没有报错");
} catch (error) {
  emit("节点写错的错误码", error && error.code ? error.code : String(error.message));
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "搬迁序列": [
    [
      0,
      1
    ],
    [
      0,
      1
    ]
  ],
  "搬迁次数": 2,
  "收尾分片表": [
    3,
    3,
    3,
    3
  ],
  "收尾差值": 0,
  "达成均衡": true,
  "预算用尽": false,
  "守恒复核": true,
  "紧预算超支": true,
  "紧预算收尾差值": 2,
  "预算写错的错误码": "E_BAD_BUDGET",
  "节点写错的错误码": "E_BAD_NODES"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
