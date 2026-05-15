#!/usr/bin/env bun

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const home = process.env.HOME || process.env.USERPROFILE || "";
const localBinary = join(home, ".local", "bin", "ntn");
const binary = existsSync(localBinary) ? localBinary : "ntn";

const result = spawnSync(binary, process.argv.slice(2), {
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error(`Failed to execute ${binary}: ${result.error.message}`);
  process.exit(127);
}

process.exit(result.status ?? 1);
