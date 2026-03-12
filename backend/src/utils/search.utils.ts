export const MAX_SEARCH_LENGTH = 100;

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildSafeSearchRegex(value?: string): RegExp | null {
  const normalized = value?.trim().slice(0, MAX_SEARCH_LENGTH);

  if (!normalized) {
    return null;
  }

  return new RegExp(escapeRegex(normalized), "i");
}
