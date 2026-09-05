(() => {
  const app = window.JunoProductOS;
  const byId = (id) => document.getElementById(id);
  const files = [];
  let importedUsage = [];
  let running = false;
  let currentRunId = app.getCurrentRunId();

  function setConnection(status, label) {
    const element = byId("agentConnection");
    element.className = `connection-pill ${status}`;
    element.innerHTML = `<i></i>${label}`;
  }

  function setStatus(message) {
    byId("agentRunStatus").textContent = message;
  }

  function setStage(stage, status) {
    const element = document.querySelector(`[data-agent-stage="${stage}"]`);
    if (!element) return;
    element.classList.remove("running", "complete");
    if (status) element.classList.add(status);
  }

  function resetStages() {
    ["evidence", "roadmap", "product_pack", "approval"].forEach((stage) => setStage(stage, ""));
  }

  function escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Local agent request failed (${response.status}).`);
    return payload;
  }

  async function checkConnection() {
    try {
      await fetchJson("/api/health");
      setConnection("connected", "Local agent connected");
      await loadRunHistory();
    } catch {
      setConnection("offline", "Open with START_JUNO.bat");
      setStatus("The interface is open, but the agent brain is not running. Close it and double-click START_JUNO.bat.");
    }
  }

  function parseUsageCsv(text) {
    const rows = text.trim().split(/\r?\n/).filter(Boolean).map((line) => line.split(",").map((cell) => cell.trim()));
    if (rows.length < 2) return [];
    const headers = rows[0].map((header) => header.toLowerCase());
    const required = ["module", "users", "active_users", "completion_rate"];
    if (!required.every((header) => headers.includes(header))) return [];
    return rows.slice(1).map((row) => ({
      module: row[headers.indexOf("module")],
      users: Number(row[headers.indexOf("users")]) || 0,
      active: Number(row[headers.indexOf("active_users")]) || 0,
      completion: Number(row[headers.indexOf("completion_rate")]) || 0
    }));
  }

  function stripHtml(text) {
    const documentValue = new DOMParser().parseFromString(text, "text/html");
    return documentValue.body?.innerText || text;
  }

  async function addFiles(fileList) {
    for (const file of fileList) {
      if (file.size > 4 * 1024 * 1024) {
        app.toast(`${file.name} is larger than 4 MB. Save it as smaller text files first.`);
        continue;
      }
      const extension = file.name.split(".").pop().toLowerCase();
      let content = await file.text();
      if (["html", "htm"].includes(extension)) content = stripHtml(content);
      const usage = extension === "csv" ? parseUsageCsv(content) : [];
      if (usage.length) importedUsage = usage;
      files.push({ id: `FILE-${String(files.length + 1).padStart(3, "0")}`, title: file.name, type: extension.toUpperCase(), content });
    }
    renderFiles();
  }

  function renderFiles() {
    const target = byId("agentFileList");
    if (!files.length) {
      target.innerHTML = "<span>Sample approved sources are ready. Add your real files when available.</span>";
      return;
    }
    target.innerHTML = files.map((file) => `<div class="agent-file"><strong>${escapeHtml(file.title)}</strong><small>${Math.max(1, Math.round(file.content.length / 1024))} KB ready</small></div>`).join("");
  }

  function providerChanged() {
    const provider = byId("agentProvider").value;
    const isOpenAI = provider === "openai";
    byId("apiKeyField").classList.toggle("hidden", !isOpenAI);
    byId("agentModel").value = isOpenAI ? "gpt-5.6-terra" : "llama3.2";
    byId("providerNote").textContent = isOpenAI
      ? "OpenAI mode sends the selected project content to the API. The key is used for this run only and is never written to disk."
      : "Local mode sends content only to the Ollama model running on this computer.";
  }

  function inputs() {
    const provider = byId("agentProvider").value;
    const sources = files.length ? files : app.getSources().map((source) => ({ ...source, content: source.localContent || source.detail }));
    return {
      projectName: byId("agentProjectName").value.trim(),
      goal: byId("agentGoal").value.trim(),
      provider,
      model: byId("agentModel").value.trim(),
      apiKey: provider === "openai" ? byId("agentApiKey").value.trim() : undefined,
      language: byId("agentLanguage").value,
      sources,
      usage: importedUsage.length ? importedUsage : app.getUsage()
    };
  }

  function runningState(active) {
    running = active;
    byId("runJunoAgent").disabled = active;
    byId("primaryAction").disabled = active || app.isKilled();
    byId("cancelJunoRun").classList.toggle("hidden", !active);
  }

  async function runAgent() {
    if (running) return;
    if (app.isKilled()) return app.toast("Clear the kill switch before starting Juno.");
    const payload = inputs();
    if (!payload.projectName || !payload.goal) return app.toast("Add the project name and goal first.");
    if (payload.provider === "openai" && !payload.apiKey) return app.toast("Add your OpenAI API key for this run.");
    resetStages();
    setStage("evidence", "running");
    runningState(true);
    setStatus(`Juno is reading ${payload.sources.length} sources, then it will prioritize, plan, and write the full pack. This can take several minutes.`);
    try {
      const result = await fetchJson("/api/agent/run", { method: "POST", body: JSON.stringify(payload) });
      setStage("evidence", "complete");
      setStage("roadmap", "complete");
      setStage("product_pack", "complete");
      setStage("approval", "running");
      currentRunId = result.run.id;
      app.applyAgentRun(result);
      showResult(result);
      await loadRunHistory();
      setStatus("Juno finished the work. Review the priorities, roadmap, and product pack, then approve or reject the draft.");
    } catch (error) {
      resetStages();
      setStatus(`Juno stopped safely: ${error.message}`);
      app.toast(error.message);
    } finally {
      runningState(false);
      byId("agentApiKey").value = "";
    }
  }

  function showResult(result) {
    byId("agentResultPanel").classList.remove("hidden");
    byId("agentResultTitle").textContent = `${result.run.projectName} · draft ready`;
    byId("agentResultSummary").textContent = result.output.productPack.executive_summary || result.output.evidence.summary;
    byId("agentApprovalBadge").textContent = "Waiting for your approval";
    byId("agentApprovalBadge").className = "badge amber";
  }

  async function decide(decision) {
    if (!currentRunId) return app.toast("Run Juno first.");
    try {
      await fetchJson(`/api/runs/${currentRunId}/approve`, { method: "POST", body: JSON.stringify({ decision }) });
      app.recordAgentDecision(currentRunId, decision);
      setStage("approval", decision === "approved" ? "complete" : "");
      byId("agentApprovalBadge").textContent = decision === "approved" ? "Approved by you" : "Rejected — changes required";
      byId("agentApprovalBadge").className = `badge ${decision === "approved" ? "green" : "red"}`;
      setStatus(decision === "approved" ? "Approved locally. No external system was changed." : "Rejected locally. Earlier versions remain available.");
      await loadRunHistory();
    } catch (error) { app.toast(error.message); }
  }

  async function cancelRun() {
    if (!running) return;
    try { await fetchJson("/api/agent/cancel", { method: "POST", body: "{}" }); }
    catch {}
    setStatus("Cancellation requested. Juno will preserve the partial run log and stop safely.");
  }

  async function loadRunHistory() {
    const select = byId("agentRunHistory");
    if (!select) return;
    try {
      const { runs } = await fetchJson("/api/runs");
      select.innerHTML = runs.length
        ? runs.map((run) => `<option value="${escapeHtml(run.id)}">${escapeHtml(run.projectName)} · ${escapeHtml(run.status)} · ${new Date(run.createdAt).toLocaleString()}</option>`).join("")
        : "<option value=\"\">No saved runs yet</option>";
      if (currentRunId && runs.some((run) => run.id === currentRunId)) select.value = currentRunId;
    } catch {}
  }

  async function restoreRun() {
    const id = byId("agentRunHistory").value;
    if (!id) return app.toast("Choose a completed run first.");
    try {
      const result = await fetchJson(`/api/runs/${id}/restore`, { method: "POST", body: "{}" });
      currentRunId = result.run.id;
      app.applyAgentRun(result);
      showResult(result);
      setStatus(`Restored ${id} as a new local run. The original history was not changed.`);
      await loadRunHistory();
    } catch (error) { app.toast(error.message); }
  }

  byId("agentProvider").addEventListener("change", providerChanged);
  byId("agentFiles").addEventListener("change", (event) => addFiles([...event.target.files]));
  byId("runJunoAgent").addEventListener("click", runAgent);
  byId("cancelJunoRun").addEventListener("click", cancelRun);
  byId("approveAgentRun").addEventListener("click", () => decide("approved"));
  byId("rejectAgentRun").addEventListener("click", () => decide("rejected"));
  byId("restoreAgentRun").addEventListener("click", restoreRun);
  document.addEventListener("juno:run-request", runAgent);
  [byId("globalKill"), byId("auditKill")].forEach((button) => button.addEventListener("click", cancelRun));

  providerChanged();
  checkConnection();
})();
