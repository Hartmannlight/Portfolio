import { existsSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { projects } from "../src/data/projects.js";

const maxImageBytes = 300 * 1024;

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    stdio: "inherit"
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function assertProjectData() {
  const slugs = new Set();
  const failures = [];

  for (const project of projects) {
    if (slugs.has(project.slug)) {
      failures.push(`Duplicate project slug: ${project.slug}`);
    }
    slugs.add(project.slug);

    const contentPath = join("src", "content", "projects", `${project.slug}.mdx`);
    if (!existsSync(contentPath)) {
      failures.push(`Missing project content: ${contentPath}`);
    }

    const imagePath = project.image.replace(/^\//u, "");
    if (!existsSync(imagePath)) {
      failures.push(`Missing project image: ${imagePath}`);
      continue;
    }

    const size = statSync(imagePath).size;
    if (size > maxImageBytes) {
      failures.push(`Project image is too large (${Math.round(size / 1024)} KiB): ${imagePath}`);
    }
  }

  if (failures.length > 0) {
    console.error(`Project checks failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
    process.exit(1);
  }

  console.log("Project content checks passed.");
}

runNode(["scripts/lint.mjs"]);
runNode(["scripts/format.mjs", "--check"]);
runNode(["--test"]);
assertProjectData();
