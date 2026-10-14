import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function rel(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function walk(dir, predicate, output = []) {
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules", "out"].includes(entry.name)) continue;
      walk(fullPath, predicate, output);
    } else if (!predicate || predicate(fullPath)) {
      output.push(fullPath);
    }
  }
  return output;
}

function fail(message) {
  failures.push(message);
}

function checkJavaScriptSyntax() {
  const dirs = ["auth", "dashboards", "modules", "shop", "src"];
  const files = dirs.flatMap(dir => walk(path.join(root, dir), file => file.endsWith(".js")));
  for (const file of files) {
    try {
      new Function(fs.readFileSync(file, "utf8"));
    } catch (error) {
      fail(`JS syntax error in ${rel(file)}: ${error.message}`);
    }
  }
  console.log(`Checked ${files.length} JavaScript files`);
}

function checkJsonSyntax() {
  const files = walk(path.join(root, "data"), file => file.endsWith(".json"));
  for (const file of files) {
    try {
      JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
      fail(`JSON parse error in ${rel(file)}: ${error.message}`);
    }
  }
  console.log(`Checked ${files.length} JSON files`);
}

function resolveLocalReference(fromFile, reference) {
  const cleanReference = reference.split("#")[0].split("?")[0];
  if (!cleanReference || cleanReference.startsWith("http") || cleanReference.startsWith("data:")) {
    return null;
  }
  return path.resolve(path.dirname(fromFile), decodeURIComponent(cleanReference));
}

function checkEstEntryReferences() {
  const entry = path.join(root, "modules/est-prep/index.html");
  const html = fs.readFileSync(entry, "utf8");
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);
  for (const ref of refs) {
    const resolved = resolveLocalReference(entry, ref);
    if (resolved && !fs.existsSync(resolved)) {
      fail(`Missing EST entry reference from ${rel(entry)}: ${ref}`);
    }
  }
  console.log(`Checked ${refs.length} EST entry references`);
}

function checkEstScriptBundleSyntax() {
  const entry = path.join(root, "modules/est-prep/index.html");
  const html = fs.readFileSync(entry, "utf8");
  const scriptRefs = [...html.matchAll(/<script\s+src="([^"]+est-prep[^"]*\.js)"><\/script>/g)]
    .map(match => match[1]);
  const combined = scriptRefs
    .map(ref => {
      const resolved = resolveLocalReference(entry, ref);
      return `\n/* ${ref} */\n${fs.readFileSync(resolved, "utf8")}`;
    })
    .join("\n");

  try {
    new Function(combined);
  } catch (error) {
    fail(`Combined EST script syntax error: ${error.message}`);
  }
  console.log(`Checked combined EST script bundle (${scriptRefs.length} files)`);
}

function checkCssImports() {
  const files = walk(path.join(root, "modules/est-prep"), file => file.endsWith(".css"));
  let checked = 0;

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/@import\s+url\(["']?([^"')]+)["']?\)/g)) {
      checked += 1;
      const resolved = resolveLocalReference(file, match[1]);
      if (resolved && !fs.existsSync(resolved)) {
        fail(`Missing CSS import from ${rel(file)}: ${match[1]}`);
      }
    }
  }
  console.log(`Checked ${checked} CSS imports`);
}

function checkEstAssetReferences() {
  const candidates = [
    path.join(root, "modules/est-prep"),
    path.join(root, "data/modules/est-prep-rounds")
  ];
  const files = candidates.flatMap(dir => walk(dir, file => /\.(js|css|json|html)$/.test(file)));
  const assetPattern = /["'`](\.\.\/\.\.\/Assets\/[^"'`]+?\.(?:png|svg|jpe?g|gif|mp4|webm|pdf|docx)(?:[#?][^"'`]*)?)["'`]/gi;
  let checked = 0;

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const referenceBase = rel(file).startsWith("data/modules/est-prep-rounds/")
      ? path.join(root, "modules/est-prep/index.html")
      : file;
    for (const match of text.matchAll(assetPattern)) {
      checked += 1;
      const resolved = resolveLocalReference(referenceBase, match[1]);
      if (resolved && !fs.existsSync(resolved)) {
        fail(`Missing EST asset reference from ${rel(file)}: ${match[1]}`);
      }
    }
  }
  console.log(`Checked ${checked} EST asset references`);
}

checkJavaScriptSyntax();
checkJsonSyntax();
checkEstEntryReferences();
checkEstScriptBundleSyntax();
checkCssImports();
checkEstAssetReferences();

if (failures.length) {
  console.error("\nDev check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Dev check passed");
