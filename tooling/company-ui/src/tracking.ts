import { createHash } from "node:crypto";

export type FileState =
  "up to date" | "update available" | "modified locally" | "conflict" | "differs from registry" | "missing locally";

// Worst state first; a component reports the first state any of its files is in.
export const fileStatePriority: FileState[] = [
  "conflict",
  "update available",
  "missing locally",
  "differs from registry",
  "modified locally",
  "up to date"
];

/**
 * Three-way comparison of one file:
 *   baseline = registry source when it was added (undefined if never recorded)
 *   local    = file currently in the product (undefined if missing)
 *   upstream = registry source now
 */
export function classifyFile(baseline: string | undefined, local: string | undefined, upstream: string): FileState {
  if (local === undefined) return "missing locally";
  if (local === upstream) return "up to date";
  if (baseline === undefined) return "differs from registry";
  if (local === baseline) return "update available";
  if (upstream === baseline) return "modified locally";
  return "conflict";
}

export function worstState(states: FileState[]): FileState {
  return fileStatePriority.find((candidate) => states.includes(candidate)) ?? "up to date";
}

export function hashText(content: string) {
  return createHash("sha256").update(content).digest("hex");
}
