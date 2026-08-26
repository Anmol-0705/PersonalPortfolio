const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

/** Validates a bulk-action id list: non-empty, every entry a real UUID. */
export function validateIdList(ids: string[]): string | null {
  if (ids.length === 0) {
    return "No items selected.";
  }
  if (!ids.every(isUuid)) {
    return "Invalid selection.";
  }
  return null;
}
