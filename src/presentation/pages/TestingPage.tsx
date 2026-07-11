import "../styles/evidence.css";

import { QUALITY_REPORT } from "../../generated/qualityReport";
import { EvidencePageHeader } from "../components/EvidencePageHeader";
import {
  CoverageEvidence,
  SuiteInventory,
  TestingCaveat,
  TestPyramid,
} from "./testing/TestingSections";

export default function TestingPage(): React.JSX.Element {
  return (
    <div className="page-shell">
      <EvidencePageHeader
        eyebrow="Evaluation evidence · testing"
        title="Test the decision, not the screenshot."
        summary="Tests attack operational invariants: accessibility outranks throughput, stale evidence limits confidence, and relay requires human approval."
        status={`${QUALITY_REPORT.tests.passed} / ${QUALITY_REPORT.tests.total} automated checks passing`}
      />
      <TestPyramid />
      <SuiteInventory />
      <CoverageEvidence />
      <TestingCaveat />
    </div>
  );
}
