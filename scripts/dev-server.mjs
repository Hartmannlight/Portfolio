import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, isAbsolute, join, relative, resolve } from "node:path";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".mdx": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".pdf": "application/pdf"
};

function isFile(filePath) {
  try {
    return existsSync(filePath) && statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function isInsideRoot(filePath) {
  const rel = relative(root, filePath);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

function resolvePath(urlPath) {
  let cleanUrl;
  try {
    cleanUrl = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return { status: 400 };
  }

  const requested = resolve(root, `.${cleanUrl}`);

  if (!isInsideRoot(requested)) {
    return { status: 404 };
  }

  if (isFile(requested)) {
    return { filePath: requested };
  }

  if (extname(requested)) {
    return { status: 404 };
  }

  const indexFile = join(requested, "index.html");
  if (isInsideRoot(indexFile) && isFile(indexFile)) {
    return { filePath: indexFile };
  }

  return { filePath: join(root, "index.html") };
}

function headersFor(filePath, type) {
  const headers = {
    "Content-Type": type,
    "X-Content-Type-Options": "nosniff"
  };

  const publicRoot = join(root, "public");
  if (relative(publicRoot, filePath).startsWith("..")) {
    return headers;
  }

  headers["Cache-Control"] = "public, max-age=31536000, immutable";
  return headers;
}

createServer((req, res) => {
  const resolved = resolvePath(req.url || "/");

  if (!resolved.filePath) {
    const status = resolved.status || 404;
    res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(status === 400 ? "Bad request" : "Not found");
    return;
  }

  const { filePath } = resolved;
  const type = mimeTypes[extname(filePath)] || "application/octet-stream";
  const stream = createReadStream(filePath);

  stream.on("error", () => {
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Internal server error");
      return;
    }

    res.destroy();
  });

  res.writeHead(200, headersFor(filePath, type));
  stream.pipe(res);
}).listen(port, host, () => {
  console.log(`Portfolio running at http://${host}:${port}`);
});
