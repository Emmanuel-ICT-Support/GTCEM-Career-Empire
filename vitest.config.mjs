import { defineConfig } from "vitest/config";

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
      reportsDirectory: "coverage"
    }
  }
});
