import { Box, Scene, Text, VIEW, Wire, elbow, elbowV } from "./primitives";
import s from "./visuals.module.css";

const apps = [
  { label: "Patient web", sub: "Next.js" },
  { label: "Admin", sub: "Next.js" },
  { label: "Partner web", sub: "Next.js" },
  { label: "Patient app", sub: "Expo" },
  { label: "Partner app", sub: "Expo" },
];

const models = [
  "User", "Session", "AccountToken", "StoredFile", "MalwareScanEvent", "OutboundDelivery", "PatientProfile",
  "Specialty", "DoctorProfile", "Clinic", "DoctorClinic", "Availability", "Appointment", "MedicalRecord",
  "MedicalDocument", "Medicine", "Prescription", "PrescriptionItem", "PharmacyOrder", "CourierProfile",
  "DeliveryZone", "Delivery", "DeliveryEvent", "LabBooking", "HomeCareBooking", "PaymentMethod", "Payment",
  "PaymentEvent", "CommissionRule", "Settlement", "SettlementItem", "Review", "Conversation",
  "ConversationParticipant", "Message", "Notification", "AuditLog", "AccessRole", "Permission",
  "RolePermission", "AppConfiguration", "DeviceEndpoint", "Pharmacy", "LaboratoryTest",
];
const keyModels = new Set(["Appointment", "Prescription", "Delivery", "Payment", "AuditLog", "MedicalRecord"]);

export function ShifaVisual({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className={s.svg} role="img" aria-label="Shifa system figure">
      {/* 0 — scattered care */}
      <Scene on={step === 0} label="Separate providers with no shared record">
        {[
          { x: 70, y: 70, w: 150, label: "Doctor", sub: "phone call", r: -6, tx: 145, ty: 97 },
          { x: 560, y: 56, w: 150, label: "Clinic", sub: "walk-in", r: 5, tx: 635, ty: 83 },
          { x: 590, y: 430, w: 160, label: "Pharmacy", sub: "paper script", r: -4, tx: 670, ty: 457 },
          { x: 60, y: 450, w: 140, label: "Lab", sub: "separate visit", r: 7, tx: 130, ty: 477 },
          { x: 320, y: 540, w: 170, label: "Home care", sub: "word of mouth", r: -3, tx: 405, ty: 567 },
        ].map((b, i) => {
          const mx = 400 + (b.tx - 400) * 0.55;
          const my = 300 + (b.ty - 300) * 0.55;
          return (
            <g key={b.label}>
              <Wire d={`M400 300 L${mx} ${my}`} tone="dashed" />
              <Text x={mx} y={my + 4} kind="signal" anchor="middle" d={i + 4}>
                ×
              </Text>
              <Box x={b.x} y={b.y} w={b.w} h={56} label={b.label} sub={b.sub} rotate={b.r} d={i} />
            </g>
          );
        })}
        <g className={s.item} style={{ "--d": 2 } as React.CSSProperties}>
          <circle cx={400} cy={300} r={46} className={s.box_signal} />
          <text x={400} y={305} textAnchor="middle" className={s.label}>
            Patient
          </text>
        </g>
      </Scene>

      {/* 1 — six surfaces, one API */}
      <Scene on={step === 1} label="Five client apps converging on one NestJS API">
        {apps.map((a, i) => {
          const x = 24 + i * 152;
          return (
            <g key={a.label}>
              <Box x={x} y={80} w={140} h={62} label={a.label} sub={a.sub} d={i} />
              <Wire d={elbowV(x + 70, 142, 400, 320)} delay={i + 2} pulse={i % 2 === 0} dur={2 + i * 0.3} />
            </g>
          );
        })}
        <Box x={240} y={320} w={320} h={76} label="API" sub="NestJS · /v1 · Swagger · guards" tone="signal" d={6} />
        <Wire d="M400 396 V470" delay={8} tone="signal" pulse dur={1.4} />
        <Box x={290} y={470} w={220} h={62} label="PostgreSQL" sub="single source of truth" d={9} />
        <Text x={24} y={40} kind="sub" d={0}>
          apps/ · 6 workspaces · one monorepo
        </Text>
      </Scene>

      {/* 2 — the schema as typography */}
      <Scene on={step === 2} label="The 44 relational models in the Prisma schema">
        <Text x={24} y={40} kind="sub">
          schema.prisma
        </Text>
        <Text x={776} y={40} kind="signal" anchor="end">
          44 models
        </Text>
        {models.map((m, i) => {
          const col = Math.floor(i / 11);
          const row = i % 11;
          return (
            <Text key={m} x={24 + col * 196} y={86 + row * 26} kind={keyModels.has(m) ? "signal" : "code"} d={row * 0.4}>
              {m}
            </Text>
          );
        })}
        {[
          { x: 24, label: "Redis", sub: "BullMQ · cache" },
          { x: 214, label: "S3", sub: "private · signed" },
          { x: 404, label: "Nginx", sub: "20 r/s · 20 MB" },
          { x: 594, label: "Helm", sub: "HPA 3 → 20" },
        ].map((b, i) => (
          <Box key={b.label} x={b.x} y={420} w={182} h={62} label={b.label} sub={b.sub} d={6 + i} />
        ))}
        <Text x={24} y={540} kind="sub" d={10}>
          Postgres is authoritative. Redis, S3 and Nginx support it.
        </Text>
      </Scene>

      {/* 3 — the race */}
      <Scene on={step === 3} label="Two concurrent assignments resolved by a row lock">
        <Box x={24} y={120} w={180} h={62} label="Pharmacy A" sub="t = 0 ms" d={0} />
        <Box x={24} y={420} w={180} h={62} label="Pharmacy B" sub="t = 0 ms" d={1} />
        <Wire d={elbow(204, 151, 300, 300)} tone="signal" delay={2} pulse dur={1.8} />
        <Wire d={elbow(204, 451, 300, 330)} tone="dashed" delay={3} />
        <Text x={218} y={400} kind="sub" d={4}>
          waits on lock
        </Text>
        <Box x={300} y={270} w={220} h={90} label="delivery row" sub="SELECT … FOR UPDATE" tone="signal" d={3} />
        <Text x={410} y={255} kind="signal" anchor="middle" d={4}>
          ● LOCKED
        </Text>
        <Wire d={elbow(520, 300, 596, 151)} delay={5} />
        <Wire d={elbow(520, 330, 596, 451)} delay={6} />
        <Box x={596} y={120} w={180} h={62} label="200 Assigned" sub="COMMIT" tone="solid" d={6} />
        <Box x={596} y={420} w={180} h={62} label="409 Conflict" sub="already assigned" tone="ghost" d={7} />
        <Text x={24} y={580} kind="sub" d={8}>
          Re-check state inside the lock · mark courier unavailable · commit
        </Text>
      </Scene>
    </svg>
  );
}
