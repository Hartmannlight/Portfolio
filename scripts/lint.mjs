import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", ".idea", "node_modules"]);
const jsExtensions = new Set([".js", ".mjs"]);
const jsonExtensions = new Set([".json"]);

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...(await collectFiles(join(dir, entry.name))));
      }
      continue;
    }

    if (entry.isFile()) {
      files.push(join(dir, entry.name));
    }
  }

  return files;
}

function printFailure(filePath, message) {
  console.error(`${relative(root, filePath)}: ${message}`);
}

let failed = false;
const files = await collectFiles(root);

for (const filePath of files.filter((file) => jsExtensions.has(extname(file)))) {
  const result = spawnSync(process.execPath, ["--check", filePath], {
    encoding: "utf8"
  });

  if (result.status !== 0) {
    failed = true;
    printFailure(filePath, result.error?.message || result.stderr?.trim() || "JavaScript syntax check failed");
  }
}

for (const filePath of files.filter((file) => jsonExtensions.has(extname(file)))) {
  try {
    JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    failed = true;
    printFailure(filePath, error.message);
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log("Lint checks passed.");
}
