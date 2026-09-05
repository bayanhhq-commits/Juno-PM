import test from "node:test";
import assert from "node:assert/strict";
import { createJunoServer } from "../server.mjs";

test("serves the local agent health check and interface", async () => {
  const server = createJunoServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    const health = await fetch(`http://127.0.0.1:${port}/api/health`).then((response) => response.json());
    assert.equal(health.ok, true);
    assert.equal(health.mode, "local-agent");
    const page = await fetch(`http://127.0.0.1:${port}/`).then((response) => response.text());
    assert.match(page, /Start Juno Agent/);
    assert.match(page, /agent-ui\.js/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
