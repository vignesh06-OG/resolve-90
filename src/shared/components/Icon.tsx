export type IconName =
  | "access"
  | "arrow"
  | "check"
  | "clock"
  | "code"
  | "evidence"
  | "globe"
  | "leaf"
  | "lock"
  | "route"
  | "shield"
  | "spark"
  | "test"
  | "train"
  | "users"
  | "warning";

const paths: Record<IconName, React.JSX.Element> = {
  access: (
    <>
      <circle cx="12" cy="4.5" r="2" />
      <path d="m9 21 2-7-3-2 1-4 5 2 3 4" />
      <path d="M11 14h4l2 7M5 10l4-2" />
    </>
  ),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  check: <path d="m5 12 4 4L19 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  code: (
    <>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
    </>
  ),
  evidence: (
    <>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 19C4 9 10 4 20 4c0 10-5 16-14 16" />
      <path d="M6 18c3-4 6-7 11-10" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z" />
      <path d="m9 12 2 2 4-5" />
    </>
  ),
  spark: <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z" />,
  test: (
    <>
      <path d="M9 3v5l-5 10a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L15 8V3" />
      <path d="M7 15h10M8 3h8" />
    </>
  ),
  train: (
    <>
      <rect x="5" y="3" width="14" height="15" rx="3" />
      <path d="M5 11h14M9 21l2-3M15 21l-2-3M9 7h.01M15 7h.01" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a6 6 0 0 1 4 6" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3 2.8 20h18.4z" />
      <path d="M12 9v5M12 17h.01" />
    </>
  ),
};

interface IconProps {
  readonly name: IconName;
  readonly size?: number;
}

export function Icon({ name, size = 20 }: IconProps): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
