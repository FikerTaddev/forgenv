import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { runGenerate } from "../cli/cmd/generate.js";

describe("forgenv generate CLI Command Test Suite", () => {
  const testEnvPath = path.resolve(process.cwd(), ".env.generate.test");
  const testOutPath = path.resolve(process.cwd(), "env.generate.test.d.ts");

  beforeEach(() => {
    fs.writeFileSync(
      testEnvPath,
      "PORT=3000\nIS_DEBUG=true\nSITE_URL=https://forgenv.dev\nADMIN_EMAIL=admin@forgenv.dev",
      "utf-8"
    );
  });

  afterEach(() => {
    if (fs.existsSync(testEnvPath)) fs.unlinkSync(testEnvPath);
    if (fs.existsSync(testOutPath)) fs.unlinkSync(testOutPath);
  });

  it("should generate TypeScript ambient type definitions file from .env file", () => {
    runGenerate({ env: ".env.generate.test", out: "env.generate.test.d.ts" });

    expect(fs.existsSync(testOutPath)).toBe(true);
    const content = fs.readFileSync(testOutPath, "utf-8");
    expect(content).toContain("PORT?: string;");
    expect(content).toContain("IS_DEBUG?: string;");
    expect(content).toContain("SITE_URL?: string;");
    expect(content).toContain("ADMIN_EMAIL?: string;");
  });
});
