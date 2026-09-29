import type { VisualKind } from "@/content/projects";
import { DocuVisual } from "./visuals/DocuVisual";
import { EksVisual } from "./visuals/EksVisual";
import { OrbitVisual } from "./visuals/OrbitVisual";
import { ShifaVisual } from "./visuals/ShifaVisual";

const registry: Record<VisualKind, (p: { step: number }) => React.ReactElement> = {
  shifa: ShifaVisual,
  orbit: OrbitVisual,
  eks: EksVisual,
  docu: DocuVisual,
};

export function ProjectVisual({ kind, step }: { kind: VisualKind; step: number }) {
  const Visual = registry[kind];
  // Technical figures read left to right in either language.
  return (
    <div dir="ltr" style={{ display: "contents" }}>
      <Visual step={step} />
    </div>
  );
}
