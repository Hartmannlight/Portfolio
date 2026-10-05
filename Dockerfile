FROM golang:1.27-alpine@sha256:8a5910f31396cd4d89662f56c68b3ae31d374308270a1c3bd96672ee5ed43414 AS builder
WORKDIR /build
COPY caddy-build/go.mod caddy-build/go.sum ./
RUN go mod download
COPY caddy-build/main.go ./
RUN CGO_ENABLED=0 go build -mod=readonly -trimpath -ldflags="-s -w" -o /caddy .

FROM caddy:2-alpine@sha256:d44355d3c2149dc580ce2cac735955d1c08d3d00882c30489c241aa51a5c10d9
RUN apk upgrade --no-cache
COPY --from=builder /caddy /usr/bin/caddy

COPY Caddyfile /etc/caddy/Caddyfile

COPY index.html /srv/index.html
COPY src /srv/src
COPY public /srv/public

EXPOSE 4173
