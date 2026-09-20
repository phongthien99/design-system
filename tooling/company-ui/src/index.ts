#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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
  files?: RegistryFile[];
};

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
};

type CompanyUiConfig = {
  registry?: string;
  components: Record<
    string,
    {
      dependencies?: string[];
      files: string[];
      hash: string;
      registryDependencies?: string[];
      updatedAt: string;
    }
  >;
};

type CliOptions = {
  cwd: string;
  force: boolean;
  registry?: string;
};

type ParsedArgs = {
  command?: string;
  itemName?: string;
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
        if (!parsed.itemName) {
          throw new Error("Missing component name. Example: company-ui add button");
        }
        await addCommand(parsed.itemName, parsed.options);
        return;
      case "check":
        await checkCommand(parsed.options);
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
    options
  };
}

async function listCommand(options: CliOptions) {
  const registry = await loadRegistry(options);
  const items = [...registry.items.values()].sort((a, b) => a.name.localeCompare(b.name));

  console.log("Available registry items:");
  for (const item of items) {
    const deps = item.registryDependencies?.length
      ? ` registryDependencies=${item.registryDependencies.join(",")}`
      : "";
    console.log(`- ${item.name} (${item.type})${deps}`);
  }
}

async function addCommand(itemName: string, options: CliOptions) {
  const registry = await loadRegistry(options);
  const componentsJson = await readComponentsJson(options.cwd);
  const config = await readCompanyUiConfig(options.cwd);
  const installed = new Set<string>();

  const result = await installItem({
    componentsJson,
    config,
    installed,
    itemName,
    options,
    registry,
    stack: []
  });

  config.registry = relativePath(options.cwd, registry.rootFile);
  await writeCompanyUiConfig(options.cwd, config);

  for (const line of result.messages) {
    console.log(line);
  }
}

async function checkCommand(options: CliOptions) {
  const config = await readCompanyUiConfig(options.cwd);
  const registry = await loadRegistry({
    ...options,
    registry: options.registry ?? resolveStoredRegistry(options.cwd, config.registry)
  });

  const names = Object.keys(config.components);
  if (names.length === 0) {
    console.log("No registry components installed.");
    return;
  }

  for (const name of names) {
    const item = registry.items.get(name);
    if (!item) {
      console.log(`${name}: missing from registry`);
      continue;
    }

    const currentHash = await hashItem(item);
    const installedHash = config.components[name]?.hash;
    const status = currentHash === installedHash ? "up to date" : "update available";
    console.log(`${name}: ${status}`);
  }
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
        options,
        registry,
        stack: [...stack, itemName]
      });
      messages.push(...result.messages);
    } else {
      messages.push(`Skipped external registry dependency: ${dependency}`);
    }
  }

  const files = item.files ?? [];
  const writtenFiles: string[] = [];

  for (const file of files) {
    const source = path.resolve(item.registryDir, file.path);
    const target = resolveTarget(file, componentsJson);
    const destination = path.resolve(options.cwd, target);

    if (existsSync(destination) && !options.force) {
      messages.push(`Skipped existing file: ${target}`);
      continue;
    }

    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, await readFile(source, "utf8"));
    writtenFiles.push(target);
    messages.push(`${existsSync(destination) ? "Wrote" : "Created"} ${target}`);
  }

  await updatePackageJson(options.cwd, item.dependencies, "dependencies", messages);
  await updatePackageJson(options.cwd, item.devDependencies, "devDependencies", messages);

  config.components[item.name] = {
    dependencies: item.dependencies ?? [],
    files: writtenFiles.length > 0 ? writtenFiles : files.map((file) => resolveTarget(file, componentsJson)),
    hash: await hashItem(item),
    registryDependencies: item.registryDependencies ?? [],
    updatedAt: new Date().toISOString()
  };

  installed.add(itemName);
  return { messages };
}

async function loadRegistry(options: CliOptions) {
  const rootFile = options.registry ?? findUp("registry.json", options.cwd);
  if (!rootFile) {
    throw new Error("Could not find registry.json. Pass --registry <path>.");
  }

  const rootRegistry = await readJson<Registry>(rootFile);
  const items = new Map<string, ResolvedRegistryItem>();

  await collectRegistryItems(rootFile, rootRegistry, items);

  return {
    items,
    rootFile
  };
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
  await writeFile(
    path.resolve(cwd, "company-ui.json"),
    `${JSON.stringify(config, null, 2)}\n`
  );
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
  const atIndex = dependency.startsWith("@")
    ? dependency.indexOf("@", 1)
    : dependency.indexOf("@");

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
  company-ui add <name> [--cwd ./product] [--registry ./registry.json] [--force]
  company-ui check [--cwd ./product] [--registry ./registry.json]
`);
}

void main();

