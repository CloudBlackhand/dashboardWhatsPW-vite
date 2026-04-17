import type { SessionRow } from './types';

const MOCK: SessionRow[] = [
  { name: 'default', status: 'STOPPED' },
  { name: 'demo', status: 'WORKING' },
];

function headers(): HeadersInit {
  const h: Record<string, string> = { Accept: 'application/json' };
  const key = import.meta.env.VITE_WAHA_API_KEY;
  if (key) {
    h['X-Api-Key'] = key;
  }
  return h;
}

export async function fetchSessions(): Promise<SessionRow[]> {
  const res = await fetch('/api/sessions', { headers: headers() });
  if (!res.ok) {
    throw new Error(`GET /api/sessions → ${res.status}`);
  }
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error('Resposta /api/sessions inválida');
  }
  return data as SessionRow[];
}

export function mockSessions(): SessionRow[] {
  return MOCK;
}
