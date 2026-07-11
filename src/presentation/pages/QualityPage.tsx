import "../styles/evidence.css";

import { QUALITY_REPORT } from "../../generated/qualityReport";
import { EvidencePageHeader } from "../components/EvidencePageHeader";
import { QualityDashboard } from "./quality/QualityDashboard";
import { EvidenceIntegrity, PipelineSection } from "./quality/QualitySections";

export default function QualityPage(): React.JSX.Element {
  const verifiedAt = new Date(QUALITY_REPORT.generatedAt).toLocaleString("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return (
    <div className="page-shell">
      <EvidencePageHeader
        eyebrow="Evaluation evidence · quality"
        title="Quality, made observable."
        summary="Every value below is generated from machine-readable Vitest, coverage, Playwright, bundle, Lighthouse, and dependency-audit reports."
        status={`Generated ${verifiedAt} · ${QUALITY_REPORT.commit}`}
      />
      <QualityDashboard />
      <PipelineSection />
      <EvidenceIntegrity />
    </div>
  );
}
