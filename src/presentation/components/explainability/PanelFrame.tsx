import type {
  EvaluatedCandidate,
  GenerationReceipt,
} from "../../../domain/entities/decision";
import { Icon } from "../../../shared/components/Icon";

export function ExplainabilityHeader({
  candidate,
}: {
  readonly candidate: EvaluatedCandidate;
}): React.JSX.Element {
  return (
    <header className="explainability-panel__header">
      <div>
        <p className="section-kicker">
          <Icon name="spark" size={16} /> AI explainability panel
        </p>
        <h2 id="explainability-title">
          What the model proposed. What code allowed.
        </h2>
      </div>
      <div className="explainability-score">
        <span>{candidate.score}</span>
        <small>/ 100 guarded plan score</small>
      </div>
    </header>
  );
}

export function GenerationReceiptView({
  receipt,
}: {
  readonly receipt: GenerationReceipt;
}): React.JSX.Element {
  return (
    <footer className="generation-receipt">
      <Icon name="evidence" />
      <div>
        <strong>Generation provenance</strong>
        <span>
          {receipt.mode} · {receipt.model} · prompt {receipt.promptVersion}
        </span>
      </div>
      <span>{receipt.note}</span>
    </footer>
  );
}
