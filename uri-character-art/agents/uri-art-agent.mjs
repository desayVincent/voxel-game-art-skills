#!/usr/bin/env node

import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const agentPath = fileURLToPath(import.meta.url);
const skillRoot = resolve(dirname(agentPath), "..");
const scriptPath = resolve(skillRoot, "scripts", "generate-prompt.mjs");

const child = spawn(process.execPath, [scriptPath, ...process.argv.slice(2)], {
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exitCode = code ?? 1;
});
