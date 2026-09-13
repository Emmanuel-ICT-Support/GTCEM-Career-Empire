import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  // Software WebGL tests must not compete for the hosted runner CPU.
  workers: process.env.CI ? 1 : undefined,
  outputDir: "coverage/browser-evidence",
  expect: {
    timeout: 5_000
  },
  use: {
    baseURL: "http://127.0.0.1:4273",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  webServer: {
    command: "python3 -m http.server 4273",
    url: "http://127.0.0.1:4273",
    reuseExistingServer: !process.env.CI,
    timeout: 10_000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
