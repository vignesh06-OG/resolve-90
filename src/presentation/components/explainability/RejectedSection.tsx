import type { EvaluatedCandidate } from "../../../domain/entities/decision";
import { Icon } from "../../../shared/components/Icon";
import { Badge } from "../../../shared/components/ui";

function RejectedCard({
  candidate,
}: {
  readonly candidate: EvaluatedCandidate;
}): React.JSX.Element {
  return (
    <article className="rejected-card">
      <div className="rejected-card__top">
        <Badge tone="fail">Rejected</Badge>
        <span>{candidate.score}/100 before veto</span>
      </div>
      <h4>{candidate.title}</h4>
      <p>{candidate.strategy}</p>
      <div className="veto-reason">
        <Icon name="warning" size={18} />
        <span>
          <strong>Guardrail veto</strong>
          {candidate.rejectionReason}
        </span>
      </div>
    </article>
  );
}

export function RejectedSection({
  alternatives,
}: {
  readonly alternatives: readonly EvaluatedCandidate[];
}): React.JSX.Element {
  return (
    <div className="rejected-section">
      <div className="rejected-section__heading">
        <div>
          <p className="panel-label">Rejected alternatives</p>
          <h3>Useful generation, unsafe decision</h3>
        </div>
        <p>
          High throughput cannot compensate for an accessibility or safety
          breach.
        </p>
      </div>
      <div className="rejected-grid">
        {alternatives.map((candidate) => (
          <RejectedCard candidate={candidate} key={candidate.id} />
        ))}
      </div>
    </div>
  );
}
