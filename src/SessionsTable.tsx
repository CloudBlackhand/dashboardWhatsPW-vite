import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { formatActivity, shortJid } from './lib/format';
import type { SessionRow } from './lib/types';

const columnHelper = createColumnHelper<SessionRow>();

type Props = {
  data: SessionRow[];
};

function globalFilterFn(
  row: { original: SessionRow },
  _columnId: string,
  filterValue: string,
): boolean {
  const q = filterValue.trim().toLowerCase();
  if (!q) {
    return true;
  }
  const s = row.original;
  const hay = [
    s.name,
    s.status,
    s.presence ?? '',
    s.assignedWorker ?? '',
    s.me?.pushName ?? '',
    s.me?.jid ?? '',
    s.me?.id ?? '',
    s.config?.metadata
      ? Object.entries(s.config.metadata)
          .map(([k, v]) => `${k} ${v}`)
          .join(' ')
      : '',
  ]
    .join(' ')
    .toLowerCase();
  return hay.includes(q);
}

export function SessionsTable({ data }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Sessão',
        cell: (info) => <strong>{info.getValue()}</strong>,
        filterFn: 'includesString',
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => info.getValue(),
        filterFn: 'includesString',
      }),
      columnHelper.accessor((row) => row.presence ?? '—', {
        id: 'presence',
        header: 'Presença',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.me?.pushName ?? '—', {
        id: 'pushName',
        header: 'Nome (push)',
      }),
      columnHelper.accessor((row) => shortJid(row.me?.jid), {
        id: 'jid',
        header: 'JID',
      }),
      columnHelper.accessor((row) => row.assignedWorker ?? '—', {
        id: 'worker',
        header: 'Worker',
      }),
      columnHelper.accessor((row) => row.timestamps?.activity ?? -1, {
        id: 'activity',
        header: 'Última atividade',
        cell: (info) => {
          const ms = info.getValue() as number;
          return ms < 0 ? '—' : formatActivity(ms);
        },
      }),
      columnHelper.display({
        id: 'metadata',
        header: 'Metadata',
        cell: ({ row }) => {
          const m = row.original.config?.metadata;
          if (!m || Object.keys(m).length === 0) {
            return '—';
          }
          return Object.entries(m)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn,
  });

  return (
    <div className="sessions-table-wrap">
      <div className="sessions-toolbar">
        <label className="sessions-search">
          <span className="sessions-search-label">Filtrar</span>
          <input
            type="search"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Nome, estado, JID, metadata…"
            className="sessions-search-input"
          />
        </label>
        <div className="sessions-page-size">
          <span>Por página</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => {
              const n = Number(e.target.value);
              table.setPageSize(n);
              table.setPageIndex(0);
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="sessions-table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="sessions-th-btn"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: ' ▲',
                          desc: ' ▼',
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sessions-pagination">
        <span className="sessions-page-info">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount() || 1} ({table.getFilteredRowModel().rows.length}{' '}
          sessões)
        </span>
        <div className="sessions-page-actions">
          <button
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            ««
          </button>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            «
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            »
          </button>
          <button
            type="button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            »»
          </button>
        </div>
      </div>
    </div>
  );
}
