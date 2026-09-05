import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
import { ARTIFACT_KEYS } from "../agent-core.mjs";

class ClassList {
  constructor() { this.values = new Set(); }
  add(...values) { values.forEach((value) => this.values.add(value)); }
  remove(...values) { values.forEach((value) => this.values.delete(value)); }
  toggle(value, force) {
    const enabled = force === undefined ? !this.values.has(value) : Boolean(force);
    enabled ? this.values.add(value) : this.values.delete(value);
    return enabled;
  }
}

class Element {
  constructor(key, document) { this.key = key; this.ownerDocument = document; this.classList = new ClassList(); this.dataset = {}; this.style = {}; this.value = ""; this.textContent = ""; this.innerHTML = ""; this.className = ""; this.disabled = false; }
  addEventListener() {}
  querySelector(selector) { return this.ownerDocument.querySelector(`${this.key} ${selector}`); }
  closest() { return this; }
  showModal() {}
  close() {}
  reset() {}
  click() {}
}

class Document {
  constructor() { this.elements = new Map(); }
  querySelector(selector) { if (!this.elements.has(selector)) this.elements.set(selector, new Element(selector, this)); return this.elements.get(selector); }
  querySelectorAll() { return []; }
  createElement(tag) { return new Element(tag, this); }
  dispatchEvent() {}
}

test("maps a real agent result into the review, roadmap, pack, and audit workspace", async () => {
  const document = new Document();
  const storage = new Map();
  const window = {};
  const context = vm.createContext({
    console, window, document, structuredClone, crypto: webcrypto, Blob, URL, Date,
    CustomEvent: class {}, confirm: () => false, setTimeout: () => 1, clearTimeout: () => {},
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) }
  });
  vm.runInContext(await readFile(new URL("../app.js", import.meta.url), "utf8"), context, { filename: "app.js" });
  const artifacts = Object.fromEntries(ARTIFACT_KEYS.map((key) => [key, `# ${key}`]));
  const result = {
    run: { id: "run-test", projectName: "Test product" },
    output: {
      evidence: { opportunities: [{ id: "OPP-100", title: "Reliable export", user_problem: "Exports fail", evidence_source_ids: ["S-1"], impact: 5, evidence_strength: 5, strategy_alignment: 4, urgency: 5, effort: 2, risk: 2 }] },
      roadmap: { roadmap_items: [{ opportunity_id: "OPP-100", priority: "P0", lane: "Now", path: "Reliability Fix", current_stage: "Diagnose", owner: "Platform" }] },
      productPack: { selected_opportunity_id: "OPP-100", artifacts }
    }
  };
  context.agentResult = result;
  vm.runInContext("window.JunoProductOS.applyAgentRun(agentResult)", context);
  assert.equal(vm.runInContext("state.opportunities.length", context), 1);
  assert.equal(vm.runInContext('state.opportunities[0].path', context), "Reliability Fix");
  assert.equal(vm.runInContext('Object.keys(state.artifacts["OPP-100"]).length', context), 13);
  assert.equal(vm.runInContext("state.agentRunId", context), "run-test");
  assert.equal(vm.runInContext('state.versions.at(-1).approval', context), "draft");
  vm.runInContext('window.JunoProductOS.recordAgentDecision("run-test", "approved")', context);
  assert.equal(vm.runInContext('state.versions.at(-1).approval', context), "approved");
});
