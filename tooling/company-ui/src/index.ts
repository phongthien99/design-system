#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { classifyFile, hashText, worstState, type FileState } from "./tracking";

type Registry = {
  include?: string[];
  items?: RegistryItem[];
  name?: string;
};

type RegistryItem = {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  status?: RegistryItemStatus;
  files?: RegistryFile[];
  /** shadcn `meta` is free-form. `meta.version` is this item's own version (see scripts/registry-version.mjs). */
  meta?: Record<string, unknown> & { version?: string };
};

type RegistryItemStatus = "draft" | "public" | "deprecated";

type RegistryFile = {
  path: string;
  type: string;
  target?: string;
};

type ResolvedRegistryItem = RegistryItem & {
  registryDir: string;
  registryFile: string;
};

type ComponentsJson = {
  aliases?: Record<string, string>;
  registry?: string;
  registries?: Record<string, string>;
};

type CompanyUiConfig = {
  registry?: string;
  components: Record<string, InstalledComponentConfig>;
};

const registryPackageName = "@company/registry";

type InstalledComponentConfig = {
  dependencies?: string[];
  files: string[];
  /** Baseline per file: sha256 of the registry source when it was added. Keyed by product-relative target. */
  fileHashes?: Record<string, string>;
  /** sha256 of the registry item (metadata + files) when it was added. */
  hash: string;
  registryDependencies?: string[];
  /** Version of `@company/registry` the component was added from. */
  registryVersion?: string;
  /** The item's own `meta.version` when it was added, e.g. "1.2.0". */
  version?: string;
  updatedAt: string;
};

type CliOptions = {
  cwd: string;
  force: boolean;
  registry?: string;
};

type ParsedArgs = {
  command?: string;
  itemName?: string;
  itemNames: string[];
  options: CliOptions;
};

const defaultAliases = {
  components: "@/components",
  hooks: "@/hooks",
  lib: "@/lib",
  ui: "@/components/ui"
};

async function main() {
  const parsed = parseArgs(process.argv.slice(2));

  try {
    switch (parsed.command) {
      case "list":
        await listCommand(parsed.options);
        return;
      case "add":
        if (parsed.itemNames.length === 0) {
          throw new Error("Missing component name. Example: company-ui add button");
        }
        await addCommand(parsed.itemNames, parsed.options);
        return;
      case "check":
        await checkCommand(parsed.options);
        return;
      case "diff":
        await diffCommand(parsed.itemNames, parsed.options);
        return;
      case "update":
        await updateCommand(parsed.itemNames, parsed.options);
        return;
      case "help":
      case undefined:
        printHelp();
        return;
      default:
        throw new Error(`Unknown command: ${parsed.command}`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

function parseArgs(args: string[]): ParsedArgs {
  const options: CliOptions = {
    cwd: process.cwd(),
    force: false
  };
  const positionals: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--cwd") {
      options.cwd = path.resolve(args[index + 1] ?? "");
      index += 1;
      continue;
    }

    if (arg === "--registry") {
      options.registry = path.resolve(args[index + 1] ?? "");
      index += 1;
      continue;
    }

    if (arg === "--force") {
      options.force = true;
      continue;
    }

    positionals.push(arg);
  }

  return {
    command: positionals[0],
    itemName: positionals[1],
    itemNames: positionals.slice(1),
    options
  };
}

async function listCommand(options: CliOptions) {
  const componentsJson = await readComponentsJson(options.cwd);
  const registry = await loadRegistry(options, { componentsJson });
  const items = [...registry.items.values()].sort((a, b) => a.name.localeCompare(b.name));

  console.log("Available registry items:");
  for (const item of items) {
    const deps = item.registryDependencies?.length
      ? ` registryDependencies=${item.registryDependencies.join(",")}`
      : "";
    const version = item.meta?.version ? `@${item.meta.version}` : "";
    console.log(`- ${item.name}${version} (${item.type}, ${item.status ?? "draft"})${deps}`);
  }
}

async function addCommand(itemNames: string[], options: CliOptions) {
  const componentsJson = await readComponentsJson(options.cwd);
  const registry = await loadRegistry(options, { componentsJson });
  const config = await readCompanyUiConfig(options.cwd);
  const installed = new Set<string>();
  const messages: string[] = [];

  for (const itemName of itemNames) {
    const result = await installItem({
      componentsJson,
      config,
      installed,
      itemName,
      options,
      registry,
      stack: []
    });
    messages.push(...result.messages);
  }

  config.registry = relativePath(options.cwd, registry.rootFile);
  await writeCompanyUiConfig(options.cwd, config);

  for (const line of messages) {
    console.log(line);
  }
}

async function checkCommand(options: CliOptions) {
  const config = await readCompanyUiConfig(options.cwd);
  const componentsJson = await readComponentsJson(options.cwd);
  const registry = await loadRegistry(options, { componentsJson, storedRegistry: config.registry });

  const names = Object.keys(config.components);
  if (names.length === 0) {
    console.log("No registry components installed.");
    return;
  }

  if (registry.version) {
    console.log(`Registry version: ${registry.version}`);
  }

  for (const name of names) {
    const item = registry.items.get(name);
    if (!item) {
      console.log(`${name}: missing from registry`);
      continue;
    }

    const analysis = await analyzeItem({ componentsJson, item, name, options, config });
    let status: string = analysis.status;

    // Files match but the item's metadata (dependencies) changed since it was added.
    if (status === "up to date" && analysis.installed?.hash !== (await hashItem(item))) {
      status = "dependencies changed";
    }

    const upgrade =
      status !== "up to date" && status !== "modified locally"
        ? upgradeHint(analysis.installed, item, registry.version)
        : "";

    console.log(`${name}: ${status}${upgrade}`);
    if (analysis.files.length > 1 || status !== "up to date") {
      for (const file of analysis.files.filter((entry) => entry.state !== "up to date")) {
        console.log(`  ${file.target}: ${file.state}`);
      }
    }
  }
}

// Prefer the item's own version ("button 1.2.0 -> 1.3.0"); fall back to the registry release version.
function upgradeHint(
  installed: InstalledComponentConfig | undefined,
  item: ResolvedRegistryItem,
  registryVersion: string | undefined
) {
  const itemVersion = item.meta?.version;
  if (installed?.version && itemVersion && installed.version !== itemVersion) {
    return ` (${installed.version} -> ${itemVersion})`;
  }

  if (registryVersion && installed?.registryVersion && installed.registryVersion !== registryVersion) {
    return ` (registry ${installed.registryVersion} -> ${registryVersion})`;
  }

  return "";
}

async function diffCommand(itemNames: string[], options: CliOptions) {
  const config = await readCompanyUiConfig(options.cwd);
  const componentsJson = await readComponentsJson(options.cwd);
  const registry = await loadRegistry(options, { componentsJson, storedRegistry: config.registry });
  const names = resolveRequestedInstalledNames(itemNames, config);

  for (const name of names) {
    const item = registry.items.get(name);
    if (!item) {
      console.log(`${name}: missing from registry`);
      continue;
    }

    const analysis = await analyzeItem({ componentsJson, item, name, options, config });
    console.log(`${name}: ${analysis.status}`);

    for (const file of analysis.files) {
      if (file.state === "up to date") continue;

      console.log(`--- ${file.target} (${file.state})`);
      if (file.localContent === undefined) {
        console.log("local file is missing");
        console.log(file.upstreamContent);
        continue;
      }

      if (file.state === "modified locally") {
        console.log("local changes; registry source is unchanged");
        console.log(simpleDiff(file.baselineContent ?? "", file.localContent));
        continue;
      }

      console.log(simpleDiff(file.localContent, file.upstreamContent));
    }
  }
}

async function updateCommand(itemNames: string[], options: CliOptions) {
  const config = await readCompanyUiConfig(options.cwd);
  const componentsJson = await readComponentsJson(options.cwd);
  const registry = await loadRegistry(options, { componentsJson, storedRegistry: config.registry });
  const names = resolveRequestedInstalledNames(itemNames, config);
  const installed = new Set<string>();
  const messages: string[] = [];

  for (const name of names) {
    const item = registry.items.get(name);
    if (!item) {
      messages.push(`${name}: missing from registry`);
      continue;
    }

    const analysis = await analyzeItem({ componentsJson, item, name, options, config });
    const unsafe = analysis.files.filter((file) => file.state === "conflict" || file.state === "modified locally");

    if (unsafe.length > 0 && !options.force) {
      messages.push(`${name}: skipped (${analysis.status}); run company-ui diff ${name}`);
      for (const file of unsafe) {
        messages.push(`  ${file.target}: ${file.state}`);
      }
      continue;
    }

    const result = await installItem({
      componentsJson,
      config,
      installed,
      itemName: name,
      options: { ...options, force: true },
      registry,
      stack: []
    });
    messages.push(...result.messages);
  }

  config.registry = relativePath(options.cwd, registry.rootFile);
  await writeCompanyUiConfig(options.cwd, config);

  for (const line of messages) {
    console.log(line);
  }
}

async function hashLocalFile(cwd: string, target: string) {
  const file = path.resolve(cwd, target);
  return existsSync(file) ? hashText(await readFile(file, "utf8")) : undefined;
}

async function readLocalFile(cwd: string, target: string) {
  const file = path.resolve(cwd, target);
  return existsSync(file) ? readFile(file, "utf8") : undefined;
}

async function analyzeItem(args: {
  componentsJson: ComponentsJson;
  config: CompanyUiConfig;
  item: ResolvedRegistryItem;
  name: string;
  options: CliOptions;
}) {
  const { componentsJson, config, item, name, options } = args;
  const installed = config.components[name];
  const files: Array<{
    baselineContent?: string;
    localContent?: string;
    state: FileState;
    target: string;
    upstreamContent: string;
  }> = [];

  for (const file of item.files ?? []) {
    const target = resolveTarget(file, componentsJson);
    const source = path.resolve(item.registryDir, file.path);
    const upstreamContent = await readFile(source, "utf8");
    const upstream = hashText(upstreamContent);
    const localContent = await readLocalFile(options.cwd, target);
    const local = localContent === undefined ? undefined : hashText(localContent);
    const baselineHash = installed?.fileHashes?.[target];
    const baselineContent = baselineHash === upstream ? upstreamContent : undefined;

    files.push({
      baselineContent,
      localContent,
      state: classifyFile(baselineHash, local, upstream),
      target,
      upstreamContent
    });
  }

  return {
    files,
    installed,
    status: worstState(files.map((file) => file.state))
  };
}

function resolveRequestedInstalledNames(itemNames: string[], config: CompanyUiConfig) {
  const names = itemNames.length > 0 ? itemNames : Object.keys(config.components);

  if (names.length === 0) {
    throw new Error("No registry components installed.");
  }

  return names;
}

function simpleDiff(before: string, after: string) {
  if (before === after) {
    return "no content changes";
  }

  const beforeLines = before.split(/\r?\n/);
  const afterLines = after.split(/\r?\n/);
  const max = Math.max(beforeLines.length, afterLines.length);
  const output: string[] = [];

  for (let index = 0; index < max; index += 1) {
    const oldLine = beforeLines[index];
    const newLine = afterLines[index];

    if (oldLine === newLine) {
      continue;
    }

    if (oldLine !== undefined) {
      output.push(`-${oldLine}`);
    }

    if (newLine !== undefined) {
      output.push(`+${newLine}`);
    }
  }

  return output.join("\n");
}

async function installItem(args: {
  componentsJson: ComponentsJson;
  config: CompanyUiConfig;
  installed: Set<string>;
  itemName: string;
  options: CliOptions;
  registry: Awaited<ReturnType<typeof loadRegistry>>;
  stack: string[];
}): Promise<{ messages: string[] }> {
  const { componentsJson, config, installed, itemName, options, registry, stack } = args;

  if (installed.has(itemName)) {
    return { messages: [] };
  }

  if (stack.includes(itemName)) {
    throw new Error(`Circular registry dependency: ${[...stack, itemName].join(" -> ")}`);
  }

  const item = registry.items.get(itemName);
  if (!item) {
    throw new Error(`Registry item not found: ${itemName}`);
  }

  const messages: string[] = [];
  for (const dependency of item.registryDependencies ?? []) {
    if (registry.items.has(dependency)) {
      const result = await installItem({
        componentsJson,
        config,
        installed,
        itemName: dependency,
        // --force applies only to the requested item, so it cannot clobber a customized dependency.
        options: { ...options, force: false },
        registry,
        stack: [...stack, itemName]
      });
      messages.push(...result.messages);
    } else {
      messages.push(`Skipped external registry dependency: ${dependency}`);
    }
  }

  const files = item.files ?? [];
  const previous = config.components[item.name]?.fileHashes ?? {};
  const fileHashes: Record<string, string> = {};
  const targets: string[] = [];
  let skippedAny = false;

  for (const file of files) {
    const source = path.resolve(item.registryDir, file.path);
    const target = resolveTarget(file, componentsJson);
    const destination = path.resolve(options.cwd, target);
    const content = await readFile(source, "utf8");
    const sourceHash = hashText(content);
    const existed = existsSync(destination);
    targets.push(target);

    if (existed && !options.force) {
      // Keep an earlier baseline so a skipped re-add cannot hide "update available".
      fileHashes[target] = previous[target] ?? sourceHash;
      skippedAny = true;
      const detail =
        (await hashLocalFile(options.cwd, target)) === sourceHash
          ? "identical to registry"
          : "differs from registry, run company-ui check";
      messages.push(`Skipped existing file: ${target} (${detail})`);
      continue;
    }

    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, content);
    fileHashes[target] = sourceHash;
    messages.push(`${existed ? "Overwrote" : "Wrote"} ${target}`);
  }

  await updatePackageJson(options.cwd, item.dependencies, "dependencies", messages);
  await updatePackageJson(options.cwd, item.devDependencies, "devDependencies", messages);

  config.components[item.name] = {
    dependencies: item.dependencies ?? [],
    files: targets,
    fileHashes,
    hash: await hashItem(item),
    registryDependencies: item.registryDependencies ?? [],
    // A skipped file still holds an older version, so keep the version its baseline came from.
    registryVersion: skippedAny
      ? (config.components[item.name]?.registryVersion ?? registry.version)
      : registry.version,
    version: skippedAny ? (config.components[item.name]?.version ?? item.meta?.version) : item.meta?.version,
    updatedAt: new Date().toISOString()
  };

  installed.add(itemName);
  return { messages };
}

async function loadRegistry(
  options: CliOptions,
  context: { componentsJson?: ComponentsJson; storedRegistry?: string } = {}
) {
  const rootFile =
    options.registry ??
    resolveStoredRegistry(options.cwd, context.storedRegistry) ??
    resolveConfiguredRegistry(options.cwd, context.componentsJson) ??
    findUp("registry.json", options.cwd);
  if (!rootFile) {
    throw new Error("Could not find registry.json. Pass --registry <path> or set registry in components.json.");
  }

  const rootRegistry = await readJson<Registry>(rootFile);
  const items = new Map<string, ResolvedRegistryItem>();

  await collectRegistryItems(rootFile, rootRegistry, items);

  return {
    items,
    rootFile,
    version: await readRegistryVersion(new Set([...items.values()].map((item) => item.registryDir)))
  };
}

// The registry's release version lives in the `@company/registry` package.json next to a registry file.
async function readRegistryVersion(registryDirs: Set<string>) {
  for (const dir of registryDirs) {
    const file = path.join(dir, "package.json");
    if (!existsSync(file)) continue;

    const packageJson = await readJson<{ name?: string; version?: string }>(file);
    if (packageJson.name === registryPackageName) {
      return packageJson.version;
    }
  }

  return undefined;
}

async function collectRegistryItems(
  registryFile: string,
  registry: Registry,
  items: Map<string, ResolvedRegistryItem>
) {
  const registryDir = path.dirname(registryFile);

  for (const item of registry.items ?? []) {
    if (items.has(item.name)) {
      throw new Error(`Duplicate registry item: ${item.name}`);
    }

    items.set(item.name, {
      ...item,
      registryDir,
      registryFile
    });
  }

  for (const include of registry.include ?? []) {
    const includeFile = path.resolve(registryDir, include);
    await collectRegistryItems(includeFile, await readJson<Registry>(includeFile), items);
  }
}

async function readComponentsJson(cwd: string): Promise<ComponentsJson> {
  const file = path.resolve(cwd, "components.json");
  if (!existsSync(file)) {
    return { aliases: defaultAliases };
  }

  const config = await readJson<ComponentsJson>(file);
  return {
    ...config,
    aliases: {
      ...defaultAliases,
      ...(config.aliases ?? {})
    }
  };
}

function resolveConfiguredRegistry(cwd: string, componentsJson: ComponentsJson | undefined) {
  const configured = componentsJson?.registry ?? componentsJson?.registries?.["@company"];

  if (!configured || configured.startsWith("http://") || configured.startsWith("https://")) {
    return undefined;
  }

  return path.resolve(cwd, configured);
}

function resolveTarget(file: RegistryFile, componentsJson: ComponentsJson) {
  const target = file.target ?? defaultTarget(file);
  const aliases = {
    ...defaultAliases,
    ...(componentsJson.aliases ?? {})
  };

  const placeholderMap: Record<string, string> = {
    "@components/": aliasToPath(aliases.components),
    "@hooks/": aliasToPath(aliases.hooks),
    "@lib/": aliasToPath(aliases.lib),
    "@ui/": aliasToPath(aliases.ui)
  };

  for (const [placeholder, basePath] of Object.entries(placeholderMap)) {
    if (target.startsWith(placeholder)) {
      return normalizeRelativePath(path.join(basePath, target.slice(placeholder.length)));
    }
  }

  if (target.startsWith("~/")) {
    return normalizeRelativePath(target.slice(2));
  }

  return normalizeRelativePath(target);
}

function defaultTarget(file: RegistryFile) {
  const basename = path.basename(file.path);

  if (file.type === "registry:lib") {
    return `@lib/${basename}`;
  }

  if (file.type === "registry:hook") {
    return `@hooks/${basename}`;
  }

  if (file.type === "registry:component") {
    return `@components/${basename}`;
  }

  return `@ui/${basename}`;
}

function aliasToPath(alias?: string) {
  const value = alias ?? "@/components";

  if (value.startsWith("@/") || value.startsWith("~/") || value.startsWith("#/")) {
    return value.slice(2);
  }

  if (value.startsWith("/")) {
    return value.slice(1);
  }

  return value;
}

async function readCompanyUiConfig(cwd: string): Promise<CompanyUiConfig> {
  const file = path.resolve(cwd, "company-ui.json");
  if (!existsSync(file)) {
    return { components: {} };
  }

  return readJson<CompanyUiConfig>(file);
}

async function writeCompanyUiConfig(cwd: string, config: CompanyUiConfig) {
  await writeFile(path.resolve(cwd, "company-ui.json"), `${JSON.stringify(config, null, 2)}\n`);
}

async function updatePackageJson(
  cwd: string,
  dependencies: string[] | undefined,
  field: "dependencies" | "devDependencies",
  messages: string[]
) {
  if (!dependencies?.length) {
    return;
  }

  const file = path.resolve(cwd, "package.json");
  if (!existsSync(file)) {
    messages.push(`No package.json found. Install ${dependencies.join(", ")} manually.`);
    return;
  }

  const packageJson = await readJson<Record<string, unknown>>(file);
  const current = (packageJson[field] ?? {}) as Record<string, string>;
  let changed = false;

  for (const dependency of dependencies) {
    const { name, version } = parseDependency(dependency);
    if (!current[name]) {
      current[name] = version;
      changed = true;
      messages.push(`Added ${dependency} to package.json ${field}.`);
    }
  }

  if (changed) {
    packageJson[field] = current;
    await writeFile(file, `${JSON.stringify(packageJson, null, 2)}\n`);
  }
}

function parseDependency(dependency: string) {
  const atIndex = dependency.startsWith("@") ? dependency.indexOf("@", 1) : dependency.indexOf("@");

  if (atIndex > 0) {
    return {
      name: dependency.slice(0, atIndex),
      version: dependency.slice(atIndex + 1)
    };
  }

  return {
    name: dependency,
    version: "latest"
  };
}

async function hashItem(item: ResolvedRegistryItem) {
  const hash = createHash("sha256");
  hash.update(item.name);
  hash.update(item.type);
  hash.update(item.status ?? "draft");
  hash.update(JSON.stringify(item.dependencies ?? []));
  hash.update(JSON.stringify(item.registryDependencies ?? []));

  for (const file of item.files ?? []) {
    hash.update(file.path);
    hash.update(file.target ?? "");
    hash.update(await readFile(path.resolve(item.registryDir, file.path), "utf8"));
  }

  return hash.digest("hex");
}

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(file, "utf8")) as T;
}

function findUp(filename: string, startDir: string) {
  let current = path.resolve(startDir);

  while (true) {
    const candidate = path.join(current, filename);
    if (existsSync(candidate)) {
      return candidate;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return undefined;
    }

    current = parent;
  }
}

function resolveStoredRegistry(cwd: string, registry: string | undefined) {
  if (!registry) {
    return undefined;
  }

  return path.resolve(cwd, registry);
}

function relativePath(from: string, to: string) {
  return normalizeRelativePath(path.relative(from, to));
}

function normalizeRelativePath(value: string) {
  return value.split(path.sep).join("/");
}

function printHelp() {
  console.log(`company-ui

Usage:
  company-ui list [--registry ./registry.json]
  company-ui add <name...> [--cwd ./product] [--registry ./registry.json] [--force]
  company-ui check [--cwd ./product] [--registry ./registry.json]
  company-ui diff [name...] [--cwd ./product] [--registry ./registry.json]
  company-ui update [name...] [--cwd ./product] [--registry ./registry.json] [--force]
`);
}

void main();
