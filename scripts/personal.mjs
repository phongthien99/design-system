#!/usr/bin/env node
// Personal registry: a local sandbox copy of registry/company/ui (+ its Storybook stories).
//
//   node scripts/personal.mjs sync [--force]   copy company -> personal (never overwrites unless --force)
//   node scripts/personal.mjs diff [--patch]   compare company/ui with personal/ui

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const companyUi = path.join(rootDir, "registry/company/ui");
const companyStories = path.join(rootDir, "registry/stories");
const personalDir = path.join(rootDir, "registry/personal");
const personalUi = path.join(personalDir, "ui");
const personalStories = path.join(personalDir, "stories");

// Release metadata belongs to the company registry only; the sandbox is not a versioned package.
const releaseFiles = new Set(["package.json", "CHANGELOG.md", "versions.json"]);

const storyRewrites = [
  // Relative imports: registry/stories -> registry/personal/stories, so `../company/ui` becomes `../ui`.
  [/\/company\/ui/g, "/ui"],
  [/Registry\/Company UI\//g, "Registry/Personal UI/"],
  [/title: "Registry\/All Components"/g, 'title: "Registry/Personal UI/All Components"'],
  [/company-ui add \$\{item\.name\}/g, "company-ui add ${item.name} --registry registry.personal.json"],
  [/Company UI registry item\./g, "Personal UI registry item."]
];

const personalTsconfig = `${JSON.stringify(
  {
    extends: "../../tsconfig.base.json",
    compilerOptions: {
      baseUrl: ".",
      paths: {
        "@/components/ui/*": ["ui/*"],
        "@/lib/utils": ["ui/utils/utils.ts"]
      }
    },
    include: ["ui/**/*.ts", "ui/**/*.tsx", "stories/**/*.ts", "stories/**/*.tsx"]
  },
  null,
  2
)}\n`;

const [command, ...args] = process.argv.slice(2);
const flags = new Set(args);

if (command === "sync") {
  await sync({ force: flags.has("--force") });
} else if (command === "diff") {
  await diff({ patch: flags.has("--patch") });
} else {
  console.log("Usage:\n  personal.mjs sync [--force]\n  personal.mjs diff [--patch]");
  process.exit(command ? 1 : 0);
}

async function sync({ force }) {
  const report = { created: [], overwritten: [], skipped: [] };

  await copyTree(companyUi, personalUi, { force, report });
  await copyTree(companyStories, personalStories, { force, report, transform: rewriteStory });

  const tsconfig = path.join(personalDir, "tsconfig.json");
  await writeIfAllowed(tsconfig, personalTsconfig, { force, report });

  for (const [label, files] of Object.entries(report)) {
    console.log(`${label}: ${files.length}`);
    if (label !== "skipped") {
      for (const file of files) console.log(`  ${path.relative(rootDir, file)}`);
    }
  }
  if (report.skipped.length > 0) {
    console.log("Existing personal files were kept. Use --force to overwrite them from company.");
  }
}

async function copyTree(source, target, { force, report, transform = (text) => text }) {
  for (const file of await listFiles(source)) {
    const relative = path.relative(source, file);
    const content = transform(await readFile(file, "utf8"), relative);
    await writeIfAllowed(path.join(target, relative), content, { force, report });
  }
}

async function writeIfAllowed(file, content, { force, report }) {
  const exists = existsSync(file);
  if (exists && !force) {
    report.skipped.push(file);
    return;
  }

  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
  (exists ? report.overwritten : report.created).push(file);
}

function rewriteStory(text) {
  return storyRewrites.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
}

async function diff({ patch }) {
  if (!existsSync(personalUi)) {
    console.error("registry/personal/ui does not exist. Run `pnpm personal:sync` first.");
    process.exit(1);
  }

  const [companyFiles, personalFiles] = await Promise.all([listRelative(companyUi), listRelative(personalUi)]);
  const personalSet = new Set(personalFiles);
  const companySet = new Set(companyFiles);

  const removed = companyFiles.filter((file) => !personalSet.has(file));
  const added = personalFiles.filter((file) => !companySet.has(file));
  const modified = [];

  for (const file of companyFiles.filter((name) => personalSet.has(name))) {
    const [a, b] = await Promise.all([
      readFile(path.join(companyUi, file), "utf8"),
      readFile(path.join(personalUi, file), "utf8")
    ]);
    if (a !== b) modified.push(file);
  }

  printGroup("modified in personal", modified);
  printGroup("only in personal", added);
  printGroup("missing from personal (in company)", removed);

  if (modified.length + added.length + removed.length === 0) {
    console.log("personal/ui is identical to company/ui");
    return;
  }

  if (patch) {
    spawnSync("diff", ["-ru", companyUi, personalUi], { stdio: "inherit" });
  }
}

function printGroup(label, files) {
  if (files.length === 0) return;
  console.log(`${label}: ${files.length}`);
  for (const file of files) console.log(`  ${file}`);
}

async function listRelative(dir) {
  return (await listFiles(dir)).map((file) => path.relative(dir, file)).sort();
}

async function listFiles(dir, { root = dir } = {}) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return listFiles(full, { root });
      return dir === root && releaseFiles.has(entry.name) ? [] : [full];
    })
  );
  return files.flat();
}
