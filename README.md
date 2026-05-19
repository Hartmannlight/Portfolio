# Nathaniel Hartmann Portfolio

Statische Portfolio-Webseite mit Projekt-Timeline, Projekt-Detailseiten und Docker-Deployment ueber GitHub Container Registry.

## Lokal starten

```powershell
npm run dev
```

Die Seite laeuft dann unter:

```txt
http://localhost:4173
```

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
