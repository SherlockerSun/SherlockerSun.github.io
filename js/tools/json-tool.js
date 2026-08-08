(function () {
  const sampleText = JSON.stringify(
    [
      { id: 1, name: "Alice", age: 28, active: true, city: "Paris" },
      { id: 2, name: "Bob", age: 34, active: false, city: "London" },
      { id: 3, name: "Charlie", age: 42, active: true, city: "Berlin" },
      { id: 4, name: "Diana", age: 29, active: true, city: "Madrid" },
      { id: 5, name: "Eve", age: 31, active: false, city: "Rome" },
      { id: 6, name: "Frank", age: 27, active: true, city: "Lisbon" }
    ],
    null,
    2
  );

  const zeroStats = { nodes: 0, objects: 0, arrays: 0, keys: 0, depth: 0, chars: 0 };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function highlightJson(value) {
    return escapeHtml(JSON.stringify(value, null, 2))
      .replace(/("(?:[^"\\]|\\.)*")(?=\s*:)/g, '<span class="json-key">$1</span>')
      .replace(/: ("(?:[^"\\]|\\.)*")/g, ': <span class="json-string">$1</span>')
      .replace(/: (-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)/gi, ': <span class="json-number">$1</span>')
      .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
      .replace(/: (null)/g, ': <span class="json-null">$1</span>');
  }

  function printJson(value, compact) {
    return JSON.stringify(value, null, compact ? 0 : 2);
  }

  function sortKeys(value) {
    if (Array.isArray(value)) return value.map(sortKeys);
    if (!value || typeof value !== "object") return value;
    return Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc, key) => {
        acc[key] = sortKeys(value[key]);
        return acc;
      }, {});
  }

  function parsePath(path) {
    const clean = String(path || "").trim().replace(/^\$\.?/, "");
    if (!clean) return [];
    const tokens = [];
    const matcher = /(?:^|\.)([^.[\]]+)|\[(?:"([^"]+)"|'([^']+)'|(\d+))\]/g;
    let match;
    while ((match = matcher.exec(clean))) {
      const token = match[1] || match[2] || match[3] || match[4];
      tokens.push(/^\d+$/.test(token) ? Number(token) : token);
    }
    return tokens;
  }

  function getByPath(value, path) {
    return parsePath(path).reduce((current, token) => {
      if (current === undefined || current === null) return undefined;
      return current[token];
    }, value);
  }

  function collectObjects(value, bucket) {
    if (Array.isArray(value)) {
      value.forEach(item => collectObjects(item, bucket));
      return bucket;
    }
    if (value && typeof value === "object") {
      bucket.push(value);
      Object.values(value).forEach(item => collectObjects(item, bucket));
    }
    return bucket;
  }

  function inferValue(raw) {
    const text = String(raw).trim();
    if (text === "true") return true;
    if (text === "false") return false;
    if (text === "null") return null;
    if (text !== "" && !Number.isNaN(Number(text))) return Number(text);
    return text;
  }

  function getStats(value, chars) {
    const stats = { ...zeroStats, chars };
    const walk = (node, depth) => {
      stats.nodes += 1;
      stats.depth = Math.max(stats.depth, depth);
      if (Array.isArray(node)) {
        stats.arrays += 1;
        node.forEach(item => walk(item, depth + 1));
        return;
      }
      if (node && typeof node === "object") {
        stats.objects += 1;
        const keys = Object.keys(node);
        stats.keys += keys.length;
        keys.forEach(key => walk(node[key], depth + 1));
      }
    };
    walk(value, 1);
    return stats;
  }

  function setStatus(nodes, text, type) {
    nodes.status.textContent = text;
    nodes.status.className = "json-status" + (type ? " is-" + type : "");
  }

  function renderStats(nodes, stats) {
    const map = [
      ["nodes", "节点"],
      ["objects", "对象"],
      ["arrays", "数组"],
      ["keys", "键"],
      ["depth", "深度"],
      ["chars", "字符"]
    ];
    nodes.stats.innerHTML = map
      .map(([key, label]) => `<span>${label} <strong>${stats[key]}</strong></span>`)
      .join("");
  }

  function readJson(nodes) {
    const raw = nodes.input.value.trim();
    if (!raw) throw new Error("请输入 JSON。");
    return JSON.parse(raw);
  }

  function getFilterData(rootValue, arrayPath) {
    if (arrayPath.trim()) {
      const target = getByPath(rootValue, arrayPath);
      if (!Array.isArray(target)) throw new Error("数组路径没有指向 JSON 数组。");
      return target;
    }
    if (Array.isArray(rootValue)) return rootValue;
    return collectObjects(rootValue, []);
  }

  function matchItem(item, field, rawValue, mode) {
    if (!field) return true;
    const itemValue = getByPath(item, field);
    if (mode === "exists") return itemValue !== undefined;
    if (itemValue === undefined || itemValue === null) return false;

    const expected = inferValue(rawValue);
    if (mode === "exact") return itemValue === expected;
    if (mode === "contains") return String(itemValue).toLowerCase().includes(String(rawValue).toLowerCase());
    if (mode === "starts") return String(itemValue).toLowerCase().startsWith(String(rawValue).toLowerCase());
    if (mode === "ends") return String(itemValue).toLowerCase().endsWith(String(rawValue).toLowerCase());
    if (mode === "gt") return Number(itemValue) > Number(expected);
    if (mode === "lt") return Number(itemValue) < Number(expected);
    return false;
  }

  function filterJson(nodes) {
    const value = readJson(nodes);
    const list = getFilterData(value, nodes.arrayPath.value);
    const field = nodes.field.value.trim();
    const mode = nodes.match.value;
    const filtered = list.filter(item => item && typeof item === "object" && matchItem(item, field, nodes.value.value, mode));
    nodes.resultCount.textContent = filtered.length + " 条";
    nodes.filterResult.innerHTML = filtered.length
      ? highlightJson(filtered)
      : '<span class="json-placeholder">没有匹配的记录。</span>';
    setStatus(nodes, "查询完成，共 " + list.length + " 条数据。", "ok");
  }

  function init(root) {
    if (!root || root.dataset.jsonToolReady === "true") return;

    const nodes = {
      input: root.querySelector("[data-json-input]"),
      output: root.querySelector("[data-json-output]"),
      status: root.querySelector("[data-json-status]"),
      stats: root.querySelector("[data-json-stats]"),
      arrayPath: root.querySelector("[data-json-array-path]"),
      field: root.querySelector("[data-json-field]"),
      value: root.querySelector("[data-json-value]"),
      match: root.querySelector("[data-json-match]"),
      filterResult: root.querySelector("[data-json-filter-result]"),
      resultCount: root.querySelector("[data-json-result-count]")
    };

    if (Object.values(nodes).some(node => !node)) return;
    root.dataset.jsonToolReady = "true";

    const refreshStats = () => {
      if (!nodes.input.value.trim()) {
        renderStats(nodes, zeroStats);
        setStatus(nodes, "等待输入 JSON。");
        return;
      }
      try {
        const value = readJson(nodes);
        renderStats(nodes, getStats(value, nodes.input.value.length));
        setStatus(nodes, "JSON 有效。", "ok");
      } catch (error) {
        setStatus(nodes, error.message, "error");
      }
    };

    const run = action => {
      try {
        if (action === "sample") {
          nodes.input.value = sampleText;
          nodes.output.value = sampleText;
          nodes.field.value = "name";
          nodes.value.value = "Alice";
          nodes.match.value = "exact";
          renderStats(nodes, getStats(JSON.parse(sampleText), sampleText.length));
          filterJson(nodes);
          return;
        }

        if (action === "clear") {
          nodes.input.value = "";
          nodes.output.value = "";
          nodes.field.value = "";
          nodes.value.value = "";
          nodes.arrayPath.value = "";
          nodes.filterResult.innerHTML = '<span class="json-placeholder">等待查询。</span>';
          nodes.resultCount.textContent = "0 条";
          renderStats(nodes, zeroStats);
          setStatus(nodes, "等待输入 JSON。");
          return;
        }

        if (action === "reset-filter") {
          nodes.arrayPath.value = "";
          nodes.field.value = "name";
          nodes.value.value = "Alice";
          nodes.match.value = "exact";
          filterJson(nodes);
          return;
        }

        const value = readJson(nodes);
        renderStats(nodes, getStats(value, nodes.input.value.length));

        if (action === "format") {
          nodes.output.value = printJson(value);
          setStatus(nodes, "格式化完成。", "ok");
        } else if (action === "minify") {
          nodes.output.value = printJson(value, true);
          setStatus(nodes, "压缩完成。", "ok");
        } else if (action === "sort") {
          nodes.output.value = printJson(sortKeys(value));
          setStatus(nodes, "排序完成。", "ok");
        } else if (action === "copy") {
          const text = nodes.output.value || printJson(value);
          navigator.clipboard.writeText(text).then(
            () => setStatus(nodes, "已复制到剪贴板。", "ok"),
            () => setStatus(nodes, "复制失败，请手动选择结果复制。", "error")
          );
        } else if (action === "download") {
          const text = nodes.output.value || printJson(value);
          const blob = new Blob([text], { type: "application/json;charset=utf-8" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "data.json";
          link.click();
          URL.revokeObjectURL(link.href);
          setStatus(nodes, "已生成下载文件。", "ok");
        } else if (action === "filter") {
          filterJson(nodes);
        }
      } catch (error) {
        setStatus(nodes, error.message, "error");
      }
    };

    root.addEventListener("click", event => {
      const button = event.target.closest("[data-json-action]");
      if (!button || !root.contains(button)) return;
      run(button.dataset.jsonAction);
    });

    [nodes.field, nodes.value].forEach(input => {
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") run("filter");
      });
    });
    nodes.match.addEventListener("change", () => run("filter"));
    nodes.input.addEventListener("input", refreshStats);
    renderStats(nodes, zeroStats);
  }

  function boot() {
    document.querySelectorAll("[data-json-tool]").forEach(init);
  }

  window.SherlockerJsonTool = { init: boot };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
  document.addEventListener("pjax:complete", boot);
})();
