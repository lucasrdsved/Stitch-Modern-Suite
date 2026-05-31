# Plano de Conclusão do Projeto TrainFlow

## Resumo
Este plano descreve as etapas para finalizar o frontend do TrainFlow, cobrindo tanto o fluxo do Aluno quanto o do Personal Trainer. O foco será na fidelidade visual aos mockups do Stitch e na funcionalidade das telas, utilizando dados mockados para garantir agilidade no desenvolvimento.

## Análise do Estado Atual
- **Aluno**: Tela de Boas-vindas concluída. Home, Treinos, Perfil e Chat possuem estrutura básica mas precisam de refinamento visual.
- **Personal**: Dashboard, Lista de Alunos, Avaliações e Planos possuem estrutura funcional mas precisam de alinhamento com os mockups profissionais.
- **Autenticação**: O `AuthProvider` está utilizando um usuário mockado, o que permite navegar livremente pelas rotas sem depender de uma sessão real da API.

## Mudanças Propostas

### 1. Refinamento do Fluxo do Aluno
- **Home ([home.tsx](file:///workspace/artifacts/trainflow/src/pages/student/home.tsx))**:
  - Aplicar o layout do mockup `dashboard_do_aluno_dark_mode`.
  - Melhorar o card de "Treino de Hoje" e a seção de "Últimas Sessões".
- **Treinos ([workout.tsx](file:///workspace/artifacts/trainflow/src/pages/student/workout.tsx))**:
  - Implementar o "Player de Treino" inspirado no mockup `player_de_treino_dark_mode_1`.
  - Adicionar a visualização de exercícios com séries e repetições.
- **Perfil ([profile.tsx](file:///workspace/artifacts/trainflow/src/pages/student/profile.tsx))**:
  - Implementar o visual de métricas corporais conforme o mockup `perfil_do_aluno`.
  - Adicionar gráficos de evolução (usando dados mockados).
- **Chat ([chat.tsx](file:///workspace/artifacts/trainflow/src/pages/student/chat.tsx) & [conversation.tsx](file:///workspace/artifacts/trainflow/src/pages/student/conversation.tsx))**:
  - Refinar a lista de conversas e a interface de chat em tempo real.

### 2. Refinamento do Fluxo do Personal Trainer
- **Dashboard ([dashboard.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/dashboard.tsx))**:
  - Aplicar o layout bento-grid do mockup `dashboard_do_personal`.
  - Adicionar cards de métricas rápidas (total de alunos, treinos hoje).
- **Gestão de Alunos ([list.tsx](file:///workspace/artifacts/trainer/students/list.tsx) & [detail.tsx](file:///workspace/artifacts/trainer/students/detail.tsx))**:
  - Melhorar a listagem e o detalhe do aluno conforme os mockups `gest_o_de_alunos_trainer` e `detalhe_do_aluno_coach_1`.
- **Avaliação Física ([assessments/new.tsx](file:///workspace/artifacts/trainer/assessments/new.tsx))**:
  - Implementar o formulário profissional de avaliação física conforme `formul_rio_de_avalia_o_f_sica_profissional`.
- **Builder de Treino ([plans/new.tsx](file:///workspace/artifacts/trainer/plans/new.tsx))**:
  - Refinar a interface de montagem de treinos conforme `builder_de_plano_de_treino_profissional`.

### 3. Dados e Utilitários
- **Mock Data ([mock-data.ts](file:///workspace/artifacts/trainflow/src/lib/mock-data.ts))**:
  - Expandir os dados mockados para incluir históricos, novos exercícios e conversas realistas.

## Premissas e Decisões
- **Mocks**: Manteremos o `AuthProvider` mockado para facilitar a navegação e o desenvolvimento visual.
- **Mobile-first**: O foco principal continua sendo a experiência em dispositivos móveis (PWA).
- **Fidelidade**: Seguiremos rigorosamente as cores, fontes (`Bebas Neue` e `Inter`) e componentes do design original.

## Passos de Verificação
1. Validar a navegação completa do fluxo do Aluno (Login -> Welcome -> Home -> Workout -> Profile).
2. Validar a navegação completa do fluxo do Personal (Dashboard -> Alunos -> Nova Avaliação -> Novo Plano).
3. Verificar a responsividade em diferentes tamanhos de tela (mobile vs desktop).
4. Garantir que `pnpm run build` no frontend seja executado sem erros.
