# Nathaniel Hartmann Portfolio

Statische Portfolio-Webseite mit Projekt-Timeline, Projekt-Detailseiten und Caddy-basiertem Docker-Deployment ueber GitHub Container Registry.

## Lokal starten

```powershell
npm run dev
```

Die Seite laeuft dann unter:

```txt
http://localhost:4173
```

## Qualitaetschecks

Das Projekt kommt ohne externe Build-Dependencies aus. Die Checks laufen ueber
kleine Node-Skripte:

```powershell
npm run lint
npm run format:check
npm test
npm run check
```

`npm run lint` prueft JavaScript-/MJS-Syntax und JSON-Dateien. `npm run
format:check` prueft einfache Formatregeln wie finale Newline und trailing
whitespace. `npm run format` wendet diese Formatregeln an. `npm run check`
buendelt Linting, Formatcheck, Tests und Projekt-Content-Pruefungen, darunter
fehlende Detailseiten, fehlende Bilder und zu grosse Projektbilder.

## Deployment mit Docker Compose

Nach jedem Push auf `main` baut GitHub Actions automatisch ein Image und veroeffentlicht es unter:

```txt
ghcr.io/hartmannlight/portfolio:latest
```

Auf dem Server reicht danach:

```powershell
docker compose pull
docker compose up -d
```

Standard-Port:

```txt
http://localhost:4173
```

Wenn der Container hinter Traefik laufen soll, nutze stattdessen die
Traefik-Compose-Datei. Dabei wird kein Host-Port veroeffentlicht; Traefik
erreicht den Container ueber das externe Docker-Netzwerk:

```powershell
$env:PORTFOLIO_HOST="portfolio.example.com"
docker compose -f docker-compose.traefik.yml pull
docker compose -f docker-compose.traefik.yml up -d
```

Optionale Variablen:

```txt
TRAEFIK_NETWORK=traefik
TRAEFIK_ENTRYPOINT=websecure
TRAEFIK_CERT_RESOLVER=letsencrypt
```

Vor dem ersten Produktivstart pruefen:

1. `PORTFOLIO_HOST` auf die echte Domain setzen, zum Beispiel
   `portfolio.example.com`.
2. Externes Docker-Netzwerk fuer Traefik pruefen. Standard ist `traefik`;
   bei anderem Namen `TRAEFIK_NETWORK` setzen.
3. Traefik-Entrypoint und Certresolver mit der Server-Konfiguration abgleichen.
   Standardwerte sind `websecure` und `letsencrypt`.
4. Vor dem Push lokal `npm run check` ausfuehren.
5. Nach dem Push pruefen, ob GitHub Actions das Image erfolgreich gebaut und
   nach `ghcr.io/hartmannlight/portfolio:latest` gepusht hat.

## Server- und Routing-Modell

Lokal nutzt das Projekt den kleinen Node-Server aus `scripts/dev-server.mjs`.
Im Produktions-Container laeuft dagegen Caddy mit der Konfiguration aus
`Caddyfile`. Damit bleibt die lokale Entwicklung dependency-frei, waehrend die
Produktion ueber einen typischen Static-File-Server laeuft.

Hinter Traefik sollte Traefik TLS, Domains und externes Routing uebernehmen.
Der Portfolio-Container selbst spricht nur HTTP auf Port `4173`.

Direkt ausgeliefert werden vorhandene Dateien wie:

```txt
/src/app.js
/src/styles.css
/src/content/projects/<slug>.mdx
/public/projects/<slug>.<ext>
```

Alle routenartigen URLs ohne Dateiendung, zum Beispiel `/`, `/projects` und
`/projects/<slug>`, muessen auf `index.html` fallen. URLs mit Dateiendung
duerfen dagegen keinen Fallback bekommen und sollen bei fehlender Datei `404`
liefern.

Die produktive Caddy-Regel liegt in `Caddyfile`:

```caddyfile
handle /public/* {
  header Cache-Control "public, max-age=31536000, immutable"
  file_server
}

handle /src/* {
  header Cache-Control "no-cache"
  file_server
}

@fileWithExtension path_regexp fileWithExtension \.[^/]+$
handle @fileWithExtension {
  file_server
}

handle {
  header Cache-Control "no-cache"
  try_files {path} {path}/ /index.html
  file_server
}
```

Bei einem Wechsel auf ein anderes Static Hosting muss dieses Fallback-Routing
dort entsprechend nachgebaut oder durch vorgerenderte HTML-Dateien ersetzt
werden.

Optional kann der externe Port gesetzt werden:

```powershell
$env:PORT=8080
docker compose up -d
```

Dann ist die Seite unter `http://localhost:8080` erreichbar.

## Neue Projekte hinzufuegen

Ein Projekt besteht aus drei Teilen:

1. Eintrag in `src/data/projects.js`
2. Detailtext in `src/content/projects/<slug>.mdx`
3. Bild in `public/projects/<slug>.*`

Der `slug` bestimmt die Detail-URL, zum Beispiel:

```txt
/projects/thingdex
```

Kategorie fuer Software:

```js
category: "software",
eyebrow: "Informatik"
```

Kategorie fuer Elektrotechnik:

```js
category: "electronics",
eyebrow: "Elektrotechnik"
```
