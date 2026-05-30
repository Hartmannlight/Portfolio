import { once } from "node:events";
import { request } from "node:http";
import { spawn } from "node:child_process";
import test from "node:test";
import assert from "node:assert/strict";

function httpGet(port, path) {
  return new Promise((resolve, reject) => {
    const req = request({ host: "127.0.0.1", port, path }, (res) => {
      res.resume();
      res.on("end", () => resolve(res));
    });

    req.on("error", reject);
    req.end();
  });
}

async function startServer(t) {
  const port = 45000 + Math.floor(Math.random() * 1000);
  const server = spawn(process.execPath, ["scripts/dev-server.mjs"], {
    env: { ...process.env, HOST: "127.0.0.1", PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"]
  });

  t.after(() => {
    server.kill();
  });

  const [chunk] = await once(server.stdout, "data");
  assert.match(String(chunk), /Portfolio running/);
  return { port, server };
}

test("malformed percent-encoded URLs return 400 and keep the server alive", async (t) => {
  const { port, server } = await startServer(t);

  const malformed = await httpGet(port, "/%E0%A4%A");
  assert.equal(malformed.statusCode, 400);

  assert.equal(server.exitCode, null);
  const index = await httpGet(port, "/");
  assert.equal(index.statusCode, 200);
});

test("static project assets are served with long-lived cache headers", async (t) => {
  const { port } = await startServer(t);

  const image = await httpGet(port, "/public/projects/printhub-zplgrid.png");

  assert.equal(image.statusCode, 200);
  assert.equal(image.headers["cache-control"], "public, max-age=31536000, immutable");
});
