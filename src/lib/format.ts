export function formatActivity(ms: number | null | undefined): string {
  if (ms == null || ms <= 0) {
    return '—';
  }
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return String(ms);
  }
}

export function shortJid(jid: string | undefined): string {
  if (!jid) {
    return '—';
  }
  return jid.length > 28 ? `${jid.slice(0, 14)}…${jid.slice(-10)}` : jid;
}
