# Juno User Manual

## Choose the right version

- **V1** demonstrates prioritization controls and reversibility entirely in the browser.
- **V2** is the complete interactive Product OS walkthrough and the best version for an instructor demo.
- **V3** is the real local agent. It reads files, calls Ollama or OpenAI, writes the product pack, and saves run history.

## Start V3 on Windows

1. Install Node.js 20 or later.
2. Download and unzip `downloads/juno-agent-v3-windows.zip`.
3. Double-click `START_JUNO.bat`.
4. Keep the terminal window open while using Juno.

For fully local inference, install Ollama and run `SETUP_LOCAL_MODEL.bat` once. For OpenAI, choose the OpenAI provider and enter the key for the current session; the key is not written to disk.

## Prepare inputs

Use approved, de-identified sources in TXT, MD, CSV, JSON, or HTML. Save protected LMS pages as HTML or copy their relevant content into Markdown. For module usage, use columns similar to:

```csv
module,users,active_users,completion_rate
Analytics,1200,730,0.61
Exports,900,610,0.42
```

Do not use secrets, credentials, regulated data, or confidential customer material in a demo workspace.

## Run a workspace

1. Name the product decision.
2. Add strategy or constraints if available.
3. Select the provider: Ollama or OpenAI.
4. Add the approved files and module-usage data.
5. Start the run.
6. Inspect opportunities, priorities, source context, roadmap path, assumptions, and missing evidence.
7. Open the generated product artifacts.
8. Approve only when the reasoning and evidence are acceptable; otherwise reject with a note and rerun.

## Understand the controls

| Control | Effect |
|---|---|
| Stop current run | Cancels current processing and preserves earlier runs |
| Kill switch | Stops active/queued work and blocks new decisions until cleared |
| Approve | Adds an approval decision for the selected run |
| Reject | Adds a rejection decision and reviewer note |
| Undo | Reverses a browser-workspace change without deleting the audit event |
| Restore | Creates a new state from a previous run; the earlier run remains unchanged |
| Export | Available only for approved output |

## Find results

V3 writes each run into its own folder under `data/runs/`. A run contains the source snapshot, structured stages, generated artifacts, and later decision events. Never commit this folder to Git.

## Troubleshooting

- **The page does not open:** confirm the terminal window is still running and Node.js is version 20+.
- **Ollama is unavailable:** start Ollama, install the configured model, and retry.
- **OpenAI call fails:** confirm the key and network access; the key must be entered again after restart.
- **File is unsupported:** save it as HTML, TXT, Markdown, CSV, or JSON.
- **Output is weak:** add direct user evidence, clearer strategy, or better usage context; do not approve unsupported work.
- **Need an older result:** use Restore. Do not overwrite or delete earlier run folders.
