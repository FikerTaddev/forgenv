import { describe, it, expect } from "vitest";
import { runCheck } from "../cli/cmd/check.js";

describe("runCheck", () => {
  it("validates correct env successfully with explicit schema", async () => {
    const flags = {
      env: "src/test/.env.test",
      schema: "src/test/test.schema.ts",
    };

    await expect(runCheck(flags)).resolves.not.toThrow();
  });

  it("auto-infers schema when schema flag is missing", async () => {
    const flags = {
      env: "src/test/.env.test",
    };

    const res = await runCheck(flags);
    expect(res).toBeDefined();
    expect(res.PORT).toBe(3000);
  });

  it("throws error if env file does not exist", async () => {
    await expect(
      runCheck({ env: "non-existent-env-file.env" })
    ).rejects.toThrow("Environment file 'non-existent-env-file.env' does not exist.");
  });
});