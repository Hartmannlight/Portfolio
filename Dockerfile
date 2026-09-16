FROM golang:1.27-alpine@sha256:cf6fca6641884b8433441b2b0652976f975e1d0fdd26d177eaaf8596087f3125 AS builder
WORKDIR /build
COPY caddy-build/go.mod caddy-build/go.sum ./
RUN go mod download
COPY caddy-build/main.go ./
RUN CGO_ENABLED=0 go build -mod=readonly -trimpath -ldflags="-s -w" -o /caddy .

FROM caddy:2-alpine@sha256:5f5c8640aae01df9654968d946d8f1a56c497f1dd5c5cda4cf95ab7c14d58648
RUN apk upgrade --no-cache
COPY --from=builder /caddy /usr/bin/caddy

COPY Caddyfile /etc/caddy/Caddyfile

COPY index.html /srv/index.html
COPY src /srv/src
COPY public /srv/public

EXPOSE 4173
