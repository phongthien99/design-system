import { describe, expect, it } from "vitest";
import { classifyFile, hashText, worstState } from "./tracking";

describe("classifyFile (baseline, local, upstream)", () => {
  it("is up to date when local matches upstream, whatever the baseline", () => {
    expect(classifyFile("a", "b", "b")).toBe("up to date");
    expect(classifyFile(undefined, "b", "b")).toBe("up to date");
  });

  it("offers a safe update when only upstream changed", () => {
    expect(classifyFile("a", "a", "b")).toBe("update available");
  });

  it("keeps a local customization when only the product changed", () => {
    expect(classifyFile("a", "c", "a")).toBe("modified locally");
  });

  it("reports a conflict when both sides changed differently", () => {
    expect(classifyFile("a", "c", "b")).toBe("conflict");
  });

  it("does not claim up to date for a stale file with no baseline", () => {
    expect(classifyFile(undefined, "old", "new")).toBe("differs from registry");
  });

  it("reports a missing local file", () => {
    expect(classifyFile("a", undefined, "a")).toBe("missing locally");
  });
});

describe("worstState", () => {
  it("returns the highest-priority state", () => {
    expect(worstState(["up to date", "modified locally", "conflict"])).toBe("conflict");
    expect(worstState(["up to date", "update available"])).toBe("update available");
  });

  it("defaults to up to date", () => {
    expect(worstState([])).toBe("up to date");
  });
});

describe("hashText", () => {
  it("is stable and content-sensitive", () => {
    expect(hashText("x")).toBe(hashText("x"));
    expect(hashText("x")).not.toBe(hashText("y"));
  });
});
