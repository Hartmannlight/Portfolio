FROM golang:1.27-alpine@sha256:cf6fca6641884b8433441b2b0652976f975e1d0fdd26d177eaaf8596087f3125 AS builder
WORKDIR /build
COPY caddy-build/go.mod caddy-build/go.sum ./
RUN go mod download
COPY caddy-build/main.go ./
RUN CGO_ENABLED=0 go build -mod=readonly -trimpath -ldflags="-s -w" -o /caddy .

FROM caddy:2-alpine@sha256:6aeddd44c3078b0f9a35206472a11420648a79c184603ef95957d0a20044cb2b
RUN apk upgrade --no-cache
COPY --from=builder /caddy /usr/bin/caddy

COPY Caddyfile /etc/caddy/Caddyfile

COPY index.html /srv/index.html
COPY src /srv/src
COPY public /srv/public

EXPOSE 4173
