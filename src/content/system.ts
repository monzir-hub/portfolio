/**
 * The architecture behind Shifa, simplified into a traceable graph.
 * Every scenario below mirrors code that exists in the project:
 * nginx.conf, the NestJS controllers, jobs.service.ts, ci.yml / release.yml and alerts.yml.
 */

export type NodeId =
  | "client" | "nginx" | "web" | "api" | "pg" | "redis" | "s3" | "worker"
  | "gh" | "ghcr" | "k8s" | "prom" | "grafana";

export type Layer = "runtime" | "data" | "delivery" | "observe";

export type SystemNode = {
  id: NodeId;
  label: string;
  tech: string;
  layer: Layer;
  role: string;
};

type Point = { x: number; y: number };

export const nodes: SystemNode[] = [
  { id: "client", label: "Clients", tech: "Web · iOS · Android", layer: "runtime", role: "Patient and partner apps in Next.js and Expo. They only ever talk to the edge." },
  { id: "nginx", label: "Edge", tech: "Nginx", layer: "runtime", role: "Terminates traffic, caps bodies at 20 MB, rate-limits the API at 20 req/s and auth at 5 req/min per IP." },
  { id: "web", label: "Web", tech: "Next.js", layer: "runtime", role: "Server-rendered patient web, admin console and partner portal." },
  { id: "api", label: "API", tech: "NestJS", layer: "runtime", role: "Versioned REST API. Guards, DTO validation, business rules and audit logging live here." },
  { id: "pg", label: "Database", tech: "PostgreSQL · Prisma", layer: "data", role: "The source of truth. 44 models, transactional writes, row-level locks where races matter." },
  { id: "redis", label: "Queue", tech: "Redis · BullMQ", layer: "data", role: "Background jobs with 5 attempts and exponential backoff, plus caching." },
  { id: "s3", label: "Files", tech: "S3 · private", layer: "data", role: "Medical documents in a private bucket. Clients upload with short-lived presigned URLs and never see credentials." },
  { id: "worker", label: "Worker", tech: "BullMQ worker", layer: "data", role: "Sends SMS, email and push notifications, with per-recipient rate limits on hashed identifiers." },
  { id: "gh", label: "CI", tech: "GitHub Actions", layer: "delivery", role: "Builds every app, typechecks, runs tests, audits dependencies and lints the Helm chart on every push." },
  { id: "ghcr", label: "Registry", tech: "GHCR", layer: "delivery", role: "Versioned container images for the API, web and migrations." },
  { id: "k8s", label: "Cluster", tech: "Kubernetes · Helm", layer: "delivery", role: "One Helm chart runs the migration job first, then scales the API from 3 to 20 replicas at 65% CPU." },
  { id: "prom", label: "Metrics", tech: "Prometheus", layer: "observe", role: "Scrapes a token-protected /metrics endpoint and evaluates alert rules." },
  { id: "grafana", label: "Dashboards", tech: "Grafana", layer: "observe", role: "Where a critical alert becomes something a human sees." },
];

export const edges: [NodeId, NodeId][] = [
  ["client", "nginx"], ["nginx", "web"], ["nginx", "api"], ["web", "api"],
  ["api", "pg"], ["api", "redis"], ["client", "s3"], ["api", "s3"], ["redis", "worker"], ["worker", "pg"],
  ["gh", "ghcr"], ["ghcr", "k8s"], ["k8s", "api"], ["prom", "api"], ["prom", "grafana"],
];

/** Two hand-tuned compositions: a wide one and a tall one for phones. */
export const layouts: Record<"wide" | "tall", { w: number; h: number; pos: Record<NodeId, Point> }> = {
  wide: {
    w: 1000,
    h: 600,
    pos: {
      client: { x: 90, y: 250 }, nginx: { x: 270, y: 250 },
      web: { x: 460, y: 140 }, api: { x: 460, y: 330 },
      pg: { x: 700, y: 140 }, redis: { x: 700, y: 330 }, s3: { x: 270, y: 70 },
      worker: { x: 900, y: 330 },
      gh: { x: 90, y: 520 }, ghcr: { x: 270, y: 520 }, k8s: { x: 460, y: 520 },
      prom: { x: 700, y: 520 }, grafana: { x: 900, y: 520 },
    },
  },
  tall: {
    w: 400,
    h: 760,
    pos: {
      client: { x: 90, y: 60 }, s3: { x: 310, y: 60 },
      nginx: { x: 90, y: 180 }, web: { x: 310, y: 180 },
      api: { x: 200, y: 300 },
      pg: { x: 90, y: 420 }, redis: { x: 310, y: 420 },
      worker: { x: 310, y: 530 },
      k8s: { x: 90, y: 530 },
      ghcr: { x: 90, y: 640 }, gh: { x: 90, y: 720 },
      prom: { x: 310, y: 640 }, grafana: { x: 310, y: 720 },
    },
  },
};

export type TraceStep = { at: NodeId; log: string; note?: string };
export type Scenario = { id: string; title: string; verb: string; steps: TraceStep[] };

export const scenarios: Scenario[] = [
  {
    id: "assign",
    title: "Assign a courier",
    verb: "POST /v1/deliveries/:id/assign",
    steps: [
      { at: "client", log: "pharmacy portal → assign courier" },
      { at: "nginx", log: "limit_req zone=api · proxy_pass" },
      { at: "api", log: "JwtAuthGuard → RolesGuard(PHARMACY)" },
      { at: "pg", log: "BEGIN · SELECT … FOR UPDATE", note: "Row lock: a second request waits here instead of double-booking." },
      { at: "pg", log: "status = PENDING_ASSIGNMENT ✓ · courier available ✓" },
      { at: "pg", log: "UPDATE delivery, courier · COMMIT" },
      { at: "api", log: "200 { success: true }" },
      { at: "client", log: "courier assigned", note: "The loser of the race gets a 409 Conflict, not a corrupt record." },
    ],
  },
  {
    id: "upload",
    title: "Upload a medical record",
    verb: "POST /v1/files/upload-url",
    steps: [
      { at: "client", log: "request upload url · sha256 checksum" },
      { at: "nginx", log: "client_max_body_size 20m" },
      { at: "api", log: "validate mime ∈ {pdf, jpeg, png, webp} · ≤ 20 MB" },
      { at: "pg", log: "INSERT StoredFile + AuditLog (one transaction)" },
      { at: "api", log: "presigned url · expires in 300s" },
      { at: "client", log: "receive url" },
      { at: "s3", log: "PUT object · x-amz-checksum-sha256", note: "Bytes go straight to the private bucket; the API never proxies them." },
      { at: "client", log: "POST /v1/files/:id/complete" },
      { at: "api", log: "compare size · type · checksum · owner" },
      { at: "pg", log: "status → SCANNING (or QUARANTINED on mismatch)" },
    ],
  },
  {
    id: "notify",
    title: "Send a notification",
    verb: "queue shifa-background",
    steps: [
      { at: "api", log: "appointment confirmed" },
      { at: "redis", log: "queue.add · attempts 5 · exponential backoff 2s" },
      { at: "worker", log: "pick job · enforce rate limit on recipientHash" },
      { at: "pg", log: "OutboundDelivery → SENDING" },
      { at: "worker", log: "provider accepted · providerRef" },
      { at: "pg", log: "OutboundDelivery → SENT", note: "On failure: RETRYING with an error code, never a silent drop." },
    ],
  },
  {
    id: "release",
    title: "Ship a release",
    verb: "workflow_dispatch → production",
    steps: [
      { at: "gh", log: "npm run verify · npm audit --audit-level=critical" },
      { at: "gh", log: "helm lint · helm template" },
      { at: "ghcr", log: "push api · web · migrate images" },
      { at: "k8s", log: "helm upgrade · migration job first" },
      { at: "api", log: "rolling update · HPA 3 → 20 @ 65% CPU", note: "Deploys to one environment at a time; concurrent releases queue instead of racing." },
    ],
  },
  {
    id: "incident",
    title: "The API goes down",
    verb: "alert ShifaApiDown",
    steps: [
      { at: "prom", log: "scrape /metrics (token)" },
      { at: "api", log: "no response" },
      { at: "prom", log: "up{job=\"shifa-api\"} == 0 for 2m" },
      { at: "grafana", log: "severity=critical · Shifa API is unavailable", note: "Monitoring is part of the product, not something bolted on after launch." },
    ],
  },
];
