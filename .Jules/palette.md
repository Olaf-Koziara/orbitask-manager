## 2024-05-23 - Accessibility of Color-Only Indicators
**Learning:** Color-coded indicators (like priority badges) without text labels are invisible to screen readers and confusing for color-blind users.
**Action:** Always wrap such indicators in a tooltip with a text label, and ensure the indicator itself has an `aria-label` or `sr-only` text describing its meaning.

## 2025-09-22 - Accessibility of Icon-Only Dropdown Triggers
**Learning:** Icon-only dropdown triggers are a common pattern but often lack accessibility context. Adding both `aria-label` and a `Tooltip` provides a complete experience for both screen reader users and visual users.
**Action:** When using `DropdownMenuTrigger` with an icon button, wrap it in a `Tooltip` > `TooltipTrigger` and ensure the button has a descriptive `aria-label`.
## 2025-02-18 - Context-Rich Date Tooltips
**Learning:** Displaying relative status (e.g., "Overdue since", "Due on") in tooltips for date indicators provides critical context that doesn't fit in compact cards.
**Action:** Use conditional logic inside tooltips to show state-aware messages (overdue/due soon) rather than just the static date.

## 2025-10-27 - Keyboard Accessibility for Non-Interactive Tooltip Triggers
**Learning:** Tooltips attached to non-interactive elements (like `div` or `span` color indicators) are inaccessible to keyboard users because they cannot receive focus.
**Action:** Add `tabIndex={0}` and a semantic role (like `role="img"`) to the trigger element to make it focusable and discoverable in the tab order.
## 2026-02-01 - Keyboard Accessibility for Tooltips on Static Elements
**Learning:** Wrapping non-interactive elements (like `div` or `Badge`) in `TooltipTrigger` does not make them keyboard-focusable, rendering the tooltip inaccessible to keyboard-only users.
**Action:** Always add `tabIndex={0}` (and appropriate ARIA roles) to static elements when they trigger tooltips.

## 2025-05-23 - Accessible Interactive Cards
**Learning:** Clickable cards implemented as `div`s are inaccessible to keyboard users unless explicitly handled.
**Action:** Add `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers for Enter/Space keys to all interactive card components.
## 2026-06-25 - Dialog Visibility in Empty Lists
**Learning:** Conditionally rendering dialogs inside a list's "has items" block prevents them from opening when the list is empty, breaking the "Create New" flow.
**Action:** Always render dialog components outside of conditional list rendering blocks, typically at the end of the container, to ensure availability regardless of list state.
## 2025-05-27 - Accessibility of "Clear Filter" Buttons
**Learning:** Filter components often use icon-only "X" buttons to clear selections. These buttons are frequently missing `aria-label` and `Tooltip`, making them inaccessible and unclear.
**Action:** Always add `aria-label` describing the specific filter being cleared (e.g., "Clear status filter") and wrap the button in a `Tooltip`.
## 2026-02-02 - Extending Checkbox Click Targets
**Learning:** Users often expect the label or row content next to a checkbox to be clickable. Small click targets frustrate users.
**Action:** Wrap the associated content in a `<label>` element with `htmlFor` matching the checkbox ID to improve hit area and accessibility.
## 2024-03-20 - Contextual Labels and Keyboard Access for Empty States
**Learning:** Repetitive actions in complex interfaces (like "Add task" buttons in Kanban columns) become ambiguous to screen reader users if not contextually labeled. Furthermore, empty state containers acting as hit targets are often inaccessible to keyboard users unless explicitly given `role="button"`, `tabIndex`, keyboard event handlers, and visible focus styles.
**Action:** When implementing actionable empty states, always add `role="button"`, `tabIndex={0}`, `onKeyDown` handlers (for Enter and Space), and focus-visible rings. Ensure identical icon-only buttons in lists or columns include dynamic contextual information in their aria-labels (e.g., "Add task to [Column Name]").
