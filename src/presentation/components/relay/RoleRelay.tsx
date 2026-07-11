import type { PlanAction } from "../../../domain/entities/decision";
import { Badge } from "../../../shared/components/ui";

function RoleAction({
  action,
}: {
  readonly action: PlanAction;
}): React.JSX.Element {
  return (
    <li>
      <span className="role-relay__time">+{action.dueInSeconds}s</span>
      <div>
        <strong>{action.owner}</strong>
        <span>{action.location}</span>
        <p>{action.instruction}</p>
      </div>
      <Badge tone="pass">Ready</Badge>
    </li>
  );
}

export function RoleRelay({
  actions,
}: {
  readonly actions: readonly PlanAction[];
}): React.JSX.Element {
  return (
    <section className="role-relay" aria-labelledby="role-relay-title">
      <div className="panel-heading">
        <div>
          <p className="panel-label">Staff + volunteer relay</p>
          <h3 id="role-relay-title">Owned micro-briefs</h3>
        </div>
        <span>{actions.length} recipients</span>
      </div>
      <ol>
        {actions.map((action) => (
          <RoleAction action={action} key={action.id} />
        ))}
      </ol>
    </section>
  );
}
