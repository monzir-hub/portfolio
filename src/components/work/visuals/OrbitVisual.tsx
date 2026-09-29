import { Box, Scene, Text, VIEW, Wire, elbow } from "./primitives";
import s from "./visuals.module.css";

const requirement = [
  ["business", '"online clinic booking"'],
  ["expectedUsers", '"10k / month"'],
  ["data", '"relational, sensitive"'],
  ["availability", '"high"'],
  ["budget", '"early-stage"'],
];

const rules = ["Provider rules", "Architecture rules", "Cost calculator", "Service mapper"];
const files = ["provider.tf", "variables.tf", "main.tf", "outputs.tf", "terraform.tfvars", "README.md"];

const mainTf = [
  ['resource ', '"aws_db_instance" "primary" {'],
  ["  engine         ", '= "postgres"'],
  ["  instance_class ", "= var.db_instance_class"],
  ["  multi_az       ", "= var.high_availability"],
  ["", "}"],
  ["", ""],
  ['resource ', '"aws_ecs_service" "app" {'],
  ["  desired_count  ", "= var.app_replicas"],
  ["", "}"],
];

export function OrbitVisual({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className={s.svg} role="img" aria-label="CloudOrbit figure">
      {/* 0 — plain requirements in */}
      <Scene on={step === 0} label="Business requirements with no provider chosen yet">
        <Text x={24} y={40}>example input · requirements</Text>
        <Box x={24} y={70} w={430} h={260} tone="ghost" />
        <Text x={48} y={112} kind="code">{"{"}</Text>
        {requirement.map(([k, v], i) => (
          <g key={k}>
            <Text x={72} y={146 + i * 32} kind="code" d={i}>
              {`${k}:`}
            </Text>
            <text x={230} y={146 + i * 32} className={`${s.label} ${s.item}`} style={{ "--d": i + 0.5 } as React.CSSProperties}>
              {v}
            </text>
          </g>
        ))}
        <Text x={48} y={312} kind="code" d={6}>{"}"}</Text>
        <rect x={62} y={300} width={9} height={16} className={`${s.pulse} ${s.blink}`} />
        {["AWS", "Azure", "Google Cloud"].map((p, i) => (
          <Box key={p} x={520} y={90 + i * 90} w={256} h={62} label={p} sub="?" tone="ghost" d={3 + i} />
        ))}
        <Text x={24} y={420} kind="sub" d={7}>
          No provider picked. No architecture. No guesses yet.
        </Text>
      </Scene>

      {/* 1 — deterministic engine */}
      <Scene on={step === 1} label="Rules turn requirements into a provider recommendation">
        <Box x={24} y={250} w={160} h={70} label="Requirements" sub="validated" d={0} />
        {rules.map((r, i) => (
          <g key={r}>
            <Wire d={elbow(184, 285, 250, 100 + i * 120 + 30)} delay={i + 1} />
            <Box x={250} y={100 + i * 120} w={220} h={60} label={r} sub={`rules/${i < 2 ? "*-rules.ts" : i === 2 ? "cost-calculator.ts" : "provider-service-map.ts"}`} d={i + 1} />
            <Wire d={elbow(470, 130 + i * 120, 560, 285)} delay={i + 3} pulse={i === 1} dur={2.2} />
          </g>
        ))}
        <Box x={560} y={220} w={216} h={130} tone="signal" d={6} />
        <Text x={578} y={252} kind="signal" d={6}>
          PLAN
        </Text>
        <Text x={578} y={282} kind="label" d={7}>provider + reasoning</Text>
        <Text x={578} y={304} kind="label" d={7}>service breakdown</Text>
        <Text x={578} y={326} kind="label" d={7}>cost range · availability</Text>
        <Text x={24} y={40}>features/planning</Text>
      </Scene>

      {/* 2 — terraform generation */}
      <Scene on={step === 2} label="A saved plan becomes a Terraform project and ZIP">
        <Text x={24} y={40}>generated/</Text>
        {files.map((f, i) => (
          <Text key={f} x={36} y={84 + i * 30} kind={f === "main.tf" ? "signal" : "code"} d={i}>
            {`${i === files.length - 1 ? "└" : "├"}── ${f}`}
          </Text>
        ))}
        <Box x={24} y={290} w={200} h={62} label="plan.zip" sub="download" tone="solid" d={7} />
        <Box x={260} y={60} w={516} h={330} tone="default" d={2} />
        <Text x={280} y={90} kind="sub" d={3}>main.tf · example output</Text>
        {mainTf.map(([a, b], i) => (
          <text key={i} x={280} y={130 + i * 26} className={`${s.code} ${s.item}`} style={{ "--d": 3 + i * 0.5 } as React.CSSProperties}>
            <tspan fill="var(--accent)">{a}</tspan>
            <tspan fill="var(--fg)">{b}</tspan>
          </text>
        ))}
        <Text x={24} y={440} kind="sub" d={8}>
          Never executes Terraform · never generates credentials
        </Text>
      </Scene>

      {/* 3 — scoped assistant */}
      <Scene on={step === 3} label="The assistant answers plan questions and refuses off-topic ones">
        <Text x={24} y={40}>assistant · context: saved plan</Text>
        {[
          { who: "›", text: "Why was AWS recommended here?", tone: "code" as const },
          { who: "←", text: "Your plan needs managed Postgres with high availability.", tone: "label" as const },
          { who: "", text: "The rules scored that layer highest on AWS…", tone: "label" as const },
          { who: "›", text: "Write me a poem about the sea.", tone: "code" as const },
          { who: "←", text: "Out of scope. I only help with cloud architecture.", tone: "signal" as const },
        ].map((l, i) => (
          <g key={i}>
            <Text x={24} y={100 + i * 40 + (i > 2 ? 30 : 0)} kind="sub" d={i * 1.4}>
              {l.who}
            </Text>
            <Text x={48} y={100 + i * 40 + (i > 2 ? 30 : 0)} kind={l.tone} d={i * 1.4}>
              {l.text}
            </Text>
          </g>
        ))}
        {["Plan context", "Scope guard", "Model", "Answer"].map((b, i) => (
          <g key={b}>
            <Box x={24 + i * 192} y={440} w={176} h={60} label={b} tone={i === 1 ? "signal" : "default"} d={6 + i} />
            {i < 3 && <Wire d={`M${200 + i * 192} 470 H${216 + i * 192}`} delay={7 + i} />}
          </g>
        ))}
      </Scene>
    </svg>
  );
}
