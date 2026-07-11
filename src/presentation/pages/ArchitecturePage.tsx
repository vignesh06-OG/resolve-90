import "../styles/evidence.css";

import { EvidencePageHeader } from "../components/EvidencePageHeader";
import {
  AiBoundary,
  ArchitectureLayers,
  FailureAndScale,
  SolidRules,
} from "./architecture/ArchitectureSections";

export default function ArchitecturePage(): React.JSX.Element {
  return (
    <div className="page-shell">
      <EvidencePageHeader
        eyebrow="Evaluation evidence · architecture"
        title="AI outside. Safety inside."
        summary="A clean modular monolith keeps provider uncertainty at the edge and deterministic invariants in a testable domain core."
        status="4 explicit dependency boundaries"
      />
      <ArchitectureLayers />
      <AiBoundary />
      <SolidRules />
      <FailureAndScale />
    </div>
  );
}
