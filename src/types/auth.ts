export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export function normalizeUser(raw: Record<string, unknown>): AuthUser {
  const id = raw.id != null ? String(raw.id) : 'unknown';
  const email = typeof raw.email === 'string' ? raw.email : '';
  const first = typeof raw.firstName === 'string' ? raw.firstName : '';
  const last = typeof raw.lastName === 'string' ? raw.lastName : '';
  const name = [first, last].filter(Boolean).join(' ') || undefined;
  return { id, email, name };
}
