export const projects = [
  {
    title: "Thingdex Home Inventory",
    slug: "thingdex-home-inventory",
    category: "software",
    eyebrow: "Informatik",
    subtitle: "Modulares Inventarsystem für Haushalt, Lagerorte und Scanner-Workflows",
    shortDescription:
      "Selbst gehostetes Inventarsystem zur Verwaltung von Gegenständen, Lagerorten, Beziehungen und Label-Reprints im Haushalt.",
    image: "/public/projects/thingdex-home-inventory.webp",
    tags: ["FastAPI", "PostgreSQL", "React", "TypeScript", "OpenAPI", "Docker", "JSONB"],
    date: "2026",
    featured: true,
    github: "https://github.com/Hartmannlight/Thingdex-Home-Inventory"
  },
  {
    title: "WLED 6-Channel PWM Shield",
    slug: "wled-6-channel-pwm-shield",
    category: "electronics",
    eyebrow: "Elektrotechnik",
    subtitle: "6-Kanal-PWM-Treiberplatine für LED-Streifen",
    shortDescription:
      "ESP32-S3-basiertes PWM-MOSFET-Shield zur Ansteuerung von 12-V-LED-Streifen mit sechs separat abgesicherten Kanälen.",
    image: "/public/projects/wled-6-channel-pwm-shield.png",
    tags: ["KiCad", "PCB Design", "ESP32-S3", "PWM", "MOSFET", "12 V"],
    date: "2025",
    featured: true,
    github: ""
  },
  {
    title: "PrintHub / zplgrid",
    slug: "printhub-zplgrid",
    category: "software",
    eyebrow: "Informatik",
    subtitle: "Render-, Preview- und Druckservice für ZPL-II-Labels",
    shortDescription:
      "Backend-System, das JSON-Labeltemplates in ZPL II kompiliert, Vorschauen erzeugt und Druckjobs an Zebra-kompatible Drucker sendet.",
    image: "/public/projects/printhub-zplgrid.png",
    tags: ["Python", "FastAPI", "ZPL II", "JSON Schema", "Label Printing"],
    date: "2026",
    featured: true,
    github: "https://github.com/Hartmannlight/PrintHub-ZPL-ll"
  },
  {
    title: "ARMURO Mobile Robot",
    slug: "armuro-mobile-robot",
    category: "electronics",
    eyebrow: "Elektrotechnik",
    subtitle: "Aufbau und Programmierung eines autonomen Mikrocontroller-Roboters",
    shortDescription:
      "Aufbau, Inbetriebnahme und Programmierung eines mobilen Roboters mit Sensorik, Motorsteuerung und reaktivem Fahrverhalten.",
    image: "/public/projects/armuro-mobile-robot.webp",
    tags: ["C", "Microcontroller", "Embedded Systems", "Robotik", "Sensorik", "Elektronik"],
    date: "2025",
    featured: true,
    github: ""
  },
  {
    title: "LabelArchitect",
    slug: "labelarchitect",
    category: "software",
    eyebrow: "Informatik",
    subtitle: "Visueller Editor für zplgrid-Labeltemplates",
    shortDescription:
      "Web-Editor zum Entwerfen von Label-Layouts als JSON-Templates, die anschließend vom Backend gerendert und gedruckt werden.",
    image: "/public/projects/labelarchitect.svg",
    tags: ["React", "TypeScript", "Vite", "Zustand", "Zod", "zplgrid"],
    date: "2026",
    featured: true,
    github: "https://github.com/Hartmannlight/LabelArchitect"
  },
  {
    title: "Pool Remote Control",
    slug: "pool-remote-control",
    category: "electronics",
    eyebrow: "Elektrotechnik",
    subtitle: "Batteriebetriebene ESP32-Fernbedienung für OpenHAB",
    shortDescription:
      "Kleine ESP32-Fernbedienung mit OLED-Display zur Anzeige von Pool- und Temperaturwerten sowie zum Schalten der Filteranlage.",
    image: "/public/projects/pool-remote-control.webp",
    tags: ["ESP32", "Arduino", "OpenHAB", "OLED", "HTTP", "OTA"],
    date: "2022",
    featured: true,
    github: "https://github.com/Hartmannlight/Pool-remote-control"
  },
  {
    title: "HomeLab Infrastructure",
    slug: "homelab-infrastructure",
    category: "software",
    eyebrow: "Informatik",
    subtitle: "Server-, Netzwerk- und Monitoring-Infrastruktur",
    shortDescription:
      "Eigenes HomeLab mit Proxmox, Docker, zentralem Monitoring, OpenWrt-Netzwerk und automatisierter Infrastrukturverwaltung.",
    image: "/public/projects/homelab-infrastructure.svg",
    tags: ["Docker", "Linux", "Proxmox", "Traefik", "Grafana", "Prometheus", "OpenWrt"],
    date: "2026",
    featured: true,
    github: ""
  }
];
