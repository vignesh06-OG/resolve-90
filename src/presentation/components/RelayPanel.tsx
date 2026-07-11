import { useState, type KeyboardEvent } from "react";

import type {
  ApprovedDecision,
  MessageLocale,
} from "../../domain/entities/decision";
import { Icon } from "../../shared/components/Icon";

interface RelayPanelProps {
  readonly decision: ApprovedDecision;
}

export function RelayPanel({
  decision,
}: RelayPanelProps): React.JSX.Element | null {
  const [locale, setLocale] = useState<MessageLocale>("en");
  const message = decision.selected.messages.find(
    (candidate) => candidate.locale === locale,
  );

  if (message === undefined) return null;

  function handleTabKey(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void {
    const count = decision.selected.messages.length;
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % count;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + count) % count;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = count - 1;
    if (nextIndex === null) return;

    const next = decision.selected.messages[nextIndex];
    if (next === undefined) return;
    event.preventDefault();
    setLocale(next.locale);
    document
      .querySelector<HTMLElement>(`#language-tab-${next.locale}`)
      ?.focus();
  }

  return (
    <section className="relay-panel" aria-labelledby="relay-title">
      <header className="relay-panel__header">
        <div>
          <p className="section-kicker">
            <Icon name="check" size={16} /> Approved · relay unlocked
          </p>
          <h2 id="relay-title" tabIndex={-1}>
            One plan, adapted to every role and fan.
          </h2>
        </div>
        <span className="status-pill status-pill--pass">
          Audit receipt written
        </span>
      </header>

      <div className="relay-grid">
        <section className="role-relay" aria-labelledby="role-relay-title">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Staff + volunteer relay</p>
              <h3 id="role-relay-title">Owned micro-briefs</h3>
            </div>
            <span>{decision.selected.actions.length} recipients</span>
          </div>
          <ol>
            {decision.selected.actions.map((action) => (
              <li key={action.id}>
                <span className="role-relay__time">
                  +{action.dueInSeconds}s
                </span>
                <div>
                  <strong>{action.owner}</strong>
                  <span>{action.location}</span>
                  <p>{action.instruction}</p>
                </div>
                <span className="status-pill status-pill--pass">Ready</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="fan-relay" aria-labelledby="fan-relay-title">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Fan relay preview</p>
              <h3 id="fan-relay-title">Controlled-language guidance</h3>
            </div>
            <Icon name="globe" />
          </div>
          <div
            className="language-tabs"
            role="tablist"
            aria-label="Message language"
          >
            {decision.selected.messages.map((candidate, index) => (
              <button
                type="button"
                role="tab"
                id={`language-tab-${candidate.locale}`}
                aria-controls={`language-panel-${candidate.locale}`}
                aria-selected={locale === candidate.locale}
                tabIndex={locale === candidate.locale ? 0 : -1}
                key={candidate.locale}
                onClick={() => setLocale(candidate.locale)}
                onKeyDown={(event) => handleTabKey(event, index)}
              >
                {candidate.localeLabel}
              </button>
            ))}
          </div>
          <article
            className="message-preview"
            id={`language-panel-${message.locale}`}
            role="tabpanel"
            lang={message.locale}
            aria-labelledby={`language-tab-${message.locale}`}
          >
            <p className="message-preview__channel">Venue app + ribbon board</p>
            <h4>{message.headline}</h4>
            <p>{message.body}</p>
            <div className="accessible-message">
              <Icon name="access" />
              <p>
                <strong>Step-free alternative</strong>
                {message.accessibleAlternative}
              </p>
            </div>
            <p className="review-state">
              <Icon
                name={message.humanReviewRequired ? "warning" : "check"}
                size={16}
              />
              {message.humanReviewRequired
                ? "Native-language human review required before live broadcast"
                : "Controlled English source message verified"}
            </p>
          </article>
        </section>
      </div>

      <aside className="audit-receipt" aria-label="Approval audit receipt">
        <span className="audit-receipt__icon">
          <Icon name="evidence" />
        </span>
        <div>
          <p className="panel-label">Immutable audit-port receipt</p>
          <strong>{decision.auditEvent.summary}</strong>
        </div>
        <dl>
          <div>
            <dt>Receipt</dt>
            <dd>{decision.auditEvent.id.slice(0, 18)}…</dd>
          </div>
          <div>
            <dt>Approved</dt>
            <dd>
              <time dateTime={decision.approvedAt}>
                {new Date(decision.approvedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </time>
            </dd>
          </div>
          <div>
            <dt>Provenance</dt>
            <dd>{decision.receipt.mode} · human-approved</dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}
