import { readFileSync, writeFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const ignoredDirs = new Set([".git", ".idea", "node_modules"]);
const formattedNames = new Set([".dockerignore", ".gitattributes", ".gitignore", "Caddyfile", "Dockerfile"]);
const formattedExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mdx",
  ".mjs",
  ".yml",
  ".yaml"
]);

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

function shouldFormat(filePath) {
  const name = filePath.split(/[\\/]/).at(-1);
  return formattedNames.has(name) || formattedExtensions.has(extname(filePath));
}

function normalizeContent(content) {
  const newline = content.includes("\r\n") ? "\r\n" : "\n";
  const withoutTrailingWhitespace = content
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+$/u, ""))
    .join(newline);

  return `${withoutTrailingWhitespace.replace(/(?:\r?\n)*$/u, "")}${newline}`;
}

const changed = [];
const files = (await collectFiles(root)).filter(shouldFormat);

for (const filePath of files) {
  const original = readFileSync(filePath, "utf8");
  const formatted = normalizeContent(original);

  if (original !== formatted) {
    changed.push(relative(root, filePath));
    if (!checkOnly) {
      writeFileSync(filePath, formatted);
    }
  }
}

if (changed.length === 0) {
  console.log(checkOnly ? "Formatting check passed." : "Formatting applied.");
} else if (checkOnly) {
  console.error(`Formatting issues found:\n${changed.map((file) => `- ${file}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Formatted ${changed.length} file(s).`);
}
