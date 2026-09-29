export type VisualKind = "shifa" | "orbit" | "eks" | "docu";

export type Shot = { src: string; alt: string; small?: string; width?: number; height?: number };

export type Chapter = {
  label: string;
  heading: string;
  body: string;
  tags?: string[];
  /** For projects with real screens: the screen shown while this chapter is active. */
  shot?: Shot;
};

export type CaseStudy = {
  id: string;
  title: string;
  category: string;
  year: string;
  role: string;
  summary: string;
  facts: { value: string; label: string }[];
  chapters: Chapter[];
  stack: string[];
  note?: string;
  /** SVG figure for projects without public screens. */
  visual?: VisualKind;
  /** One line used on cards and indexes. */
  tagline: string;
  services: string[];
  featured?: boolean;
  live?: string;
  cover?: Shot;
  phone?: Shot;
  /** Full-page capture that scrolls inside the browser frame. */
  scroll?: Shot;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "shifa",
    title: "Shifa",
    category: "Healthcare platform",
    year: "2026",
    role: "Product · Engineering · Infrastructure",
    summary:
      "One platform connecting patients with doctors, clinics, pharmacies, labs and home-care teams, delivered as six apps on a single API.",
    facts: [
      { value: "6", label: "apps in one monorepo" },
      { value: "44", label: "relational models" },
      { value: "17", label: "API controllers" },
    ],
    chapters: [
      {
        label: "The problem",
        heading: "Care is scattered across too many doors.",
        shot: { src: "/work/shifa-explore-1600.webp", small: "/work/shifa-explore-900.webp", alt: "Shifa explore screen listing doctors, clinics, pharmacies, laboratories and home care" },
        body: "Booking a doctor, filling a prescription, ordering a lab test and paying for it are usually separate journeys with separate providers. Shifa puts them behind one account and one medical record.",
      },
      {
        label: "What I built",
        heading: "Six surfaces, one source of truth.",
        shot: { src: "/work/shifa-doctors-1600.webp", small: "/work/shifa-doctors-900.webp", alt: "Shifa doctor search with booking actions" },
        body: "A patient web app, admin console and partner portal in Next.js; patient and partner mobile apps in Expo; and a versioned NestJS API with Swagger docs, pagination and a standard response shape.",
        tags: ["Next.js", "Expo", "NestJS", "TypeScript"],
      },
      {
        label: "Under the hood",
        heading: "PostgreSQL is authoritative. Everything else is support.",
        body: "Prisma models identity, scheduling, medical records, prescriptions, pharmacy, labs, home care, payments, chat and audit trails. Redis backs BullMQ jobs and caching, Nginx rate-limits the edge, and a Helm chart scales the API from 3 to 20 replicas.",
        tags: ["Prisma", "PostgreSQL", "Redis", "Helm", "Prometheus"],
      },
      {
        label: "The hard part",
        heading: "Two pharmacists, one courier, the same second.",
        body: "Courier assignment runs inside a transaction that takes a SELECT … FOR UPDATE row lock, re-checks state and marks the courier unavailable before commit, so concurrent requests cannot double-book. Manual cash and bank-transfer flows get finance verification, commission rules and scheduled clinic settlements.",
        tags: ["Transactions", "Row locks", "Jest"],
      },
    ],
    stack: [
      "Next.js", "React Native", "NestJS", "Prisma", "PostgreSQL", "Redis",
      "BullMQ", "Nginx", "Docker", "Helm", "Kubernetes", "Prometheus", "Grafana", "GitHub Actions",
    ],
    note: "Production-oriented foundation. Card processors, identity verification and regulated hosting come before real patient data.",
    visual: "shifa",
    featured: true,
    cover: { src: "/work/shifa-home-1600.webp", small: "/work/shifa-home-900.webp", alt: "Shifa patient web app home page" },
    phone: { src: "/work/shifa-m-home.webp", alt: "Shifa on a phone" },
    scroll: { src: "/work/shifa-full.webp", alt: "The full Shifa home page", width: 1100, height: 3361 },
    tagline: "A healthcare ecosystem connecting patients with doctors, pharmacies, labs and home care.",
    services: ["Digital Products", "Mobile Apps", "Cloud Solutions"],
  },
  {
    id: "tee",
    title: "TEE",
    category: "Beauty e-commerce",
    year: "2026",
    role: "Design · Front-end · Build",
    tagline: "A storefront for natural beauty and care products, with a catalogue you can filter, sort, search and share.",
    summary:
      "An online store for TEE's beauty and care range, from hand creams to fragrance, built to make products feel fresh and browsing effortless.",
    facts: [
      { value: "6", label: "product categories" },
      { value: "2", label: "pages: home & catalogue" },
      { value: "URL", label: "state for every view" },
    ],
    chapters: [
      {
        label: "The brief",
        heading: "Beauty is bought with the eyes first.",
        body: "The storefront has to make products feel tangible, carry a bright fruit-scented brand and make six categories easy to browse on any screen.",
        shot: { src: "/work/tee-home-1600.webp", small: "/work/tee-home-900.webp", alt: "TEE home page with hand cream product line-up" },
      },
      {
        label: "What I built",
        heading: "A storefront, not a template.",
        body: "A homepage and a full products catalogue with category chips, product cards, a quick-view dialog, a search dialog and a cart drawer with quantity steppers.",
        tags: ["Astro", "TypeScript"],
        shot: { src: "/work/tee-products-1600.webp", small: "/work/tee-products-900.webp", alt: "TEE products catalogue with category filters" },
      },
      {
        label: "Under the hood",
        heading: "Every view has an address.",
        body: "Category, sort and search live in the URL (?category=skincare&sort=price-asc&q=serum), so any filtered view can be shared or bookmarked. Product photos are picked up by file name and optimised at build time.",
        tags: ["URL state", "Sharp", "Static build"],
        shot: { src: "/work/tee-m-products.webp", alt: "TEE catalogue on a phone" },
      },
      {
        label: "Mobile",
        heading: "Designed again for the thumb.",
        body: "The mobile layout was tightened separately rather than shrunk: product grid, chips and drawer are all laid out for one-handed browsing.",
        shot: { src: "/work/tee-m-home.webp", alt: "TEE home page on a phone" },
      },
    ],
    stack: ["Astro", "TypeScript", "Sharp", "Vercel"],
    note: "Live on Vercel. Checkout, newsletter and social links are not connected yet, and ratings and testimonials are placeholders.",
    services: ["Websites", "UI/UX Design"],
    featured: true,
    live: "https://tee-black.vercel.app",
    cover: { src: "/work/tee-home-1600.webp", small: "/work/tee-home-900.webp", alt: "TEE storefront home page" },
    phone: { src: "/work/tee-m-home.webp", alt: "TEE on a phone" },
    scroll: { src: "/work/tee-full.webp", alt: "The full TEE home page", width: 1100, height: 2811 },
  },
  {
    id: "omdurman",
    title: "Omdurman Industries",
    category: "Corporate website · EN / AR",
    year: "2025",
    role: "Design · Front-end · Deployment",
    tagline: "A bilingual corporate website for an industrial manufacturer in Sudan, in English and Arabic with full right-to-left layout.",
    summary:
      "The public face of Omdurman Industries Company: who they are, what they manufacture and how to reach them, in two languages and two reading directions.",
    facts: [
      { value: "7", label: "pages" },
      { value: "2", label: "languages, EN and AR" },
      { value: "RTL", label: "mirrored layout" },
    ],
    chapters: [
      {
        label: "The brief",
        heading: "An industrial company needs a credible front door.",
        body: "Customers, partners and job seekers need to understand the company, its products and its services quickly, in English or Arabic.",
        shot: { src: "/work/om-home-1600.webp", small: "/work/om-home-900.webp", alt: "Omdurman Industries home page" },
      },
      {
        label: "What I built",
        heading: "Seven pages, one clear structure.",
        body: "Home, About, Services, Products, Projects, Careers and Contact, with a shared header and footer, client-side routing and a contact form with instant confirmation.",
        tags: ["React", "TypeScript", "React Router"],
        shot: { src: "/work/om-products-1600.webp", small: "/work/om-products-900.webp", alt: "Omdurman Industries products page" },
      },
      {
        label: "Under the hood",
        heading: "Two languages, two directions.",
        body: "A language context holds every string in English and Arabic and flips the document direction, so the whole layout mirrors to right-to-left rather than just translating the words.",
        tags: ["i18n", "RTL", "Tailwind"],
        shot: { src: "/work/om-ar-1600.webp", small: "/work/om-ar-900.webp", alt: "Omdurman Industries home page in Arabic, laid out right to left" },
      },
      {
        label: "Mobile",
        heading: "Built to be read on a phone.",
        body: "The responsive layout collapses navigation into a menu and keeps the headline and call to action in the first screen.",
        shot: { src: "/work/om-m-home.webp", alt: "Omdurman Industries on a phone" },
      },
    ],
    stack: ["React", "TypeScript", "Vite", "Tailwind", "shadcn/ui", "Vercel"],
    note: "Live on Vercel. The contact form confirms on screen but isn't connected to an inbox yet.",
    services: ["Websites", "UI/UX Design"],
    featured: true,
    live: "https://omdurman-digital-forge-main.vercel.app",
    cover: { src: "/work/om-home-1600.webp", small: "/work/om-home-900.webp", alt: "Omdurman Industries home page" },
    phone: { src: "/work/om-m-home.webp", alt: "Omdurman Industries on a phone" },
    scroll: { src: "/work/om-full.webp", alt: "The full Omdurman Industries home page", width: 1100, height: 2626 },
  },
  {
    id: "cloudorbit",
    title: "CloudOrbit",
    category: "Cloud planning SaaS",
    year: "2026",
    role: "Product · Full-stack · Cloud logic",
    summary:
      "Describe a business, get a provider recommendation, a mapped architecture, a conceptual cost range and a downloadable Terraform project.",
    facts: [
      { value: "3", label: "cloud providers mapped" },
      { value: "6", label: "Terraform files generated" },
      { value: "0", label: "invented metrics" },
    ],
    chapters: [
      {
        label: "The problem",
        heading: "Teams make cloud decisions before they have cloud expertise.",
        body: "Choosing a provider, sizing services and writing infrastructure code usually waits for a specialist. CloudOrbit turns plain business requirements into a plan a team can reason about.",
      },
      {
        label: "What I built",
        heading: "A deterministic planning engine.",
        body: "Provider rules, architecture rules, a cost calculator and a service mapper translate universal layers such as compute, data and edge into AWS, Azure or Google Cloud services. Every plan is persisted with its reasoning.",
        tags: ["Next.js 15", "React 19", "Prisma", "PostgreSQL"],
      },
      {
        label: "Under the hood",
        heading: "From plan to provider.tf.",
        body: "A generation engine turns a saved plan into provider, variables, main, outputs and tfvars files plus a README, then packages them as a ZIP. It never executes Terraform and never touches credentials.",
        tags: ["Terraform", "Code generation"],
      },
      {
        label: "The hard part",
        heading: "Keeping the AI in its lane.",
        body: "The assistant is context-scoped: it receives the user’s plan, explains the reasoning and refuses anything outside cloud architecture. The rules decide; the model only explains. Empty states stay empty until a real integration exists.",
        tags: ["OpenAI API", "Auth.js", "Guardrails"],
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "Auth.js", "Prisma", "PostgreSQL", "OpenAI API", "Terraform", "Docker"],
    visual: "orbit",
    tagline: "Business requirements in, cloud architecture and Terraform out.",
    services: ["Cloud Solutions", "IT Consulting", "Digital Products"],
  },
  {
    id: "eks",
    title: "EKS on Terraform",
    category: "Infrastructure as code",
    year: "2025",
    role: "Cloud · DevOps",
    summary:
      "A modular Terraform foundation for Amazon EKS, plus a containerised app moved from a single VM onto Kubernetes.",
    facts: [
      { value: "4", label: "Terraform modules" },
      { value: "2", label: "availability zones" },
      { value: "1", label: "command to rebuild" },
    ],
    chapters: [
      {
        label: "The problem",
        heading: "Clicking through a console doesn’t scale.",
        body: "A Kubernetes cluster built by hand can’t be reviewed, repeated or safely torn down. The goal was infrastructure that lives in version control and rebuilds identically.",
      },
      {
        label: "What I built",
        heading: "Small modules with clear contracts.",
        body: "Separate VPC, subnet, EKS and node-group modules, each exposing only the outputs the next one needs. Region, CIDRs, Kubernetes version and node sizing are all variables.",
        tags: ["Terraform", "AWS"],
      },
      {
        label: "Under the hood",
        heading: "Two zones, one control plane.",
        body: "Subnets are provisioned in two availability zones and passed into both the EKS cluster and a managed node group. Explicit dependencies make sure the cluster exists before any node tries to join it.",
        tags: ["VPC", "EKS", "IAM", "Node groups"],
      },
      {
        label: "The workload",
        heading: "Then something real runs on it.",
        body: "I containerised a Flask and MongoDB library application and deployed it to Kubernetes on Minikube, with Deployments and NodePort and ClusterIP services. That’s the kind of workload this cluster exists to run.",
        tags: ["Docker", "Kubernetes", "Flask", "MongoDB"],
      },
    ],
    stack: ["Terraform", "AWS", "EKS", "VPC", "IAM", "Docker", "Kubernetes", "Python", "MongoDB"],
    visual: "eks",
    tagline: "Kubernetes on AWS, defined entirely in version-controlled Terraform.",
    services: ["Cloud Solutions"],
  },
  {
    id: "docuai",
    title: "DocuAI Studio",
    category: "AI document generation",
    year: "2025",
    role: "Product design · Front-end · AI",
    summary:
      "Company profiles, feasibility studies, business plans and presentations, generated by AI and laid out like they came from a design studio.",
    facts: [
      { value: "2", label: "languages, EN and AR" },
      { value: "3", label: "platforms: web, Android, iOS" },
      { value: "PDF", label: "print-ready export" },
    ],
    chapters: [
      {
        label: "The problem",
        heading: "AI writes text. Businesses need documents.",
        body: "A raw model response is a wall of paragraphs. A feasibility study needs hierarchy, rhythm, branding and pages that print cleanly.",
      },
      {
        label: "What I built",
        heading: "A template engine for generated content.",
        body: "Structured AI output is mapped onto template families that define hero layout, section rhythm, bullet style, label style and footer, so the same content can take on very different designs.",
        tags: ["React", "TypeScript", "OpenAI API"],
      },
      {
        label: "Under the hood",
        heading: "Designed to break across pages.",
        body: "Blocks are tagged so the PDF exporter paginates between them, never through them. Themes, branding and an editor sit on top, with English and Arabic support and light and dark modes.",
        tags: ["PDF export", "i18n", "Tailwind"],
      },
      {
        label: "Everywhere",
        heading: "One codebase, three platforms.",
        body: "The same React app ships to the web and runs natively on Android and iOS through Capacitor.",
        tags: ["Capacitor", "Vite"],
      },
    ],
    stack: ["React", "TypeScript", "Vite", "Tailwind", "OpenAI API", "Capacitor"],
    visual: "docu",
    tagline: "AI-generated business documents that look designed, on web and mobile.",
    services: ["Digital Products", "Websites", "Mobile Apps"],
  },
];

export type IndexEntry = { title: string; kind: string; stack: string; year: string };

export const moreWork: IndexEntry[] = [
  {
    title: "Alizarin ERP",
    kind: "Pharma manufacturing ERP: batch production, QC, traceability, RBAC, audit log",
    stack: "Express · TypeScript · PostgreSQL · React Query",
    year: "2026",
  },
  {
    title: "ValeoFlow",
    kind: "Workflow OS for contract manufacturing, with a read-only client portal",
    stack: "React · Express · MongoDB · Docker",
    year: "2025",
  },
  {
    title: "Online Library on K8s",
    kind: "Flask + MongoDB app containerised and deployed to Kubernetes",
    stack: "Python · Docker · Minikube",
    year: "2025",
  },
];
