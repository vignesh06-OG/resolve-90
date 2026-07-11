import type { PlanAction } from "../../domain/entities/decision";
import { Icon } from "../../shared/components/Icon";
import { SectionHeader } from "../../shared/components/ui";

function ActionMeta({
  action,
}: {
  readonly action: PlanAction;
}): React.JSX.Element {
  return (
    <div className="action-list__meta">
      <span>{action.owner}</span>
      <span>
        <Icon name="clock" size={15} /> by +{action.dueInSeconds}s
      </span>
      <span>
        <Icon name="route" size={15} /> {action.location}
      </span>
    </div>
  );
}

function ActionDetails({
  action,
}: {
  readonly action: PlanAction;
}): React.JSX.Element {
  return (
    <details>
      <summary>Fallback and evidence</summary>
      <div>
        <p>
          <strong>Fallback:</strong> {action.fallback}
        </p>
        <p>
          <strong>Evidence:</strong> {action.evidenceIds.join(", ")}
        </p>
      </div>
    </details>
  );
}

function ActionItem({
  action,
}: {
  readonly action: PlanAction;
}): React.JSX.Element {
  return (
    <li>
      <div className="action-list__sequence" aria-hidden="true">
        {String(action.sequence).padStart(2, "0")}
      </div>
      <article className="action-list__card">
        <ActionMeta action={action} />
        <h3>{action.instruction}</h3>
        <ActionDetails action={action} />
      </article>
    </li>
  );
}

export function ActionTimeline({
  actions,
}: {
  readonly actions: readonly PlanAction[];
}): React.JSX.Element {
  return (
    <section className="action-timeline" aria-labelledby="actions-title">
      <SectionHeader
        kicker="Executable response packet"
        title="Six owners. Seventy seconds. One sequence."
        titleId="actions-title"
        summary="Every action includes a place, deadline, evidence, and a safe fallback."
      />
      <ol className="action-list">
        {actions.map((action) => (
          <ActionItem action={action} key={action.id} />
        ))}
      </ol>
    </section>
  );
}
