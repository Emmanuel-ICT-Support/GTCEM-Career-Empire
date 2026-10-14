import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export function createLocalStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    }
  };
}

export function loadBrowserScript(relativePath, extraContext = {}) {
  const filename = path.join(process.cwd(), relativePath);
  const windowObj = {
    localStorage: createLocalStorage(),
    ...extraContext.window
  };
  const context = {
    window: windowObj,
    console,
    Date,
    Math,
    JSON,
    Number,
    String,
    Set,
    RegExp,
    URLSearchParams,
    ...extraContext
  };
  context.window = windowObj;

  const source = fs.readFileSync(filename, "utf8");
  const script = new vm.Script(source, { filename });
  script.runInNewContext(context);
  return windowObj;
}
