# Plano de Execucao do Frontend TrainFlow

## Summary
- Objetivo: concluir o frontend do TrainFlow em `artifacts/trainflow`, priorizando a experiencia do aluno e mantendo o backend atual intacto, exceto pelo consumo dos contratos ja existentes.
- Resultado esperado: fluxo do aluno funcional e visualmente consistente do login ate chat/perfil, usando os mockups de `attached_assets/stitch_extracted/stitch_modern_application_suite` como referencia principal.
- Estrategia: executar primeiro a base visual e a jornada do aluno; em seguida fechar a parte restante do frontend do personal trainer, reaproveitando os mesmos tokens visuais, componentes UI e padroes de fallback com mocks.
- Decisao central: quando a API nao entregar todos os dados necessarios para a UX final, o frontend continua com fallback temporario via `artifacts/trainflow/src/lib/mock-data.ts` ate a etapa de integracao final.

## Current State Analysis

### Monorepo e dependencias
- O workspace tem frontend em `artifacts/trainflow`, API em `artifacts/api-server`, libs compartilhadas em `lib/` e especificacao/plano existente em `.trae/documents/`.
- O frontend usa React + Vite + Wouter + React Query e componentes shadcn/ui, conforme `artifacts/trainflow/package.json`.
- Os contratos compartilhados ja existem em `@workspace/api-client-react` e `@workspace/api-zod`, o que reduz risco de inventar interfaces novas no frontend.

### Estrutura de rotas ja existente
- A composicao das rotas do frontend ja esta centralizada em `artifacts/trainflow/src/App.tsx`.
- O fluxo do aluno ja possui paginas para `login`, `welcome`, `home`, `workout`, `profile`, `chat` e `conversation`.
- O fluxo do personal ja possui paginas para `dashboard`, `students`, `assessments`, `plans`, `login` e `register`.
- Ha protecao por perfil em `ProtectedRoute`, o que significa que a implementacao deve preservar as rotas e nao reinventar navegacao ou auth no frontend.

### Estado real das telas do aluno
- `artifacts/trainflow/src/pages/student/login.tsx` ja tem estrutura visual inicial, mas ainda desvia do comportamento real porque o submit atual navega direto para `/home` sem consumir a autenticacao do token.
- `artifacts/trainflow/src/pages/student/welcome.tsx` ja consome `useGetMyLatestAssessment()` e faz fallback para `MOCK_ASSESSMENT`, mas ainda precisa alinhar melhor a densidade visual e o conteudo dos cards ao mockup final.
- `artifacts/trainflow/src/pages/student/home.tsx` ja consome `useGetStudentToday()` e usa fallback de mock; a tela esta relativamente avancada, mas o historico ainda esta hardcoded dentro do componente e precisa ser reorganizado.
- `artifacts/trainflow/src/pages/student/workout.tsx` exibe sessoes anteriores via `useListMySessions()`; hoje funciona mais como historico do que como player/lista completa de treino.
- `artifacts/trainflow/src/pages/student/profile.tsx` mostra dados da avaliacao mais recente, mas ainda nao entrega o historico visual nem os graficos esperados pelos mockups.
- `artifacts/trainflow/src/pages/student/chat.tsx` e `artifacts/trainflow/src/pages/student/conversation.tsx` ja possuem base funcional para listagem e envio de mensagens.

### Componentes compartilhados relevantes
- A navegacao inferior do aluno esta em `artifacts/trainflow/src/components/student-bottom-nav.tsx`.
- O tema visual base esta em `artifacts/trainflow/src/index.css`, com tokens dark, fontes `Bebas Neue` e `Inter`, utilitarios como `electric-glow`, `glass-panel` e `glass-nav`.
- Os dados de fallback centralizados estao em `artifacts/trainflow/src/lib/mock-data.ts`.

### Referencias de design disponiveis
- O plano atual de frontend ja existe em `.trae/documents/plano_frontend_trainflow.md`, com foco pagina por pagina.
- Os mockups HTML de referencia ja estao disponiveis em:
  - `attached_assets/stitch_extracted/stitch_modern_application_suite/login_do_aluno_dark_mode/code.html`
  - `attached_assets/stitch_extracted/stitch_modern_application_suite/boas_vindas_do_aluno_dark_mode/code.html`
  - `attached_assets/stitch_extracted/stitch_modern_application_suite/dashboard_do_aluno_dark_mode/code.html`
  - `attached_assets/stitch_extracted/stitch_modern_application_suite/player_de_treino_dark_mode_1/code.html`
  - `attached_assets/stitch_extracted/stitch_modern_application_suite/player_de_treino_modo_foco_total/code.html`
  - `attached_assets/stitch_extracted/stitch_modern_application_suite/perfil_do_aluno/code.html`
  - `attached_assets/stitch_extracted/stitch_modern_application_suite/mensagens_do_personal_conversa/code.html`

## Proposed Changes

### Fase 1 - Base visual e consistencia global

#### `artifacts/trainflow/src/index.css`
- O que mudar: consolidar tokens, utilitarios e detalhes de superficie para reproduzir com fidelidade os mockups dark mode.
- Por que: varias telas ja usam classes semelhantes, mas ainda ha variacao excessiva de borda, blur, sombra e densidade tipografica.
- Como:
  - padronizar cores de superfice (`#1A1A1A`, `#222222`, `#333333`) e estados de destaque do lime;
  - adicionar utilitarios faltantes como tratamento de scrollbar oculta e gradientes de fundo recorrentes;
  - manter as fontes atuais e garantir que `Bebas Neue` siga como fonte de destaque.

#### `artifacts/trainflow/src/components/student-bottom-nav.tsx`
- O que mudar: alinhar labels, espacamentos, estados ativos e microdetalhes com o mockup do dashboard do aluno.
- Por que: a bottom nav aparece em quase toda a jornada do aluno e precisa ser a ancora visual consistente do app.
- Como:
  - manter a estrutura existente com `wouter`;
  - revisar textos para o padrao final da interface;
  - padronizar preenchimento dos icones ativos/inativos e a altura da barra.

### Fase 2 - Fluxo do aluno prioritario

#### `artifacts/trainflow/src/pages/student/login.tsx`
- O que mudar: transformar a tela atual em login de aluno pronto para producao visual, mantendo o suporte a preview apenas se isso continuar util em ambiente de desenvolvimento.
- Por que: a tela ja esta proxima visualmente, mas o comportamento atual ainda ignora o endpoint real.
- Como:
  - usar `useStudentMagicLogin()` de verdade no submit;
  - popular cache/auth e redirecionar para `/welcome` ou `/home` conforme a estrategia ja existente em `AuthProvider`;
  - manter feedback de loading/erro com `toast`;
  - alinhar os textos e o layout ao mockup `login_do_aluno_dark_mode`.

#### `artifacts/trainflow/src/pages/student/welcome.tsx`
- O que mudar: concluir a tela de onboarding/boas-vindas usando a avaliacao mais recente e fallback mockado.
- Por que: esta e a primeira tela de impacto depois do login e ja possui boa parte dos dados necessarios.
- Como:
  - manter `useGetMyLatestAssessment()` com fallback em `MOCK_ASSESSMENT`;
  - transformar a classificacao em hero card com copy consistente ao somatotipo;
  - extrair, se necessario, um pequeno conjunto local de "diretrizes do treino" derivadas do somatotipo para nao hardcodar conteudo solto dentro do JSX;
  - preservar CTA principal levando para `/home`.

#### `artifacts/trainflow/src/pages/student/home.tsx`
- O que mudar: finalizar o dashboard do aluno com estado vazio, card do treino do dia, preview de mensagem do coach e historico recente.
- Por que: hoje a tela esta avancada, mas mistura mock direto no componente e nao reaproveita bem a estrutura disponivel.
- Como:
  - manter `useGetStudentToday()` como fonte do treino atual;
  - mover os itens de historico para `mock-data.ts` ou para helpers locais, evitando dados inline extensos;
  - adicionar preview de conversa usando `MOCK_CONVERSATIONS` ou resposta real quando houver;
  - manter o CTA para `/treinos` e a experiencia mobile-first do mockup.

#### `artifacts/trainflow/src/pages/student/workout.tsx`
- O que mudar: converter a pagina atual de historico em experiencia de treino mais completa, separando "treino atual" e "historico".
- Por que: o mockup do player sugere duas necessidades diferentes, e hoje a tela so cobre uma delas.
- Como:
  - manter `useListMySessions()` para historico;
  - complementar com o treino atual vindo de `useGetStudentToday()` ou fallback de mock para mostrar a sessao do dia no topo;
  - estruturar a pagina em secoes: treino de hoje, lista de exercicios/detalhes e sessoes anteriores;
  - preparar a navegacao para um modo de foco total, seja na propria pagina com estado local, seja via subcomponente interno, sem criar rota nova desnecessaria se o app nao exigir.

#### `artifacts/trainflow/src/pages/student/profile.tsx`
- O que mudar: transformar a pagina em centro de identidade e metricas do aluno, com historico visual e area de logout preservada.
- Por que: hoje ela mostra so a avaliacao mais recente e nao materializa o mockup de historico corporal.
- Como:
  - manter `useGetMyLatestAssessment()` com fallback;
  - usar `recharts` ja disponivel para graficos simples de evolucao mockada quando a API nao entregar serie historica;
  - mover dados historicos temporarios para `mock-data.ts`;
  - preservar logout do `useAuth()`;
  - manter estilo premium dark, mas simplificar animacoes se elas atrapalharem a legibilidade.

#### `artifacts/trainflow/src/pages/student/chat.tsx`
- O que mudar: polir a lista de conversas, busca visual e estados vazios/loading.
- Por que: a base funcional existe, mas precisa de acabamento de UX para combinar com o restante do app.
- Como:
  - manter `useListConversations()`;
  - usar `MOCK_CONVERSATIONS` como fallback controlado;
  - revisar o card de conversa para exibir horario, unread badge e ultimo texto de forma consistente com o mockup.

#### `artifacts/trainflow/src/pages/student/conversation.tsx`
- O que mudar: concluir a experiencia de conversa em tempo real visualmente, mantendo o comportamento atual de poll e envio.
- Por que: ja existe envio/listagem, mas ainda falta acabamento e tolerancia melhor a estados de erro.
- Como:
  - manter `useListMessages()` com `refetchInterval` e `useSendMessage()`;
  - revisar agrupamento visual de mensagens, header, empty state e composer;
  - manter `MOCK_MESSAGES` como fallback;
  - garantir que mensagens do proprio usuario e do treinador tenham contraste e leitura adequados.

#### `artifacts/trainflow/src/lib/mock-data.ts`
- O que mudar: centralizar todos os dados temporarios usados nas telas do aluno.
- Por que: parte dos mocks ainda esta embutida em componentes, o que dificulta manutencao e troca posterior para dados reais.
- Como:
  - acrescentar estruturas para historico de avaliacoes, cards de home, preview de treino e orientacoes por somatotipo;
  - nomear os blocos de mock por dominio de tela para facilitar substituicao posterior.

### Fase 3 - Fechamento do restante do frontend

#### `artifacts/trainflow/src/pages/trainer/dashboard.tsx`
- O que mudar: manter como segunda prioridade, refinando o dashboard do personal apos a conclusao do aluno.
- Por que: o usuario pediu prioridade no fluxo do aluno, mas o frontend so fica realmente concluido quando o lado do personal tambem estiver polido.
- Como:
  - alinhar cards, CTAs e feed de atividade ao mockup do personal;
  - manter `useGetTrainerDashboard()` com fallback mockado.

#### `artifacts/trainflow/src/pages/trainer/students/list.tsx`
- O que mudar: acabamento visual e consistencia de estados para lista de alunos.
- Como:
  - manter `useListStudents()`;
  - melhorar organizacao de status, avatar e busca/filtros, se o mockup exigir.

#### `artifacts/trainflow/src/pages/trainer/assessments/new.tsx`
- O que mudar: evoluir o formulario para a versao visual final inspirada no mockup profissional.
- Como:
  - manter `useCreateAssessment()`;
  - organizar por secoes mais claras;
  - preservar o preview analitico em tempo real.

#### `artifacts/trainflow/src/pages/trainer/plans/new.tsx`
- O que mudar: finalizar a tela de criacao inicial do plano e preparar o caminho para o builder detalhado.
- Como:
  - manter `useCreatePlan()`;
  - alinhar identidade visual ao builder do mockup;
  - deixar claro no fluxo que a edicao detalhada ocorre depois da criacao.

### Fase 4 - Verificacao e integracao final do frontend

#### `artifacts/trainflow/src/App.tsx`
- O que revisar: rotas finais, redirecionamentos e coerencia entre login, welcome, home e areas do personal.
- Por que: qualquer ajuste de rota deve ser consolidado aqui ao final.

#### Validacao geral do frontend
- Rodar `pnpm run typecheck` no workspace para validar tipagem.
- Rodar o build do frontend para garantir que nenhum ajuste visual quebrou o Vite.
- Revisar visualmente as rotas principais do aluno e depois do personal trainer.
- Verificar estados reais, de fallback mockado, loading e vazio em cada tela principal.

## Assumptions & Decisions
- O plano cobre apenas o frontend do projeto neste momento.
- O fluxo do aluno e a prioridade absoluta de execucao.
- O backend atual, os schemas compartilhados e as rotas existentes serao preservados; qualquer lacuna de dados no frontend sera coberta temporariamente por mocks.
- Nao serao criadas novas APIs nesta etapa de frontend, exceto se uma integracao minima futura for explicitamente autorizada fora deste plano.
- O visual alvo segue os mockups HTML da pasta `attached_assets/stitch_extracted/stitch_modern_application_suite`.
- O app permanece mobile-first, com bom comportamento em telas maiores sem transformar o layout em dashboard desktop pesado.
- Quando houver conflito entre fidelidade visual e simplicidade tecnica, a prioridade sera: consistencia visual, navegacao clara, tipagem valida e troca facil de mocks por dados reais.

## Verification Steps
1. Validar rotas do aluno em `login -> welcome -> home -> treinos -> chat -> conversa -> profile`.
2. Confirmar que cada tela possui os quatro estados essenciais quando aplicavel: loading, dado real, fallback mockado e vazio.
3. Executar `pnpm run typecheck` no workspace.
4. Executar o build do frontend para garantir empacotamento sem erros.
5. Revisar visualmente a consistencia de tema, tipografia, bordas, sombras e bottom nav entre todas as telas do aluno.
6. Depois da jornada do aluno, repetir a validacao visual nas telas do personal: dashboard, alunos, nova avaliacao e criacao de plano.
