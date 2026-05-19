import { projects } from "./data/projects.js";

const app = document.querySelector("#app");
const themeKey = "portfolio-theme";

function iconFor(category) {
  if (category === "electronics") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 3v3m4-3v3m4-3v3M8 18v3m4-3v3m4-3v3M3 8h3m-3 4h3m-3 4h3m12-8h3m-3 4h3m-3 4h3" />
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M10 10h4v4h-4z" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 18-6-6 6-6" />
      <path d="m15 6 6 6-6 6" />
      <path d="m14 4-4 16" />
    </svg>
  `;
}

function arrowIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  `;
}

function themeIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="M4.22 4.22 5.64 5.64" />
      <path d="M18.36 18.36 19.78 19.78" />
      <path d="M1 12h2" />
      <path d="M21 12h2" />
      <path d="M4.22 19.78 5.64 18.36" />
      <path d="M18.36 5.64 19.78 4.22" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  `;
}

function connectorPath(side) {
  if (side === "left") {
    return "M2 24 C26 24 30 8 50 15 S74 40 98 24";
  }

  return "M2 24 C26 24 30 8 50 15 S74 40 98 24";
}

function setInitialTheme() {
  const saved = localStorage.getItem(themeKey);
  const fallback = window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
  document.documentElement.dataset.theme = saved || fallback;
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem(themeKey, next);
}

function navigate(path) {
  history.pushState({}, "", path);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function navbar() {
  return `
    <header class="site-header">
      <a class="brand" href="/" data-link>
        <span class="brand-mark">NH</span>
        <span>
          <strong>Nathaniel Hartmann</strong>
          <small>Informatik & Elektronik</small>
        </span>
      </a>
      <nav class="main-nav" aria-label="Hauptnavigation">
        <a href="/#projects">Projekte</a>
        <a href="/public/lebenslauf.pdf" target="_blank" rel="noreferrer">Lebenslauf</a>
        <button class="theme-toggle" type="button" aria-label="Theme wechseln">
          ${themeIcon()}
        </button>
      </nav>
    </header>
  `;
}

function projectCard(project, index) {
  const side = index % 2 === 0 ? "left" : "right";
  const tags = project.tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("");

  return `
    <article class="timeline-item timeline-item--${side} timeline-item--${project.category}">
      <a class="project-card" href="/projects/${project.slug}" data-link>
        <div class="project-image">
          <img src="${project.image}" alt="Vorschaubild fuer ${project.title}" loading="lazy" />
        </div>
        <div class="project-copy">
          <div class="project-type project-type--${project.category}">
            <span class="project-icon">${iconFor(project.category)}</span>
            <span>${project.eyebrow}</span>
          </div>
          <h2>${project.title}</h2>
          <p class="project-subtitle">${project.subtitle}</p>
          <p>${project.shortDescription}</p>
          <div class="project-tags">${tags}</div>
          <span class="text-link">Mehr erfahren ${arrowIcon()}</span>
        </div>
      </a>
      <svg class="project-connector" viewBox="0 0 100 48" preserveAspectRatio="none" aria-hidden="true">
        <path d="${connectorPath(side)}" />
      </svg>
      <span class="timeline-node" aria-hidden="true"></span>
    </article>
  `;
}

function homePage() {
  return `
    ${navbar()}
    <main>
      <section class="intro" aria-labelledby="page-title">
        <div>
          <p class="kicker">Portfolio</p>
          <h1 id="page-title">Projekte zwischen Code und Schaltung.</h1>
        </div>
      </section>

      <section class="timeline-section" id="projects" aria-label="Projektuebersicht">
        <div class="timeline-rail" aria-hidden="true"></div>
        <div class="timeline">
          ${projects.map(projectCard).join("")}
        </div>
      </section>
    </main>
  `;
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---")) {
    return { body: markdown, meta: {} };
  }

  const end = markdown.indexOf("\n---", 3);
  if (end === -1) {
    return { body: markdown, meta: {} };
  }

  const rawMeta = markdown.slice(3, end).trim();
  const meta = Object.fromEntries(
    rawMeta
      .split("\n")
      .map((line) => line.split(":").map((part) => part.trim().replace(/^"|"$/g, "")))
      .filter(([key, value]) => key && value)
  );

  return { body: markdown.slice(end + 4).trim(), meta };
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function markdownToHtml(markdown) {
  const { body } = parseFrontmatter(markdown);
  const lines = body.split(/\r?\n/);
  const html = [];
  let inList = false;
  let inCode = false;
  let codeLines = [];

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        inCode = false;
      } else {
        closeList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith("# ")) {
      closeList();
      html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  closeList();
  return html.join("");
}

async function projectPage(slug) {
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return notFoundPage();
  }

  let body = "<p>Der Projektinhalt konnte nicht geladen werden.</p>";

  try {
    const response = await fetch(`/src/content/projects/${project.slug}.mdx`);
    if (response.ok) {
      body = markdownToHtml(await response.text());
    }
  } catch {
    body =
      "<p>Der Markdown-Inhalt ist nur ueber den lokalen Server oder ein Hosting mit statischen Dateien verfuegbar.</p>";
  }

  return `
    ${navbar()}
    <main class="project-detail">
      <a class="back-link" href="/" data-link>${arrowIcon()} Zurueck zu den Projekten</a>
      <section class="detail-hero">
        <div class="detail-copy">
          <div class="project-type project-type--${project.category}">
            <span class="project-icon">${iconFor(project.category)}</span>
            <span>${project.eyebrow}</span>
          </div>
          <h1>${project.title}</h1>
          <p>${project.shortDescription}</p>
          <div class="detail-actions">
            <a class="primary-link" href="${project.github}" target="_blank" rel="noreferrer">
              GitHub ${arrowIcon()}
            </a>
          </div>
        </div>
        <div class="detail-image">
          <img src="${project.image}" alt="Hero-Bild fuer ${project.title}" />
        </div>
      </section>
      <section class="detail-meta" aria-label="Projektmetadaten">
        <div>
          <span>Jahr</span>
          <strong>${project.date}</strong>
        </div>
        <div>
          <span>Kategorie</span>
          <strong>${project.eyebrow}</strong>
        </div>
        <div>
          <span>Technologien</span>
          <strong>${project.tags.join(" / ")}</strong>
        </div>
      </section>
      <article class="markdown-content">${body}</article>
    </main>
  `;
}

function notFoundPage() {
  return `
    ${navbar()}
    <main class="not-found">
      <p class="kicker">404</p>
      <h1>Projekt nicht gefunden</h1>
      <p>Diese Projektseite existiert in den aktuellen Projektdaten nicht.</p>
      <a class="primary-link" href="/" data-link>Zur Projektuebersicht ${arrowIcon()}</a>
    </main>
  `;
}

async function render() {
  const path = window.location.pathname;

  if (path.startsWith("/projects/")) {
    const slug = path.split("/").filter(Boolean)[1];
    app.innerHTML = await projectPage(slug);
  } else {
    app.innerHTML = homePage();
  }

  bindEvents();
}

function bindEvents() {
  document.querySelectorAll("[data-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("http") || href.includes("#")) {
        return;
      }

      event.preventDefault();
      navigate(href);
    });
  });

  document.querySelector(".theme-toggle")?.addEventListener("click", toggleTheme);
}

setInitialTheme();
window.addEventListener("popstate", render);
render();
