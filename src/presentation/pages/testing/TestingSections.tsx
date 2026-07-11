import { QUALITY_REPORT } from "../../../generated/qualityReport";
import { Icon } from "../../../shared/components/Icon";
import { Badge } from "../../../shared/components/ui";

const SUITES = [
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
const PYRAMID = [
  [
    "3",
    "End-to-end",
    "Keyboard critical path + route smoke",
    "playwright",
    "e2e",
  ],
  [
    "2",
    "Integration + component",
    "Ports, workflow, rendering, axe",
    "testing-library",
    "integration",
  ],
  [
    "1",
    "Pure domain unit tests",
    "Hard constraints and typed failure states",
    "vitest",
    "unit",
  ],
] as const;
const COVERAGE = [
  ["Lines", `${QUALITY_REPORT.coverage.lines}%`, "Gate ≥80%"],
  ["Functions", `${QUALITY_REPORT.coverage.functions}%`, "Gate ≥80%"],
  ["Branches", `${QUALITY_REPORT.coverage.branches}%`, "Gate ≥75%"],
  ["Tests", String(QUALITY_REPORT.tests.total), "0 failing"],
] as const;

function PyramidLayer({
  layer,
}: {
  readonly layer: (typeof PYRAMID)[number];
}): React.JSX.Element {
  const [number, title, detail, tool, kind] = layer;
  return (
    <div className={`test-pyramid__layer test-pyramid__layer--${kind}`}>
      <span>{number}</span>
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
      <code>{tool}</code>
    </div>
  );
}

export function TestPyramid(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="pyramid-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">Test architecture</p>
          <h2 id="pyramid-title">Fast safety kernel, thin critical-path E2E</h2>
        </div>
        <p>
          Static evidence pages are route-smoked; safety-critical branches
          receive direct unit coverage.
        </p>
      </div>
      <div className="test-pyramid" aria-label="Testing pyramid">
        {PYRAMID.map((layer) => (
          <PyramidLayer key={layer[0]} layer={layer} />
        ))}
      </div>
    </section>
  );
}

function SuiteRow({
  suite,
}: {
  readonly suite: (typeof SUITES)[number];
}): React.JSX.Element {
  const [name, behavior, tool, gate] = suite;
  return (
    <tr>
      <td>{name}</td>
      <td>{behavior}</td>
      <td>{tool}</td>
      <td>
        <Badge tone="pass">
          <Icon name="check" size={13} />
          {gate}
        </Badge>
      </td>
    </tr>
  );
}

function SuiteTable(): React.JSX.Element {
  return (
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
          {SUITES.map((suite) => (
            <SuiteRow key={suite[0]} suite={suite} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SuiteInventory(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="inventory-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">Verification inventory</p>
          <h2 id="inventory-title">Every evaluation layer has evidence</h2>
        </div>
        <code className="command-chip">npm run test:coverage</code>
      </div>
      <SuiteTable />
    </section>
  );
}

export function CoverageEvidence(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="coverage-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">Coverage evidence</p>
          <h2 id="coverage-title">Thresholds are blocking, not aspirational</h2>
        </div>
        <p>
          Static routes are excluded from percentage gaming and covered by route
          checks.
        </p>
      </div>
      <div className="coverage-grid">
        {COVERAGE.map(([label, value, gate]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
            <small>{gate}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TestingCaveat(): React.JSX.Element {
  return (
    <aside className="audit-note">
      <Icon name="evidence" />
      <p>
        <strong>Evidence scope:</strong> automated checks reduce risk but do not
        certify venue configuration, translations, physical routes, or operator
        exercises.
      </p>
    </aside>
  );
}
