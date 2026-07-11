import "../styles/evidence.css";

import { EvidencePageHeader } from "../components/EvidencePageHeader";
import { Icon, type IconName } from "../../shared/components/Icon";
import { QUALITY_REPORT } from "../../generated/qualityReport";

interface AuditCategory {
  readonly title: string;
  readonly icon: IconName;
  readonly checks: readonly string[];
}

const categories: readonly AuditCategory[] = [
  {
    title: "Perceivable",
    icon: "evidence",
    checks: [
      "Semantic text alternatives",
      "4.5:1 text contrast tokens",
      "200% zoom + 320 px reflow",
      "Text equivalent for every metric",
    ],
  },
  {
    title: "Operable",
    icon: "code",
    checks: [
      "Skip link and landmarks",
      "Keyboard-complete approval path",
      "Visible focus indicator",
      "Reduced motion and 44 px primary targets",
    ],
  },
  {
    title: "Understandable",
    icon: "globe",
    checks: [
      "Declared page and message languages",
      "No unexpected context changes",
      "Native form errors",
      "Modeled and replay labels stay visible",
    ],
  },
  {
    title: "Robust",
    icon: "access",
    checks: [
      "Native names, roles, and states",
      "Status live region",
      "Arrow-key language tabs",
      "axe-core component scan",
    ],
  },
];

const auditRows = [
  [
    "1.1.1 Text alternatives",
    "Decorative SVGs are aria-hidden; no information-only images",
    "Pass",
  ],
  [
    "1.3.1 Info and relationships",
    "Landmarks, lists, fieldsets, table headers, ordered headings",
    "Pass",
  ],
  [
    "1.4.3 Contrast",
    "Dark and paper palettes checked against AA token targets",
    "Pass",
  ],
  [
    "1.4.10 Reflow",
    "Single-column breakpoints; no two-axis content requirement at 320 px",
    "Pass",
  ],
  [
    "2.1.1 Keyboard",
    "Compile, review, acknowledgement, approval, and locale tabs",
    "Pass",
  ],
  ["2.4.1 Bypass blocks", "First-focus skip link targets main content", "Pass"],
  [
    "2.4.3 Focus order",
    "Route main focus and post-approval relay focus",
    "Pass",
  ],
  ["2.4.7 Focus visible", "3 px amber outline with 3 px offset", "Pass"],
  [
    "2.5.8 Target size",
    "Primary controls ≥44 px; compact controls ≥24 px",
    "Pass",
  ],
  ["3.1.2 Language of parts", "Fan message panel sets en, es, or fr", "Pass"],
  [
    "3.3.2 Labels or instructions",
    "Two required acknowledgements have persistent text",
    "Pass",
  ],
  [
    "4.1.2 Name, role, value",
    "Native controls and complete ARIA tab state",
    "Pass",
  ],
  [
    "Assistive technology",
    "Desktop + mobile screen-reader check on hosted build",
    "Deployment gate",
  ],
] as const;

export default function AccessibilityPage(): React.JSX.Element {
  const audit = QUALITY_REPORT.accessibility;
  const complete = audit.status === "pass";

  return (
    <div className="page-shell">
      <EvidencePageHeader
        eyebrow="Evaluation evidence · accessibility"
        title="Accessibility is a UI standard—and an operational veto."
        summary="Resolve 90 targets WCAG 2.2 AA in the interface while enforcing a separate domain rule: no recommended plan may reduce step-free route capacity below 90%."
        status={
          complete
            ? "Automated + code audit complete"
            : "Final audit in progress"
        }
        tone={complete ? "pass" : "warn"}
      />

      <section
        className="content-section"
        aria-labelledby="audit-summary-title"
      >
        <div className="section-intro">
          <div>
            <p className="section-kicker">Accessibility audit result</p>
            <h2 id="audit-summary-title">
              Automated scan plus WCAG code review
            </h2>
          </div>
          <p>
            Automated tools catch only a subset of barriers. Deployment-only
            human and assistive-technology checks remain explicit.
          </p>
        </div>
        <div className="audit-summary">
          <div className="audit-score">
            <strong>{audit.lighthouseScore ?? "—"}</strong>
            <span>
              {complete
                ? `Lighthouse · ${audit.automatedChecks} automated checks`
                : "final scan pending"}
            </span>
          </div>
          <div className="audit-categories">
            {categories.map(({ title, icon, checks }) => (
              <article className="audit-category" key={title}>
                <div className="audit-category__top">
                  <h3>{title}</h3>
                  <Icon name={icon} />
                </div>
                <ul>
                  {checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section" aria-labelledby="wcag-title">
        <div className="section-intro">
          <div>
            <p className="section-kicker">WCAG 2.2 AA evidence</p>
            <h2 id="wcag-title">Criterion-level audit trail</h2>
          </div>
          <code className="command-chip">npm run test:accessibility</code>
        </div>
        <div className="evidence-table-wrap">
          <table className="evidence-table">
            <caption className="visually-hidden">
              WCAG 2.2 accessibility audit results
            </caption>
            <thead>
              <tr>
                <th scope="col">Criterion</th>
                <th scope="col">Evidence</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {auditRows.map(([criterion, evidence, result]) => (
                <tr key={criterion}>
                  <td>{criterion}</td>
                  <td>{evidence}</td>
                  <td>
                    <span
                      className={`status-pill status-pill--${result === "Pass" ? "pass" : "warn"}`}
                    >
                      {result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-section" aria-labelledby="fixes-title">
        <div className="section-intro">
          <div>
            <p className="section-kicker">Audit fixes surfaced</p>
            <h2 id="fixes-title">What the audit changed</h2>
          </div>
        </div>
        <div className="boundary-rules">
          <article>
            <Icon name="code" />
            <h3>Complete tab semantics</h3>
            <p>
              Language tabs now support Left, Right, Home, and End keys in
              addition to click and Tab.
            </p>
          </article>
          <article>
            <Icon name="route" />
            <h3>Predictable focus</h3>
            <p>
              Route changes move focus to main; approval moves focus to the
              newly unlocked relay heading.
            </p>
          </article>
          <article>
            <Icon name="warning" />
            <h3>No color-only state</h3>
            <p>
              Every pass, warning, rejection, and live state has text,
              iconography, or both.
            </p>
          </article>
        </div>
      </section>

      <aside className="audit-note">
        <Icon name="access" />
        <p>
          <strong>Operational distinction:</strong> an accessible web interface
          does not certify a physical route. Before deployment, disabled fans
          and venue accessibility specialists must validate the configured route
          graph, signage, lifts, surfaces, and fallback procedures.
        </p>
      </aside>
    </div>
  );
}
