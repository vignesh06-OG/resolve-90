import type { IncidentContext } from "../../domain/entities/incident";
import { QUALITY_REPORT } from "../../generated/qualityReport";
import { AppLink } from "../../shared/components/AppLink";
import { Icon, type IconName } from "../../shared/components/Icon";

interface EvidenceLinkData {
  readonly href: string;
  readonly icon: IconName;
  readonly value: string;
  readonly label: string;
}

const EVIDENCE_LINKS: readonly EvidenceLinkData[] = [
  {
    href: "/quality",
    icon: "test",
    value: `${QUALITY_REPORT.tests.passed} checks`,
    label: "Testing evidence",
  },
  {
    href: "/architecture",
    icon: "code",
    value: "Strict TypeScript",
    label: "Architecture evidence",
  },
  {
    href: "/challenge-alignment",
    icon: "evidence",
    value: "17 / 17 mapped",
    label: "Challenge alignment",
  },
];

export function TrustLine(): React.JSX.Element {
  return (
    <div className="trust-line" aria-label="Product guardrails">
      <span>
        <Icon name="shield" size={16} /> Human approval required
      </span>
      <span>
        <Icon name="access" size={16} /> Accessibility can veto
      </span>
      <span>
        <Icon name="lock" size={16} /> No personal tracking
      </span>
    </div>
  );
}

function EvidenceLink({
  data,
}: {
  readonly data: EvidenceLinkData;
}): React.JSX.Element {
  return (
    <AppLink href={data.href} aria-label={`${data.value} ${data.label}`}>
      <Icon name={data.icon} size={17} />
      <span>
        <strong>{data.value}</strong>
        <small>{data.label}</small>
      </span>
    </AppLink>
  );
}

export function HeroEvidence(): React.JSX.Element {
  return (
    <nav className="hero-evidence" aria-label="Verified engineering evidence">
      {EVIDENCE_LINKS.map((data) => (
        <EvidenceLink data={data} key={data.href} />
      ))}
    </nav>
  );
}

function IncidentStats({
  incident,
}: {
  readonly incident: IncidentContext;
}): React.JSX.Element {
  return (
    <dl className="incident-stats">
      <div>
        <dt>Pressure</dt>
        <dd>
          {incident.baseline.peakPressureRatio.toFixed(2)}{" "}
          <small>
            / {incident.constraints.maximumPressureRatio.toFixed(2)} limit
          </small>
        </dd>
      </div>
      <div>
        <dt>People affected</dt>
        <dd>{incident.affectedPeople.toLocaleString()}</dd>
      </div>
      <div>
        <dt>Step-free path</dt>
        <dd className="incident-stats__risk">At risk</dd>
      </div>
    </dl>
  );
}

function SignalList({
  incident,
}: {
  readonly incident: IncidentContext;
}): React.JSX.Element {
  return (
    <ul className="signal-list" aria-label="Critical incident signals">
      {incident.signals.slice(0, 4).map((signal) => (
        <li key={signal.id}>
          <span className={`signal-dot signal-dot--${signal.severity}`} />
          <span>{signal.label}</span>
          <strong>{signal.value}</strong>
        </li>
      ))}
    </ul>
  );
}

export function IncidentCard({
  incident,
}: {
  readonly incident: IncidentContext;
}): React.JSX.Element {
  return (
    <article className="incident-card" aria-labelledby="incident-title">
      <div className="incident-card__top">
        <div>
          <span className="live-label">
            <span aria-hidden="true" /> Synthetic incident replay
          </span>
          <p>{incident.code} · 18:42:10 local</p>
        </div>
        <span className="severity-badge">Critical</span>
      </div>
      <h2 id="incident-title">{incident.title}</h2>
      <p>{incident.summary}</p>
      <IncidentStats incident={incident} />
      <SignalList incident={incident} />
      <p className="incident-card__source">
        Synthetic aggregate signals · no person-level data
      </p>
    </article>
  );
}
