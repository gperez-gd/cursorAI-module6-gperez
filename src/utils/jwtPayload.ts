/**
 * Decode JWT payload (client-side, for display only — not verified).
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = (4 - (b64.length % 4)) % 4;
    const padded = b64 + '='.repeat(pad);
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function jwtSubject(token: string): string | null {
  const p = decodeJwtPayload(token);
  const sub = p?.sub;
  return typeof sub === 'string' ? sub : null;
}
