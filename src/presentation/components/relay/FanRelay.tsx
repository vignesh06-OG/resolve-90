import { useState } from "react";

import type {
  FanMessage,
  MessageLocale,
} from "../../../domain/entities/decision";
import { Icon } from "../../../shared/components/Icon";
import { LanguageTabs } from "./LanguageTabs";
import { MessagePreview } from "./MessagePreview";

export function FanRelay({
  messages,
}: {
  readonly messages: readonly FanMessage[];
}): React.JSX.Element | null {
  const [locale, setLocale] = useState<MessageLocale>("en");
  const message = messages.find((candidate) => candidate.locale === locale);
  if (message === undefined) return null;
  return (
    <section className="fan-relay" aria-labelledby="fan-relay-title">
      <div className="panel-heading">
        <div>
          <p className="panel-label">Fan relay preview</p>
          <h3 id="fan-relay-title">Controlled-language guidance</h3>
        </div>
        <Icon name="globe" />
      </div>
      <LanguageTabs locale={locale} messages={messages} select={setLocale} />
      <MessagePreview message={message} />
    </section>
  );
}
