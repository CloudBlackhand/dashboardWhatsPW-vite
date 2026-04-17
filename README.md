# WhatsPW — Dashboard UI (`dashboardWhatsPW-vite`)

Código fonte: **Vite + React + TanStack Table**. O site estático servido pelo WAHA é gerado no repo **[dashboardWhatsPW](https://github.com/CloudBlackhand/dashboardWhatsPW)** pela Action **Publish dashboard build** (faz checkout deste repo, `npm run build`, copia `dist/` para a raiz).

## Desenvolvimento

```bash
npm install
npm run dev
```

Abre `http://localhost:5173/dashboard/` (com WAHA a correr; vê `.env.example` para `VITE_WAHA_API_KEY` e proxy).

## Depois de alterares o código

1. `git push` para `main` **neste** repo.
2. No repo **dashboardWhatsPW** → **Actions** → **Publish dashboard build** → **Run workflow**.
3. Atualiza `waha.config.json` → `dashboard.ref` no [WhatsPW](https://github.com/CloudBlackhand/WhatsPW) e redeploy.

## Build local

```bash
npm run build
```

Saída em `dist/` (o mesmo que a Action publica).
