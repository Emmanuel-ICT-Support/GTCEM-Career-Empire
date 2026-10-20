import { defineConfig, devices } from "@playwright/test";
import {createEvidenceDirectory} from './scripts/evidence-directory.mjs';

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  // Software WebGL tests must not compete for the hosted runner CPU.
  workers: process.env.CI ? 1 : undefined,
  // Collect every failure so later game journeys are exercised in CI too.
  maxFailures: 0,
  outputDir: createEvidenceDirectory('browser')+'/browser',
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
        channel: process.env.CE_BROWSER_CHANNEL,
        // Keep real game graphics on the Mac's native renderer, including older tests.
        launchOptions: {executablePath:process.env.CE_CHROMIUM_EXECUTABLE,args:process.platform==='darwin'?['--use-angle=metal']:process.env.CE_GPU_COMPOSITING==='1'?['--enable-gpu','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']:[]}
      }
    }
  ]
});
