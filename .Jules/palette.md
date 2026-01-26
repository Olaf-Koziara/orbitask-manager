## 2024-05-23 - Accessibility of Color-Only Indicators
**Learning:** Color-coded indicators (like priority badges) without text labels are invisible to screen readers and confusing for color-blind users.
**Action:** Always wrap such indicators in a tooltip with a text label, and ensure the indicator itself has an `aria-label` or `sr-only` text describing its meaning.

## 2024-05-24 - Accessibility of Icon-Only Buttons
**Learning:** Icon-only buttons (like "More options" or "Delete") lack accessible names, making them unusable for screen reader users.
**Action:** Always add `aria-label` to icon-only buttons. For enhanced UX, wrap them in a `Tooltip` to provide visual labels on hover.
