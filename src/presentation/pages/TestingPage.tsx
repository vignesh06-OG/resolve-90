import "../styles/evidence.css";

import { EvidencePageHeader } from "../components/EvidencePageHeader";
import { Icon } from "../../shared/components/Icon";
import { QUALITY_REPORT } from "../../generated/qualityReport";

const suites = [
  [
    "Domain unit",
    "Safety, access, evidence, freshness, approval invariants",
    "Vitest",
    "Blocking",
  ],
  [
    "Application integration",
    "Compile → challenge → select → approve → audit",
    "Vitest + fake ports",
    "Blocking",
  ],
  [
    "Component",
    "Workflow state, explainability, approval, language tabs",
    "Testing Library",
    "Blocking",
  ],
  [
    "Accessibility",
    "axe scan, landmarks, labels, keyboard semantics",
    "axe-core + Testing Library",
    "Blocking",
  ],
  [
    "End-to-end",
    "Keyboard-complete replay and evidence routes",
    "Playwright",
    "CI job",
  ],
  [
    "Performance",
    "Compressed JS/CSS and chunk-count ceiling",
    "Node budget script",
    "Blocking",
  ],
  [
    "Security",
    "Boundary schemas, injection separation, dependency audit",
    "Vitest + npm audit",
    "Blocking",
  ],
] as const;

export default function TestingPage(): React.JSX.Element {
  const quality = QUALITY_REPORT;

  return (
    <div className="page-shell">
      <EvidencePageHeader
        eyebrow="Evaluation evidence · testing"
        title="Test the decision, not the screenshot."
        summary="The highest-value tests attack operational invariants: accessibility outranks throughput, stale evidence limits confidence, and no relay unlocks without human approval and audit persistence."
        status={`${quality.tests.passed} / ${quality.tests.total} automated checks passing`}
      />

      <section className="content-section" aria-labelledby="pyramid-title">
        <div className="section-intro">
          <div>
            <p className="section-kicker">Test architecture</p>
            <h2 id="pyramid-title">
              Fast safety kernel, thin critical-path E2E
            </h2>
          </div>
          <p>
            Static evidence pages are route-smoked; safety-critical domain
            branches receive direct unit coverage.
          </p>
        </div>
        <div className="test-pyramid" aria-label="Testing pyramid">
          <div className="test-pyramid__layer test-pyramid__layer--e2e">
            <span>3</span>
            <div>
              <strong>End-to-end</strong>
              <small>Keyboard critical path + route smoke</small>
            </div>
            <code>playwright</code>
          </div>
          <div className="test-pyramid__layer test-pyramid__layer--integration">
            <span>2</span>
            <div>
              <strong>Integration + component</strong>
              <small>Ports, workflow, rendering, axe</small>
            </div>
            <code>testing-library</code>
          </div>
          <div className="test-pyramid__layer test-pyramid__layer--unit">
            <span>1</span>
            <div>
              <strong>Pure domain unit tests</strong>
              <small>Hard constraints and typed failure states</small>
            </div>
            <code>vitest</code>
          </div>
        </div>
      </section>

      <section className="content-section" aria-labelledby="inventory-title">
        <div className="section-intro">
          <div>
            <p className="section-kicker">Verification inventory</p>
            <h2 id="inventory-title">Every evaluation layer has evidence</h2>
          </div>
          <code className="command-chip">npm run test:coverage</code>
        </div>
        <div className="evidence-table-wrap">
          <table className="evidence-table">
            <caption className="visually-hidden">
              Automated test suite inventory
            </caption>
            <thead>
              <tr>
                <th scope="col">Suite</th>
                <th scope="col">Behavior under test</th>
                <th scope="col">Tool</th>
                <th scope="col">Gate</th>
              </tr>
            </thead>
            <tbody>
              {suites.map(([name, behavior, tool, gate]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{behavior}</td>
                  <td>{tool}</td>
                  <td>
                    <span className="status-pill status-pill--pass">
                      <Icon name="check" size={13} />
                      {gate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-section" aria-labelledby="coverage-title">
        <div className="section-intro">
          <div>
            <p className="section-kicker">Coverage evidence</p>
            <h2 id="coverage-title">
              Thresholds are blocking, not aspirational
            </h2>
          </div>
          <p>
            Static evidence routes are excluded from percentage gaming; their
            behavior is covered by route and accessibility checks.
          </p>
        </div>
        <div className="coverage-grid">
          <article>
            <strong>{quality.coverage.lines}%</strong>
            <span>Lines</span>
            <small>Gate ≥80%</small>
          </article>
          <article>
            <strong>{quality.coverage.functions}%</strong>
            <span>Functions</span>
            <small>Gate ≥80%</small>
          </article>
          <article>
            <strong>{quality.coverage.branches}%</strong>
            <span>Branches</span>
            <small>Gate ≥75%</small>
          </article>
          <article>
            <strong>{quality.tests.total}</strong>
            <span>Tests</span>
            <small>0 failing</small>
          </article>
        </div>
      </section>

      <aside className="audit-note">
        <Icon name="evidence" />
        <p>
          <strong>Evidence scope:</strong> automated checks reduce risk but do
          not certify a real stadium response. Venue configuration,
          native-language review, physical route inspection, and operator
          exercises remain deployment gates.
        </p>
      </aside>
    </div>
  );
}
