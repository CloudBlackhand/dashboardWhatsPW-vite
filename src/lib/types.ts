/**
 * Subconjunto de SessionInfo (WAHA GET /api/sessions).
 * @see waha/src/structures/sessions.dto.ts
 */
export type SessionRow = {
  name: string;
  status: string;
  config?: { metadata?: Record<string, string> };
  me?: {
    id?: string;
    jid?: string;
    lid?: string;
    pushName?: string;
  };
  presence?: 'ONLINE' | 'OFFLINE' | null;
  assignedWorker?: string;
  timestamps?: { activity: number | null };
};
