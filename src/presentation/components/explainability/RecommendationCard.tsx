import type { EvaluatedCandidate } from "../../../domain/entities/decision";
import { Icon } from "../../../shared/components/Icon";

const CONFIDENCE_PERCENT = { low: 34, medium: 67, high: 100 } as const;

function ConfidenceMeter({
  candidate,
}: {
  readonly candidate: EvaluatedCandidate;
}): React.JSX.Element {
  const value = CONFIDENCE_PERCENT[candidate.confidence];
  return (
    <div className="confidence-visual">
      <div className="confidence-visual__label">
        <span>Calibrated confidence</span>
        <strong>{value}%</strong>
      </div>
      <div
        className="confidence-meter"
        role="progressbar"
        aria-label="AI recommendation confidence"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${candidate.confidence} confidence`}
      >
        <span
          className={`confidence-meter__fill confidence-meter__fill--${candidate.confidence}`}
        />
      </div>
    </div>
  );
}

function RecommendationMetadata({
  candidate,
}: {
  readonly candidate: EvaluatedCandidate;
}): React.JSX.Element {
  return (
    <dl className="explainability-meta">
      <div>
        <dt>Confidence</dt>
        <dd className="text-amber">{candidate.confidence}</dd>
      </div>
      <div>
        <dt>Grounded sources</dt>
        <dd>{candidate.evidenceIds.length}</dd>
      </div>
      <div>
        <dt>Owned actions</dt>
        <dd>{candidate.actions.length}</dd>
      </div>
    </dl>
  );
}

export function RecommendationCard({
  candidate,
}: {
  readonly candidate: EvaluatedCandidate;
}): React.JSX.Element {
  return (
    <article className="reasoning-card">
      <p className="panel-label">Recommendation</p>
      <h3>{candidate.title}</h3>
      <p>{candidate.strategy}</p>
      <div className="reasoning-block">
        <p className="panel-label">Reasoning</p>
        <p>{candidate.rationale}</p>
      </div>
      <RecommendationMetadata candidate={candidate} />
      <ConfidenceMeter candidate={candidate} />
      <p className="confidence-note">
        <Icon name="warning" size={17} /> Confidence cannot be “high” until the
        stale Blue Line headway is reconfirmed.
      </p>
    </article>
  );
}
