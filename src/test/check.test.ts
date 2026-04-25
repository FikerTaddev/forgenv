import { describe, it, expect } from "vitest";
import { runCheck } from "../cli/cmd/check.js";

describe("runCheck", () => {
  it("validates correct env successfully", async () => {
    const flags = {
      env: "test/.env.test",
      schema: "test/test_helpers/test.schema.ts"
    };

    await expect(runCheck(flags)).resolves.not.toThrow();
  });

  it("throws if env flag is missing", async () => {
    await expect(
      runCheck({ schema: "test/schema.js" } as any)
    ).rejects.toThrow("Missing --env flag");
  });

  it("throws if schema flag is missing", async () => {
    await expect(
      runCheck({ env: "test/.env" } as any)
    ).rejects.toThrow("Missing --schema flag");
  });
});