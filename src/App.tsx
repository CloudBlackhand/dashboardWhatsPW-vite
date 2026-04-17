import { useCallback, useEffect, useState } from 'react';
import { SessionsTable } from './SessionsTable';
import { fetchSessions, mockSessions } from './lib/sessions';
import type { SessionRow } from './lib/types';

type LoadState =
  | { kind: 'loading' }
  | { kind: 'ok'; rows: SessionRow[]; source: 'api' | 'mock' };

export default function App() {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });

  const load = useCallback(async () => {
    setState({ kind: 'loading' });
    try {
      const rows = await fetchSessions();
      setState({ kind: 'ok', rows, source: 'api' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setState({
        kind: 'ok',
        rows: mockSessions(),
        source: 'mock',
      });
      console.warn('[WhatsPW dashboard]', msg, '→ a usar dados de exemplo');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>
      <header
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.35rem' }}>WhatsPW</h1>
          <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Sessões (TanStack Table) — mesmo modelo de deploy que o WAHA
            espera em <code>/dashboard</code>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            background: '#fff',
          }}
        >
          Atualizar
        </button>
      </header>

      {state.kind === 'loading' && <p>A carregar…</p>}

      {state.kind === 'ok' && (
        <>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
            Fonte:{' '}
            <strong>{state.source === 'api' ? 'API WAHA' : 'exemplo (API indisponível)'}</strong>
            {import.meta.env.DEV && (
              <>
                {' '}
                · <code>npm run dev</code> com proxy para o WAHA; opcional{' '}
                <code>.env</code> com <code>VITE_WAHA_API_KEY</code>
              </>
            )}
          </p>
          <SessionsTable data={state.rows} />
        </>
      )}

    </div>
  );
}
