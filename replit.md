# TrainFlow

App PWA fitness que conecta personal trainers aos seus alunos. Os trainers gerenciam alunos, criam avaliações físicas, constroem planos de treino e se comunicam via chat. Os alunos executam treinos com um player full-screen, acompanham histórico e conversam com o trainer.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — rodar servidor API (porta 5000)
- `pnpm --filter @workspace/trainflow run dev` — rodar frontend (porta 22378)
- `pnpm run typecheck` — typecheck completo de todos os pacotes
- `pnpm run build` — typecheck + build de todos os pacotes
- `pnpm --filter @workspace/api-spec run codegen` — regenerar hooks e schemas Zod a partir do spec OpenAPI
- `pnpm --filter @workspace/db run push` — aplicar mudanças de schema (somente dev)
- `pnpm --filter @workspace/scripts run seed` — popular banco com dados demo
- Env obrigatórias: `DATABASE_URL`, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + express-session
- DB: PostgreSQL + Drizzle ORM
- Frontend: React + Vite + Wouter + TanStack Query + Tailwind v4 + shadcn/ui
- Validação: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — schemas Drizzle (profiles, trainerStudents, physicalAssessments, exercises, trainingPlans, workoutSessions, conversations, magicTokens)
- `lib/api-spec/openapi.yaml` — contrato OpenAPI fonte da verdade
- `lib/api-client-react/src/generated/` — hooks React Query gerados pelo Orval
- `artifacts/api-server/src/routes/` — rotas Express (auth, trainer, student, exercises, plans, chat)
- `artifacts/api-server/src/lib/calculations.ts` — cálculos de composição corporal e somatótipo
- `artifacts/trainflow/src/pages/` — páginas React (student/ e trainer/)
- `artifacts/trainflow/src/index.css` — design system (lime #C8F135, Bebas Neue, pure dark)

## Architecture decisions

- Auth session-based com express-session (não Supabase — decisão do usuário)
- Alunos fazem login via magic token (link único com 7 dias de validade)
- Trainers fazem login com email + senha (scrypt via Node.js crypto nativo)
- Cálculo de composição corporal: Pollock 7 dobras cutâneas + equação de Siri
- Somatótipo: Heath-Carter simplificado (sem medidas de diâmetro ósseo)
- Design: somente dark mode, accent lime #C8F135, Bebas Neue headings, sem emojis

## Product

- **Trainer**: dashboard com métricas, lista de alunos, avaliação física multi-etapas (com cálculos ao vivo de %gordura e somatótipo), biblioteca de exercícios, construtor de planos de treino, chat com alunos
- **Aluno**: home com treino do dia, player full-screen de workout, histórico de sessões, perfil com dados corporais, chat com trainer

## Demo Credentials

- Trainer: `trainer@trainflow.app` / `trainer123`
- Acesse `/t/login` para entrar como trainer
- Tokens dos alunos: execute `pnpm --filter @workspace/scripts run seed` para ver os tokens gerados

## User preferences

- Usar design dos mockups HTML do projeto — não criar do zero, montar.
- Não usar Supabase — usar PostgreSQL do Replit.

## Gotchas

- `@import url(...)` do Google Fonts DEVE ser a primeira linha do `index.css`, antes de `@import "tailwindcss"` — PostCSS falha silenciosamente se a ordem estiver errada.
- `pnpm run typecheck:libs` precisa rodar antes do typecheck dos artifacts para gerar as declarações `.d.ts` da lib `@workspace/db`.
- `bcrypt` requer build scripts aprovados no pnpm (`pnpm approve-builds`) — usar `crypto` nativo do Node em vez disso.
- Magic tokens têm 7 dias de validade por padrão; após uso ficam marcados como `usedAt`.

## Pointers

- Ver skill `pnpm-workspace` para estrutura do workspace, TypeScript e detalhes dos pacotes
