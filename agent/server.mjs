import http from "node:http";
import { createReadStream } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile, cp } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import { ARTIFACT_KEYS, runJunoAgent } from "./agent-core.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const RUNS_DIR = path.join(ROOT, "data", "runs");
const PORT = Number(process.env.JUNO_PORT || 4173);
const HOST = "127.0.0.1";
const activeRuns = new Map();

const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".csv": "text/csv; charset=utf-8", ".md": "text/markdown; charset=utf-8" };

function json(res, status, value) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(value));
}

async function bodyJson(req, limit = 15 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error("Request is too large. Split the project into smaller source files.");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function runId(prefix = "run") {
  return `${prefix}-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}`;
}

function cleanRunId(value) {
  const id = String(value || "");
  if (!/^[a-z0-9-]+$/i.test(id)) throw new Error("Invalid run ID.");
  return id;
}

async function writeJson(filename, value) {
  await writeFile(filename, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function appendEvent(directory, event) {
  const filename = path.join(directory, "events.jsonl");
  await writeFile(filename, `${JSON.stringify({ at: new Date().toISOString(), ...event })}\n`, { encoding: "utf8", flag: "a" });
}

async function writeArtifacts(directory, productPack) {
  const artifactDirectory = path.join(directory, "artifacts");
  await mkdir(artifactDirectory, { recursive: true });
  for (const key of ARTIFACT_KEYS) await writeFile(path.join(artifactDirectory, `${key}.md`), `${productPack.artifacts[key].trim()}\n`, "utf8");
}

async function listRuns() {
  await mkdir(RUNS_DIR, { recursive: true });
  const names = await readdir(RUNS_DIR);
  const runs = [];
  for (const name of names) {
    try {
      const manifest = JSON.parse(await readFile(path.join(RUNS_DIR, name, "manifest.json"), "utf8"));
      runs.push(manifest);
    } catch {}
  }
  return runs.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

async function startRun(input) {
  const id = runId();
  const directory = path.join(RUNS_DIR, id);
  const controller = new AbortController();
  activeRuns.set(id, controller);
  await mkdir(directory, { recursive: true });
  const safeInput = { ...input, apiKey: undefined, sources: input.sources || [], usage: input.usage || [] };
  const manifest = { id, createdAt: new Date().toISOString(), projectName: input.projectName || "Untitled product", provider: input.provider, model: input.model, status: "running", type: "agent-run" };
  await writeJson(path.join(directory, "manifest.json"), manifest);
  await writeJson(path.join(directory, "input.json"), safeInput);
  await appendEvent(directory, { action: "run_started", provider: input.provider, model: input.model });
  try {
    const stageEvents = [];
    const output = await runJunoAgent(input, {
      signal: controller.signal,
      onStage(event) { stageEvents.push({ at: new Date().toISOString(), ...event }); }
    });
    await writeJson(path.join(directory, "output.json"), output);
    await writeJson(path.join(directory, "stages.json"), stageEvents);
    await writeArtifacts(directory, output.productPack);
    const complete = { ...manifest, status: "draft-ready", completedAt: new Date().toISOString(), sourceCount: input.sources?.length || 0, opportunityCount: output.evidence.opportunities.length, artifactCount: ARTIFACT_KEYS.length };
    await writeJson(path.join(directory, "manifest.json"), complete);
    await appendEvent(directory, { action: "run_completed", status: "draft-ready" });
    return { run: complete, output, stages: stageEvents };
  } catch (error) {
    const failed = { ...manifest, status: controller.signal.aborted ? "cancelled" : "failed", completedAt: new Date().toISOString() };
    await writeJson(path.join(directory, "manifest.json"), failed);
    await writeJson(path.join(directory, "error.json"), { message: error.message, at: new Date().toISOString() });
    await appendEvent(directory, { action: failed.status, message: error.message });
    throw Object.assign(error, { runId: id });
  } finally {
    activeRuns.delete(id);
  }
}

async function readRun(id) {
  const directory = path.join(RUNS_DIR, cleanRunId(id));
  const manifest = JSON.parse(await readFile(path.join(directory, "manifest.json"), "utf8"));
  const output = await readFile(path.join(directory, "output.json"), "utf8").then(JSON.parse).catch(() => null);
  const approvals = await readdir(path.join(directory, "approvals")).then(async (names) => Promise.all(names.map(async (name) => JSON.parse(await readFile(path.join(directory, "approvals", name), "utf8"))))).catch(() => []);
  return { run: manifest, output, approvals };
}

async function approveRun(id, decision) {
  const directory = path.join(RUNS_DIR, cleanRunId(id));
  await stat(path.join(directory, "manifest.json"));
  const approvalDirectory = path.join(directory, "approvals");
  await mkdir(approvalDirectory, { recursive: true });
  const record = { id: runId("approval"), runId: id, decision: decision.decision === "approved" ? "approved" : "rejected", note: String(decision.note || ""), at: new Date().toISOString(), actor: "local-user" };
  await writeJson(path.join(approvalDirectory, `${record.id}.json`), record);
  await appendEvent(directory, { action: "human_decision", decision: record.decision, approvalId: record.id });
  return record;
}

async function restoreRun(id) {
  const sourceId = cleanRunId(id);
  const sourceDirectory = path.join(RUNS_DIR, sourceId);
  const source = await readRun(sourceId);
  if (!source.output) throw new Error("Only a completed run can be restored.");
  const idNew = runId("restore");
  const directory = path.join(RUNS_DIR, idNew);
  await mkdir(directory, { recursive: true });
  await cp(path.join(sourceDirectory, "output.json"), path.join(directory, "output.json"));
  await cp(path.join(sourceDirectory, "artifacts"), path.join(directory, "artifacts"), { recursive: true });
  const manifest = { ...source.run, id: idNew, type: "restore", restoredFrom: sourceId, createdAt: new Date().toISOString(), completedAt: new Date().toISOString(), status: "draft-ready" };
  await writeJson(path.join(directory, "manifest.json"), manifest);
  await appendEvent(directory, { action: "restored", restoredFrom: sourceId });
  return { run: manifest, output: source.output };
}

async function serveStatic(req, res, pathname) {
  const relative = pathname === "/" ? "index.html" : decodeURIComponent(pathname.slice(1));
  const filename = path.resolve(ROOT, relative);
  if (!filename.startsWith(`${ROOT}${path.sep}`)) return json(res, 403, { error: "Forbidden" });
  const info = await stat(filename).catch(() => null);
  if (!info?.isFile()) return json(res, 404, { error: "Not found" });
  res.writeHead(200, { "Content-Type": MIME[path.extname(filename)] || "application/octet-stream", "Cache-Control": "no-store" });
  createReadStream(filename).pipe(res);
}

export function createJunoServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
    try {
      if (req.method === "GET" && url.pathname === "/api/health") return json(res, 200, { ok: true, mode: "local-agent", activeRuns: activeRuns.size });
      if (req.method === "GET" && url.pathname === "/api/runs") return json(res, 200, { runs: await listRuns() });
      if (req.method === "POST" && url.pathname === "/api/agent/run") return json(res, 200, await startRun(await bodyJson(req)));
      if (req.method === "POST" && url.pathname === "/api/agent/cancel") {
        for (const controller of activeRuns.values()) controller.abort(new Error("Cancelled by user."));
        return json(res, 200, { cancelled: activeRuns.size });
      }
      const match = url.pathname.match(/^\/api\/runs\/([a-z0-9-]+)(?:\/(approve|restore))?$/i);
      if (match && req.method === "GET" && !match[2]) return json(res, 200, await readRun(match[1]));
      if (match && req.method === "POST" && match[2] === "approve") return json(res, 200, { approval: await approveRun(match[1], await bodyJson(req)) });
      if (match && req.method === "POST" && match[2] === "restore") return json(res, 200, await restoreRun(match[1]));
      if (req.method === "GET") return await serveStatic(req, res, url.pathname);
      return json(res, 404, { error: "Not found" });
    } catch (error) {
      return json(res, error.code === "ENOENT" ? 404 : 400, { error: error.message, runId: error.runId || null });
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await mkdir(RUNS_DIR, { recursive: true });
  createJunoServer().listen(PORT, HOST, () => {
    console.log(`Juno Agent is ready at http://${HOST}:${PORT}`);
    console.log("Close this window or press Ctrl+C to stop it.");
  });
}
