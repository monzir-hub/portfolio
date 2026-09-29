import { Box, Scene, Text, VIEW, Wire, elbow, elbowV } from "./primitives";
import s from "./visuals.module.css";

export function EksVisual({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className={s.svg} role="img" aria-label="EKS on Terraform figure">
      {/* 0 — console clicking */}
      <Scene on={step === 0} label="Manual console steps that can’t be reviewed or repeated">
        {[
          { x: 60, y: 90, r: -4, title: "VPC console", rows: ["Create VPC ›", "Edit CIDR ›", "Tags ›"] },
          { x: 250, y: 170, r: 3, title: "Subnets", rows: ["Create subnet ›", "Pick AZ ›", "Route table ›"] },
          { x: 440, y: 250, r: -2, title: "EKS", rows: ["Create cluster ›", "Attach role ›", "Add nodes ›"] },
        ].map((w, i) => (
          <g key={w.title} className={s.item} style={{ "--d": i * 1.5, rotate: `${w.r}deg`, transformOrigin: `${w.x + 150}px ${w.y + 110}px` } as React.CSSProperties}>
            <rect x={w.x} y={w.y} width={300} height={220} className={s.box_default} />
            <line x1={w.x} x2={w.x + 300} y1={w.y + 36} y2={w.y + 36} stroke="var(--line-strong)" />
            <text x={w.x + 16} y={w.y + 23} className={s.sub}>{w.title}</text>
            {w.rows.map((r, j) => (
              <text key={r} x={w.x + 16} y={w.y + 74 + j * 40} className={s.label}>
                {r}
              </text>
            ))}
          </g>
        ))}
        <g className={s.item} style={{ "--d": 6, rotate: "-8deg", transformOrigin: "560px 540px" } as React.CSSProperties}>
          <rect x={430} y={515} width={300} height={48} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
          <text x={580} y={545} textAnchor="middle" className={s.signal} style={{ fontSize: 14 }}>
            NOT REPRODUCIBLE
          </text>
        </g>
      </Scene>

      {/* 1 — module contracts */}
      <Scene on={step === 1} label="Four Terraform modules passing outputs to each other">
        <Text x={24} y={40}>main.tf</Text>
        <Box x={24} y={260} w={150} h={70} label="vpc" sub="module" d={0} />
        <Box x={232} y={150} w={160} h={70} label="subnet_a" sub="az a" d={1} />
        <Box x={232} y={370} w={160} h={70} label="subnet_b" sub="az b" d={2} />
        <Box x={450} y={260} w={140} h={70} label="eks" sub="control plane" tone="signal" d={3} />
        <Box x={640} y={260} w={140} h={70} label="nodegroup" sub="managed" d={4} />
        <Wire d={elbow(174, 295, 232, 185)} delay={1} pulse />
        <Wire d={elbow(174, 295, 232, 405)} delay={2} pulse />
        <Wire d={elbow(392, 185, 450, 295)} delay={3} />
        <Wire d={elbow(392, 405, 450, 295)} delay={3} />
        <Wire d="M590 295 H640" delay={4} tone="signal" />
        <path d="M312 440 V520 H710 V330" pathLength={1} className={`${s.wire} ${s.wire_default}`} style={{ "--d": 5 } as React.CSSProperties} />
        <Text x={184} y={250} kind="signal" d={2}>vpc_id</Text>
        <Text x={400} y={245} kind="signal" d={4}>subnet_ids</Text>
        <Text x={600} y={285} kind="signal" d={5} anchor="middle">name</Text>
        <Text x={420} y={540} kind="sub" d={6}>subnet_ids  ·  depends_on = [module.eks]</Text>
      </Scene>

      {/* 2 — topology */}
      <Scene on={step === 2} label="A VPC spanning two availability zones with an EKS cluster">
        <Box x={24} y={40} w={752} h={540} tone="ghost" d={0} />
        <Text x={44} y={70} kind="sub" d={0}>vpc · var.vpc_cidr</Text>
        <Box x={200} y={96} w={400} h={64} label="EKS control plane" sub="var.cluster_version" tone="signal" align="middle" d={1} />
        {[0, 1].map((az) => {
          const x = 60 + az * 360;
          return (
            <g key={az}>
              <Box x={x} y={200} w={320} h={350} tone="ghost" d={2 + az} />
              <Text x={x + 18} y={228} kind="sub" d={2 + az}>{`availability zone ${az ? "b" : "a"}`}</Text>
              <Box x={x + 18} y={250} w={284} h={54} label={`subnet_${az ? "b" : "a"}`} sub="var.subnet_cidr" d={3 + az} />
              {[0, 1].map((n) => (
                <Box key={n} x={x + 18 + n * 148} y={340} w={136} h={80} label="node" sub="instance_type" d={4 + az + n} />
              ))}
              <Wire d={elbowV(400, 160, x + 160, 250)} delay={3 + az} pulse dur={2 + az * 0.4} />
            </g>
          );
        })}
        <Text x={60} y={600} kind="sub" d={7}>
          node group · min / desired / max are variables
        </Text>
      </Scene>

      {/* 3 — workload */}
      <Scene on={step === 3} label="A Flask and MongoDB app running as Kubernetes deployments">
        <Text x={24} y={40}>kubectl apply -f k8s.yaml</Text>
        <Box x={24} y={80} w={200} h={62} label="Browser" sub="minikube ip" d={0} />
        <Wire d="M224 111 H300" delay={1} pulse dur={1.6} />
        <Box x={300} y={80} w={220} h={62} label="Service" sub="NodePort :30080" tone="signal" d={1} />
        <Wire d={elbowV(410, 142, 300, 220)} delay={2} />
        <Wire d={elbowV(410, 142, 520, 220)} delay={2} />
        <Box x={200} y={220} w={200} h={80} label="flask pod" sub="deployment" d={3} />
        <Box x={420} y={220} w={200} h={80} label="flask pod" sub="deployment" d={3.5} />
        <Wire d={elbowV(300, 300, 410, 380)} delay={4} />
        <Wire d={elbowV(520, 300, 410, 380)} delay={4} pulse dur={2.4} />
        <Box x={300} y={380} w={220} h={62} label="Service" sub="ClusterIP · internal" d={5} />
        <Wire d="M410 442 V490" delay={6} />
        <Box x={300} y={490} w={220} h={70} label="mongo" sub="deployment" tone="solid" d={6} />
        <Text x={640} y={250} kind="sub" d={7}>stateless · scalable</Text>
        <Text x={540} y={530} kind="sub" d={7}>not exposed publicly</Text>
      </Scene>
    </svg>
  );
}
