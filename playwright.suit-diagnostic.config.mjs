// Diagnostic-only server readiness/logging. Located beside the base config so
// relative testDir, webServer command/cwd and output paths retain their meaning.
import config from './playwright.config.mjs';
export default {
  ...config,
  webServer: {
    ...config.webServer,
    command: `python3 -c 'import faulthandler, runpy, sys; faulthandler.enable(); faulthandler.dump_traceback_later(15, repeat=True); sys.argv = ["scripts/serve-test-site.py", "4273"]; runpy.run_path("scripts/serve-test-site.py", run_name="__main__")'`,
    timeout: 60_000,
    stdout: 'pipe',
    stderr: 'pipe'
  }
};
