import type { SessionRow } from './types';

const MOCK: SessionRow[] = [
  {
    name: 'default',
    status: 'STOPPED',
    presence: 'OFFLINE',
    me: { pushName: 'Conta demo', jid: '5511999999999@s.whatsapp.net' },
    timestamps: { activity: null },
  },
  {
    name: 'vendas',
    status: 'WORKING',
    presence: 'ONLINE',
    assignedWorker: 'worker-1',
    me: { pushName: 'Loja', jid: '5511888888888@s.whatsapp.net' },
    config: { metadata: { departamento: 'comercial' } },
    timestamps: { activity: Date.now() - 3600_000 },
  },
];

function headers(): HeadersInit {
  const h: Record<string, string> = { Accept: 'application/json' };
  const key = import.meta.env.VITE_WAHA_API_KEY;
  if (key) {
    h['X-Api-Key'] = key;
  }
  return h;
}

export async function fetchSessions(all = false): Promise<SessionRow[]> {
  const q = all ? '?all=true' : '';
  const res = await fetch(`/api/sessions${q}`, { headers: headers() });
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
