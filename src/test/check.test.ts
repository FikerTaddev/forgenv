import { describe, it, expect } from "vitest";
import { runCheck } from "../cli/cmd/check.js";
import path from "node:path";
describe("runCheck", () => {
  it("validates correct env successfully", async () => {
    const flags = {
      env: "src/test/.env.test",
      schema: "src/test/test.schema.ts"
    };

    await expect(runCheck(flags)).resolves.not.toThrow();
  });

  it("throws if env flag is missing", async () => {
    await expect(
      runCheck({ schema: "/src/test/schema.ts" } as any)
    ).rejects.toThrow("Missing --env flag");
  });

  it("throws if schema flag is missing", async () => {
    await expect(
      runCheck({ env: "/src/test/.env" } as any)
    ).rejects.toThrow("Missing --schema flag");
  });
});