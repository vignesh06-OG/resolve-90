import type { FanMessage } from "../../../domain/entities/decision";
import { Icon } from "../../../shared/components/Icon";

const REVIEW_ICON = { true: "warning", false: "check" } as const;
const REVIEW_TEXT = {
  true: "Native-language human review required before live broadcast",
  false: "Controlled English source message verified",
} as const;

function ReviewState({
  required,
}: {
  readonly required: boolean;
}): React.JSX.Element {
  const key = String(required) as "true" | "false";
  return (
    <p className="review-state">
      <Icon name={REVIEW_ICON[key]} size={16} />
      {REVIEW_TEXT[key]}
    </p>
  );
}

export function MessagePreview({
  message,
}: {
  readonly message: FanMessage;
}): React.JSX.Element {
  return (
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
      <ReviewState required={message.humanReviewRequired} />
    </article>
  );
}
