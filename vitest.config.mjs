import { defineConfig } from "vitest/config";
import {coverageDirectory,assertSafeCoverageOverrides} from './scripts/evidence-directory.mjs';
assertSafeCoverageOverrides(process.argv.slice(2));

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.mjs"],
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: [
        "src/services/economy-ledger.js",
        "src/services/response-moderation.js"
      ],
      // Direct Vitest calls are safe too; the npm runner also captures logs.
      clean: false,
      cleanOnRerun: false,
      reportsDirectory: coverageDirectory()
    }
  }
});
