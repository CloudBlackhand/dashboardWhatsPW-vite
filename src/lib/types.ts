/** Formato alinhado ao GET /api/sessions do WAHA (subset usado na UI). */
export type SessionRow = {
  name: string;
  status: string;
  config?: { metadata?: Record<string, string> };
};
