# Accessibility

## Target

Resolve 90 targets **WCAG 2.2 Level AA** for the decision workspace and evidence pages. Accessibility is also a domain safety invariant: an operational plan cannot be recommended if it removes protected step-free capacity.

## Implemented interface practices

- Skip link to the main content.
- Semantic header, navigation, main, sections, asides, and footer.
- One page-level `h1` and ordered heading hierarchy.
- Native buttons, links, checkboxes, and progress elements.
- Visible keyboard focus with sufficient contrast and offset.
- No color-only status communication; each status has text and/or symbol.
- Live region for compiler status and approval confirmation.
- Programmatic labels, descriptions, error association, and fieldsets.
- Route-change focus moves to the page heading.
- `prefers-reduced-motion` removes non-essential transitions.
- Layout reflows for 320 CSS px and 200% zoom.
- System font stack avoids blocking font downloads.
- Target sizes meet or exceed 24×24 CSS px; primary controls target 44 px.
- Charts/metrics have textual equivalents and explicit units.
- Locale changes update the language metadata of message previews.

## WCAG 2.2 checklist

| Criterion area        | Evidence                                                  | Status                                           |
| --------------------- | --------------------------------------------------------- | ------------------------------------------------ |
| 1.1 Text alternatives | Decorative SVGs hidden; meaningful graphics labeled       | Implemented                                      |
| 1.3 Adaptable         | Landmarks, lists, headings, table headers                 | Implemented                                      |
| 1.4 Distinguishable   | Contrast tokens, no color-only meaning, zoom/reflow       | Implemented; manual contrast snapshot documented |
| 2.1 Keyboard          | Native controls and keyboard-complete approval path       | Implemented and E2E tested                       |
| 2.2 Enough time       | Decision timer is informative; never expires or auto-acts | Implemented                                      |
| 2.3 Seizures          | No flashing content                                       | Implemented                                      |
| 2.4 Navigable         | Skip link, title, focus order, current nav indication     | Implemented                                      |
| 2.5 Input modalities  | Large targets, no drag-only or path gestures              | Implemented                                      |
| 3.1 Readable          | Plain language and declared document language             | Implemented                                      |
| 3.2 Predictable       | No unexpected context changes                             | Implemented                                      |
| 3.3 Input assistance  | Approval validation has text and association              | Implemented                                      |
| 4.1 Compatible        | Names/roles/states and status announcements               | Implemented; axe test                            |

## Manual test protocol

1. Complete compile, evidence review, acknowledgement, approval, and relay using only Tab, Shift+Tab, Space, and Enter.
2. Repeat at browser zoom 200% and a 320 px viewport.
3. Enable reduced motion at OS/browser level.
4. Check forced-colors mode.
5. Inspect with one desktop and one mobile screen reader before operational deployment.
6. Validate generated messages with native-language accessibility reviewers; automated translation quality is not certification.

## Important distinction

Passing automated checks does not prove conformance. The `/accessibility` page separates automated coverage from manual and deployment-required checks. Operational accessibility configuration must be verified against the actual venue; the demo route graph is synthetic.
