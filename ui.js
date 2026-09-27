// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  parts.log.textContent = "节点 " + (spec.nodes || []).length + " 个，搬迁预算 " + (spec.budget || 0) + "。";

  function draw() {
    let view = null;
    try {
      view = render(spec);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    (view.final || []).forEach(function (count, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = "节点 " + spot + " 原有 " + (spec.nodes || [])[spot];
      row.appendChild(head);
      const bar = document.createElement("span");
      bar.className = "bar";
      const fill = document.createElement("i");
      fill.style.width = Math.min(100, count * 15) + "%";
      bar.appendChild(fill);
      row.appendChild(bar);
      const mark = document.createElement("span");
      const moved = (view.moves || []).some(function (pair) { return pair[1] === spot || pair[0] === spot; });
      mark.className = "chip" + (moved ? " warn" : " ok");
      mark.textContent = "收尾 " + count + (moved ? " 有搬迁" : "");
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "收尾差值 " + view.gap + "，搬迁 " + view.move_count + " 次"
      + (view.balanced ? "，已均衡" : "，还没均衡");
    parts.log.textContent = view.count + " 个节点，" + (view.exhausted ? "预算用尽" : "预算还有剩");
  }

  const budgetInput = document.createElement("input");
  budgetInput.type = "number";
  budgetInput.value = "1";
  parts.controls.appendChild(budgetInput);

  const shardInput = document.createElement("input");
  shardInput.type = "number";
  shardInput.value = "6";
  parts.controls.appendChild(shardInput);

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "再均衡一遍";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const addButton = document.createElement("button");
  addButton.textContent = "新增一个节点";
  addButton.addEventListener("click", function () {
    const next = Number(shardInput.value);
    spec.nodes = (spec.nodes || []).concat([Number.isFinite(next) ? Math.max(0, next) : 0]);
    draw();
  });
  parts.controls.appendChild(addButton);

  const dropButton = document.createElement("button");
  dropButton.textContent = "删最后一个节点";
  dropButton.addEventListener("click", function () {
    spec.nodes = (spec.nodes || []).slice(0, Math.max(1, (spec.nodes || []).length - 1));
    draw();
  });
  parts.controls.appendChild(dropButton);

  const bumpButton = document.createElement("button");
  bumpButton.textContent = "预算加一";
  bumpButton.addEventListener("click", function () {
    spec.budget = (spec.budget || 0) + 1;
    draw();
  });
  parts.controls.appendChild(bumpButton);

  draw();
}
