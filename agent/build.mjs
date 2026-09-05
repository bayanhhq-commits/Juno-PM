import { cp, mkdir, rm } from "node:fs/promises";

const release = "release/Juno-Agent-Windows";
const files = [
  "index.html", "styles.css", "app.js", "agent-ui.js", "agent-core.mjs",
  "server.mjs", "package.json", "README.md", "START_JUNO.bat",
  "SETUP_LOCAL_MODEL.bat", "sample-module-usage.csv"
];

await rm("release", { recursive: true, force: true });
await mkdir(release, { recursive: true });
for (const file of files) await cp(file, `${release}/${file}`);
await mkdir(`${release}/data/runs`, { recursive: true });

console.log(`Built ${release} with ${files.length} application files.`);
