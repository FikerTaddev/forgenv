import { describe, it, expect, vi } from "vitest";
import fs from "fs";

// mock fs
vi.mock("fs");

import { RunInit } from "../cli/cmd/init.js";

describe("RunInit", () => {
  it("runs without crashing", () => {
  vi.spyOn(fs, "existsSync").mockReturnValue(false);
  vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

  expect(() => RunInit()).not.toThrow();
});
});