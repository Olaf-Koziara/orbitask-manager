export const colorOptions = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#EF4444", label: "Red" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Yellow" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EC4899", label: "Pink" },
  { value: "#6B7280", label: "Gray" },
  { value: "#F97316", label: "Orange" },
];

export function getColorName(hex: string): string {
  const normalizedHex = hex.toUpperCase();
  const option = colorOptions.find((opt) => opt.value.toUpperCase() === normalizedHex);
  return option ? option.label : "Custom color";
}
