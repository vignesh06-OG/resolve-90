import type { KeyboardEvent } from "react";

import type {
  FanMessage,
  MessageLocale,
} from "../../../domain/entities/decision";

const INDEX_FOR_KEY: Readonly<
  Record<string, (index: number, count: number) => number>
> = {
  ArrowRight: (index, count) => (index + 1) % count,
  ArrowLeft: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_, count) => count - 1,
};

function nextLocale(
  key: string,
  index: number,
  messages: readonly FanMessage[],
): MessageLocale | null {
  const indexStrategy = INDEX_FOR_KEY[key];
  if (indexStrategy === undefined) return null;
  return messages[indexStrategy(index, messages.length)]?.locale ?? null;
}

interface TabButtonProps {
  readonly message: FanMessage;
  readonly selected: boolean;
  readonly navigate: (event: KeyboardEvent<HTMLButtonElement>) => void;
  readonly select: (locale: MessageLocale) => void;
}

function TabButton({
  message,
  selected,
  navigate,
  select,
}: TabButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      role="tab"
      id={`language-tab-${message.locale}`}
      aria-controls={`language-panel-${message.locale}`}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => select(message.locale)}
      onKeyDown={navigate}
    >
      {message.localeLabel}
    </button>
  );
}

interface LanguageTabsProps {
  readonly messages: readonly FanMessage[];
  readonly locale: MessageLocale;
  readonly select: (locale: MessageLocale) => void;
}

export function LanguageTabs({
  messages,
  locale,
  select,
}: LanguageTabsProps): React.JSX.Element {
  function navigate(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void {
    const next = nextLocale(event.key, index, messages);
    if (next === null) return;
    event.preventDefault();
    select(next);
    document.querySelector<HTMLElement>(`#language-tab-${next}`)?.focus();
  }
  return (
    <div className="language-tabs" role="tablist" aria-label="Message language">
      {messages.map((message, index) => (
        <TabButton
          key={message.locale}
          message={message}
          selected={locale === message.locale}
          select={select}
          navigate={(event) => navigate(event, index)}
        />
      ))}
    </div>
  );
}
