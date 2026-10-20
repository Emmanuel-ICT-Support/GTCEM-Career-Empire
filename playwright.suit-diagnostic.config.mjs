// Diagnostic-only server readiness/logging. Located beside the base config so
// relative testDir, webServer command/cwd and output paths retain their meaning.
import config from './playwright.config.mjs';
export default {
  ...config,
  webServer: {
    ...config.webServer,
    timeout: 60_000,
    stdout: 'pipe',
    stderr: 'pipe'
  }
};
