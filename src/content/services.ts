export type Preview =
  | { kind: "image"; src: string; alt: string }
  | { kind: "phone"; src: string; alt: string }
  | { kind: "cluster" }
  | { kind: "blueprint"; src: string; alt: string }
  | { kind: "plan" };

export type Service = {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  deliverables: string[];
  stack: string[];
  preview: Preview;
  proof?: { label: string; href: string };
};

export const services: Service[] = [
  {
    id: "websites",
    name: "Websites",
    tagline: "Business websites & E-commerce",
    summary: "Fast, search-friendly websites that explain what you do in seconds, and storefronts that make browsing and buying feel effortless.",
    deliverables: ["Company & marketing sites", "E-commerce storefronts", "Catalogue, search & filtering", "Performance & SEO foundations"],
    stack: ["Next.js", "React", "Astro", "TypeScript"],
    preview: { kind: "image", src: "/work/tee-products-900.webp", alt: "TEE storefront products page" },
    proof: { label: "See TEE", href: "/projects/tee" },
  },
  {
    id: "mobile",
    name: "Mobile Apps",
    tagline: "iOS & Android",
    summary: "One codebase, two stores. Apps that share their API and data with your web product instead of duplicating it.",
    deliverables: ["iOS & Android apps", "Shared API with your web app", "Auth, notifications & offline states", "Store-ready builds"],
    stack: ["React Native", "Expo", "Capacitor"],
    preview: { kind: "phone", src: "/work/shifa-m-home.webp", alt: "Shifa on a phone" },
    proof: { label: "See Shifa", href: "/projects/shifa" },
  },
  {
    id: "cloud",
    name: "Cloud Solutions",
    tagline: "Setup & Deployment",
    summary: "Infrastructure written as code, shipped by pipelines and watched by monitoring, so launches are boring in the best way.",
    deliverables: ["AWS architecture", "Docker & Kubernetes", "CI/CD pipelines", "Monitoring & alerting"],
    stack: ["AWS", "Terraform", "Kubernetes", "Helm", "Jenkins", "Prometheus", "Grafana"],
    preview: { kind: "cluster" },
    proof: { label: "See EKS on Terraform", href: "/projects/eks" },
  },
  {
    id: "design",
    name: "UI/UX Design",
    tagline: "Modern & User Friendly",
    summary: "Interfaces designed around the job people came to do: clear hierarchy, honest empty states and details that build trust.",
    deliverables: ["User flows & wireframes", "Visual design systems", "Interactive prototypes", "Accessibility review"],
    stack: ["Design systems", "Prototyping", "Accessibility"],
    preview: { kind: "blueprint", src: "/work/shifa-explore-900.webp", alt: "Shifa explore screen with layout annotations" },
  },
  {
    id: "consulting",
    name: "IT Consulting",
    tagline: "Planning & Support",
    summary: "A technical second opinion before you commit: which stack, which cloud, what it costs and what can wait until later.",
    deliverables: ["Technical planning", "Architecture reviews", "Cloud cost direction", "Hands-on IT support"],
    stack: ["Networking", "Cloud", "Security basics"],
    preview: { kind: "plan" },
    proof: { label: "See CloudOrbit", href: "/projects/cloudorbit" },
  },
  {
    id: "products",
    name: "Digital Products",
    tagline: "From Idea to Launch",
    summary: "The whole journey: shaping the idea, designing it, building the product and the platform beneath it, then shipping and running it.",
    deliverables: ["Product scoping & MVP plan", "Full-stack build", "Deployment & operations", "Iteration after launch"],
    stack: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Docker"],
    preview: { kind: "image", src: "/work/shifa-home-900.webp", alt: "Shifa home screen" },
    proof: { label: "See Shifa", href: "/projects/shifa" },
  },
];

/** How a product is engineered, layer by layer. "usedIn" lists only projects whose code uses the tech. */
export type Layer = { id: string; name: string; role: string; tech: string[]; usedIn: string[] };

export const layers: Layer[] = [
  { id: "interface", name: "Interface", role: "What people see and touch", tech: ["React", "Next.js", "TypeScript", "JavaScript", "Astro", "React Native"], usedIn: ["Shifa", "TEE", "Omdurman Industries", "CloudOrbit", "DocuAI"] },
  { id: "application", name: "Application", role: "Business rules and APIs", tech: ["Node.js", "NestJS", "REST APIs", "Python", "Java", "C++"], usedIn: ["Shifa", "CloudOrbit", "EKS on Terraform"] },
  { id: "data", name: "Data", role: "The source of truth", tech: ["PostgreSQL", "Prisma", "SQL", "Redis"], usedIn: ["Shifa", "CloudOrbit"] },
  { id: "cloud", name: "Cloud", role: "Where it runs", tech: ["AWS", "Docker", "Kubernetes", "Helm", "Terraform"], usedIn: ["Shifa", "EKS on Terraform", "CloudOrbit"] },
  { id: "delivery", name: "Delivery", role: "How it ships and stays healthy", tech: ["GitHub", "GitLab", "Jenkins", "Prometheus", "Grafana"], usedIn: ["Shifa"] },
];

export type Step = { name: string; line: string; detail: string; output: string };

export const processSteps: Step[] = [
  { name: "Idea", line: "Start with the problem, not the feature list.", detail: "Who is it for, what do they need to get done, and what does success look like?", output: "A one-page brief" },
  { name: "Strategy", line: "Decide what to build first.", detail: "An MVP scope, a stack that fits the budget and a plan for what can wait.", output: "Scope, stack & roadmap" },
  { name: "Design", line: "Make it obvious.", detail: "Flows, interface and a design system, tested before production code.", output: "Prototype & design system" },
  { name: "Development", line: "Build the product and what's beneath it.", detail: "Interface, API, database and integrations, typed and tested end to end.", output: "Working product" },
  { name: "Deployment", line: "Ship it like it matters.", detail: "Containers, pipelines, infrastructure as code, monitoring and alerts from day one.", output: "Live, monitored system" },
];

export const principles = [
  { title: "Deterministic before clever", body: "Rules produce the answer; AI explains it. Products should be predictable before they are impressive." },
  { title: "No fake data", body: "An honest empty state beats a dashboard of invented numbers. Trust is a feature." },
  { title: "Ship the boring parts properly", body: "Row locks, health checks, audit logs, alert rules. The unglamorous layer is what makes a product real." },
];
