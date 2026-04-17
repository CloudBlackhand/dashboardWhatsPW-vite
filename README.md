# WhatsPW — dashboard-new

Painel estático (Vite + React + **TanStack Table**), pensado para o mesmo fluxo do WAHA: ficheiros em `/dashboard` na imagem Docker, via `waha.config.json` → `repo` + `ref` (ZIP do GitHub).

## Desenvolvimento

```bash
npm install
# WAHA a correr localmente; ajusta a porta se precisares
npm run dev
```

Abre `http://localhost:5173/dashboard/` (atenção ao sufixo `/dashboard/` — alinha com `base` do Vite).

Opcional: copia `.env.example` para `.env` e define `VITE_WAHA_API_KEY` se o teu WAHA exigir chave.

## Build (artefacto para o WAHA)

```bash
npm run build
```

O conteúdo a publicar no repositório GitHub usado pelo Docker é o interior de **`dist/`** (deve existir `index.html` na raiz do ZIP, como no dashboard antigo).

## Integração com o WAHA

1. Faz commit do conteúdo de `dist/` no repo referenciado por `waha.dashboard.repo` (ou cria release/CI que o faça).
2. Atualiza `waha.config.json` → `waha.dashboard.ref` para o SHA desse commit.
3. Rebuild da imagem WAHA / redeploy.

O projeto antigo em `../dashboard/` continua útil como referência de rotas e comportamento da API.
