## 2024-03-17 - Added aria-pressed to color picker buttons
**Learning:** Adding interactive custom buttons like color pickers requires `aria-pressed` for screen readers to properly indicate their state, as visual changes alone are insufficient. Also, providing clear `focus-visible` styling is essential so keyboard navigators know which color they are currently focused on.
**Action:** Always add `aria-pressed={isActive}` and `focus-visible:ring-2` to custom choice buttons that lack native input semantics, such as the color pickers in `ProjectFormDialog.tsx`.
