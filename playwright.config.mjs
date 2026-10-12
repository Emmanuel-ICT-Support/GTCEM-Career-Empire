import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  // Software WebGL tests must not compete for the hosted runner CPU.
  workers: process.env.CI ? 1 : undefined,
  // Collect every failure so later game journeys are exercised in CI too.
  maxFailures: 0,
  outputDir: "coverage/browser-evidence",
  expect: {
    timeout: 5_000
  },
  use: {
    baseURL: "http://127.0.0.1:4273",
    trace: "off",
    screenshot: "only-on-failure"
  },
  webServer: {
    command: "python3 scripts/serve-test-site.py 4273",
    url: "http://127.0.0.1:4273",
    reuseExistingServer: !process.env.CI,
    timeout: 10_000
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Keep real game graphics on the Mac's native renderer, including older tests.
        launchOptions: {args:process.platform==='darwin'?['--use-angle=metal']:[]}
      }
    }
  ]
});
