import type { IconName } from "../../../shared/components/Icon";

export interface AuditCategory {
  readonly title: string;
  readonly icon: IconName;
  readonly checks: readonly string[];
}

export const AUDIT_CATEGORIES: readonly AuditCategory[] = [
  {
    title: "Perceivable",
    icon: "evidence",
    checks: [
      "Semantic text alternatives",
      "4.5:1 text contrast tokens",
      "200% zoom + 320 px reflow",
      "Text equivalent for every metric",
    ],
  },
  {
    title: "Operable",
    icon: "code",
    checks: [
      "Skip link and landmarks",
      "Keyboard-complete approval path",
      "Visible focus indicator",
      "Reduced motion and 44 px primary targets",
    ],
  },
  {
    title: "Understandable",
    icon: "globe",
    checks: [
      "Declared page and message languages",
      "No unexpected context changes",
      "Native form errors",
      "Modeled and replay labels stay visible",
    ],
  },
  {
    title: "Robust",
    icon: "access",
    checks: [
      "Native names, roles, and states",
      "Status live region",
      "Arrow-key language tabs",
      "axe-core component scan",
    ],
  },
];

export const AUDIT_ROWS = [
  [
    "1.1.1 Text alternatives",
    "Decorative SVGs are aria-hidden; no information-only images",
    "Pass",
  ],
  [
    "1.3.1 Info and relationships",
    "Landmarks, lists, fieldsets, table headers, ordered headings",
    "Pass",
  ],
  [
    "1.4.3 Contrast",
    "Dark and paper palettes checked against AA token targets",
    "Pass",
  ],
  [
    "1.4.10 Reflow",
    "Single-column breakpoints; no two-axis content requirement at 320 px",
    "Pass",
  ],
  [
    "2.1.1 Keyboard",
    "Compile, review, acknowledgement, approval, and locale tabs",
    "Pass",
  ],
  ["2.4.1 Bypass blocks", "First-focus skip link targets main content", "Pass"],
  [
    "2.4.3 Focus order",
    "Route main focus and post-approval relay focus",
    "Pass",
  ],
  ["2.4.7 Focus visible", "3 px amber outline with 3 px offset", "Pass"],
  [
    "2.5.8 Target size",
    "Primary controls ≥44 px; compact controls ≥24 px",
    "Pass",
  ],
  ["3.1.2 Language of parts", "Fan message panel sets en, es, or fr", "Pass"],
  [
    "3.3.2 Labels or instructions",
    "Two required acknowledgements have persistent text",
    "Pass",
  ],
  [
    "4.1.2 Name, role, value",
    "Native controls and complete ARIA tab state",
    "Pass",
  ],
  [
    "Assistive technology",
    "Desktop + mobile screen-reader check on hosted build",
    "Deployment gate",
  ],
] as const;
