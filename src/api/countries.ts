export const COUNTRY_OPTIONS = [
  { code: 'US', label: 'United States' },
  { code: 'CA', label: 'Canada' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'AU', label: 'Australia' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
] as const;

export function countryLabel(code: string): string {
  const row = COUNTRY_OPTIONS.find(c => c.code === code);
  return row?.label ?? code;
}
