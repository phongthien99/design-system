#!/usr/bin/env node
// Per-item versions for the Company UI registry.
//
//   node scripts/registry-version.mjs check                          fail if an item changed without a version bump
//   node scripts/registry-version.mjs register                       record new items at 0.1.0
//   node scripts/registry-version.mjs bump <item> <patch|minor|major> -m "message" [--no-changeset]
//   node scripts/registry-version.mjs log [item]                     show history for one item, or the latest per item
//
// Two files hold the state:
//   registry/company/ui/registry.json   items carry `meta.version` (shadcn `meta` is free-form), read by company-ui
//   registry/company/ui/versions.json   ledger: version, content hash and history per item
//
// `bump` also writes a Changeset for `@company/registry`, so the registry-wide release notes stay in sync.

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryDir = path.join(rootDir, "registry/company/ui");
const registryFile = path.join(registryDir, "registry.json");
const ledgerFile = path.join(registryDir, "versions.json");
const changesetDir = path.join(rootDir, ".changeset");

const initialVersion = "0.1.0";
const bumpLevels = ["patch", "minor", "major"];

const args = process.argv.slice(2);
const command = args[0];

try {
  if (command === "check") {
    process.exitCode = await check();
  } else if (command === "register") {
    await register();
  } else if (command === "bump") {
    await bump(parseBumpArgs(args.slice(1)));
  } else if (command === "log") {
    await log(args[1]);
  } else {
    console.log(
      [
        "Usage:",
        "  registry-version.mjs check",
        "  registry-version.mjs register",
        '  registry-version.mjs bump <item> <patch|minor|major> -m "message" [--no-changeset]',
        "  registry-version.mjs log [item]"
      ].join("\n")
    );
    process.exitCode = command ? 1 : 0;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

async function check() {
  const registry = await readJson(registryFile);
  const ledger = await readLedger();
  const problems = [];
  const seen = new Set();

  for (const item of registry.items) {
    seen.add(item.name);
    const entry = ledger[item.name];

    if (!entry) {
      problems.push(`${item.name}: not in versions.json (run: pnpm registry:register)`);
      continue;
    }

    if (item.meta?.version !== entry.version) {
      problems.push(
        `${item.name}: meta.version is ${item.meta?.version ?? "missing"} but versions.json says ${entry.version}`
      );
    }

    if ((await hashItem(item)) !== entry.hash) {
      problems.push(
        `${item.name}: changed since ${entry.version}, needs a bump (run: pnpm registry:bump ${item.name} <patch|minor|major> -m "...")`
      );
    }
  }

  for (const name of Object.keys(ledger)) {
    if (!seen.has(name)) {
      problems.push(`${name}: in versions.json but no longer in registry.json (remove it, or deprecate instead)`);
    }
  }

  if (problems.length === 0) {
    console.log(`All ${registry.items.length} registry items are versioned and unchanged since their last bump.`);
    return 0;
  }

  for (const problem of problems) console.error(problem);
  return 1;
}

async function register() {
  const registry = await readJson(registryFile);
  const ledger = await readLedger();
  const registered = [];

  for (const item of registry.items) {
    if (ledger[item.name]) continue;

    const version = item.meta?.version ?? initialVersion;
    ledger[item.name] = {
      version,
      hash: await hashItem(item),
      history: [{ version, date: today(), bump: "initial", message: "Initial version" }]
    };
    item.meta = { ...item.meta, version };
    registered.push(item.name);
  }

  // Also back-fill meta.version for items that are already in the ledger.
  for (const item of registry.items) {
    if (item.meta?.version !== ledger[item.name].version) {
      item.meta = { ...item.meta, version: ledger[item.name].version };
    }
  }

  await writeJson(registryFile, registry);
  await writeJson(ledgerFile, ledger);
  console.log(registered.length ? `Registered ${registered.length}: ${registered.join(", ")}` : "Nothing to register.");
}

async function bump({ item: name, level, message, changeset, force }) {
  const registry = await readJson(registryFile);
  const ledger = await readLedger();
  const item = registry.items.find((entry) => entry.name === name);

  if (!item) throw new Error(`Registry item not found: ${name}`);
  const entry = ledger[name];
  if (!entry) throw new Error(`${name} is not in versions.json. Run: pnpm registry:register`);

  const hash = await hashItem(item);
  if (hash === entry.hash && !force) {
    throw new Error(`${name} has not changed since ${entry.version}. Nothing to bump (use --force to bump anyway).`);
  }

  const next = increment(entry.version, level);
  entry.version = next;
  entry.hash = hash;
  entry.history.unshift({ version: next, date: today(), bump: level, message });
  item.meta = { ...item.meta, version: next };

  await writeJson(registryFile, registry);
  await writeJson(ledgerFile, ledger);

  if (changeset) {
    const file = path.join(changesetDir, `registry-${name}-${next.replaceAll(".", "-")}.md`);
    await writeFile(file, `---\n"@company/registry": ${level}\n---\n\n${name}: ${message}\n`);
    console.log(`Wrote ${path.relative(rootDir, file)}`);
  }

  console.log(`${name}: ${entry.history[1]?.version ?? "?"} -> ${next} (${level})`);
}

async function log(name) {
  const ledger = await readLedger();

  if (name) {
    const entry = ledger[name];
    if (!entry) throw new Error(`${name} is not in versions.json`);
    console.log(`${name} ${entry.version}`);
    for (const change of entry.history) {
      console.log(`  ${change.version}  ${change.date}  ${change.bump.padEnd(7)} ${change.message}`);
    }
    return;
  }

  for (const [itemName, entry] of Object.entries(ledger).sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`${itemName.padEnd(24)} ${entry.version.padEnd(8)} ${entry.history[0]?.message ?? ""}`);
  }
}

function parseBumpArgs(rest) {
  const positionals = [];
  const options = { changeset: true, force: false, message: undefined };

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === "-m" || arg === "--message") {
      options.message = rest[index + 1];
      index += 1;
    } else if (arg === "--no-changeset") {
      options.changeset = false;
    } else if (arg === "--force") {
      options.force = true;
    } else {
      positionals.push(arg);
    }
  }

  const [item, level] = positionals;
  if (!item || !bumpLevels.includes(level)) {
    throw new Error(`Usage: bump <item> <${bumpLevels.join("|")}> -m "message"`);
  }
  if (!options.message?.trim()) {
    throw new Error('A message is required: bump <item> <level> -m "what changed"');
  }

  return { item, level, message: options.message.trim(), changeset: options.changeset, force: options.force };
}

function increment(version, level) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error(`Not a plain semver version: ${version}`);

  const [major, minor, patch] = match.slice(1).map(Number);
  if (level === "major") return `${major + 1}.0.0`;
  if (level === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

// Same inputs, in the same order, as `hashItem` in tooling/company-ui/src/index.ts,
// so the ledger hash equals the hash company-ui stores in a product's company-ui.json.
async function hashItem(item) {
  const hash = createHash("sha256");
  hash.update(item.name);
  hash.update(item.type);
  hash.update(item.status ?? "draft");
  hash.update(JSON.stringify(item.dependencies ?? []));
  hash.update(JSON.stringify(item.registryDependencies ?? []));

  for (const file of item.files ?? []) {
    hash.update(file.path);
    hash.update(file.target ?? "");
    hash.update(await readFile(path.resolve(registryDir, file.path), "utf8"));
  }

  return hash.digest("hex");
}

async function readLedger() {
  return existsSync(ledgerFile) ? readJson(ledgerFile) : {};
}

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
  // Keep the repo's Prettier formatting so these files do not churn in diffs.
  spawnSync("pnpm", ["exec", "prettier", "--write", file], { cwd: rootDir, stdio: "ignore" });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
