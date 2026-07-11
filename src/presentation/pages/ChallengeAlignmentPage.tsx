import "../styles/evidence.css";

import { EvidencePageHeader } from "../components/EvidencePageHeader";
import { AlignmentTable } from "./alignment/AlignmentSections";

export default function ChallengeAlignmentPage(): React.JSX.Element {
  return (
    <div className="page-shell">
      <EvidencePageHeader
        eyebrow="Evaluation evidence · problem alignment"
        title="Nothing in the brief is implicit."
        summary="Every challenge term maps to product behavior, inspectable implementation, visible proof, and measurable operational outcome."
        status="17 / 17 terms mapped"
      />
      <AlignmentTable />
    </div>
  );
}
