# Caddy runtime dependencies

The official Caddy image can lag behind security releases of embedded Go libraries.
Build the same Caddy release from this locked module using the current Go patch
image. Renovate maintains both go.mod/go.sum and Docker image versions/digests.
The final image preserves the official Caddy layout and existing Caddyfile.

After editing versions, run `go mod tidy`. CI builds with `-mod=readonly`, tests
HTTP startup, and scans the resulting image before publication. Never bypass the
image vulnerability gate to promote a rebuild.
