# Plano de Execucao Mock-First Total do TrainFlow

## Summary
- Objetivo: deixar o frontend do TrainFlow totalmente funcional usando apenas dados mockados, sem depender da disponibilidade dos endpoints reais.
- Resultado esperado: login, navegacao, listagens, detalhes, criacao de plano, avaliacao e conversa funcionam de ponta a ponta para aluno e trainer com estado local consistente.
- Estrategia: substituir o estado mock estatico por um modo mock persistente e mutavel, corrigir rotas quebradas e remover os pontos em que a UX ainda depende do sucesso das chamadas dos hooks gerados.

## Current State Analysis

### Arquitetura atual
- O app centraliza rotas protegidas em [App.tsx](file:///workspace/artifacts/trainflow/src/App.tsx) usando `wouter`, `QueryClientProvider` e `AuthProvider`.
- O estado de autenticacao atual em [auth.tsx](file:///workspace/artifacts/trainflow/src/lib/auth.tsx) esta hardcoded em um unico usuario trainer, o que bloqueia o fluxo real do aluno e invalida a protecao por papel.
- Os dados mockados estao concentrados em [mock-data.ts](file:///workspace/artifacts/trainflow/src/lib/mock-data.ts), mas hoje sao majoritariamente estaticos e nao representam alteracoes feitas pela interface.

### Pontos que impedem o modo mock total
- As telas ainda chamam hooks de API em varios pontos, como [home.tsx](file:///workspace/artifacts/trainflow/src/pages/student/home.tsx), [dashboard.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/dashboard.tsx), [list.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/students/list.tsx), [detail.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/students/detail.tsx) e [conversation.tsx](file:///workspace/artifacts/trainflow/src/pages/student/conversation.tsx).
- O login do aluno em [login.tsx](file:///workspace/artifacts/trainflow/src/pages/student/login.tsx) apenas redireciona para `/home` e o login do trainer em [login.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/login.tsx) apenas redireciona para `/t/dashboard`, sem gravar sessao mock.
- O cadastro do trainer em [register.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/register.tsx) ainda tenta usar mutacao real.

### Inconsistencias de navegacao
- As rotas oficiais do trainer em [App.tsx](file:///workspace/artifacts/trainflow/src/App.tsx) usam prefixo `/t/...`, mas varias telas apontam para caminhos sem esse prefixo.
- O dashboard do trainer em [dashboard.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/dashboard.tsx) linka para `/students`, `/assessments/new` e `/plans/new`, que nao existem no roteador atual.
- A lista de alunos em [list.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/students/list.tsx) usa `/dashboard` e `/students/:id`, tambem fora do mapa real.
- O detalhe do aluno em [detail.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/students/detail.tsx) usa `useRoute("/students/:id")`, navega de volta para `/students` e abre chat em `/chat/:id`, o que cai no fluxo protegido do aluno em vez do fluxo do trainer.
- A tela de novo plano em [new.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/plans/new.tsx) salva e redireciona para `/dashboard`, que tambem nao existe no roteador.

### Estado atual dos fluxos
- O fluxo visual do aluno ja esta forte, com home, treino, conversa e perfil bem avancados.
- O fluxo do trainer tambem esta visualmente forte, mas nao fecha operacionalmente por causa de rotas inconsistentes e formularios ainda conectados ao comportamento de API real.
- O tema e as dependencias necessarias para um modo mock total ja existem em [package.json](file:///workspace/artifacts/trainflow/package.json), incluindo `react`, `wouter`, `framer-motion` e `recharts`.

## Proposed Changes

### 1. Base de modo mock persistente

#### [auth.tsx](file:///workspace/artifacts/trainflow/src/lib/auth.tsx)
- O que mudar: substituir o `mockUser` fixo por uma sessao mock controlada e persistida.
- Por que: o app precisa alternar corretamente entre aluno e trainer sem backend e manter o papel ativo apos refresh.
- Como:
  - armazenar a sessao mock em `localStorage` com `role`, `fullName`, `email`, `avatarUrl` e `id`;
  - expor helpers de `loginAsStudent`, `loginAsTrainer`, `logout` e `switchRole`;
  - iniciar sem usuario logado por padrao e restaurar sessao mock ao montar o provider;
  - manter `useAuth()` como ponto unico de leitura do usuario atual.

#### Novo arquivo em `src/lib/` para estado mock mutavel
- O que mudar: adicionar um modulo de estado mock persistente para conversas, mensagens, planos, avaliacoes e entidades basicas.
- Por que: [mock-data.ts](file:///workspace/artifacts/trainflow/src/lib/mock-data.ts) hoje serve como seed, mas nao permite que a interface altere o estado de forma duravel.
- Como:
  - usar [mock-data.ts](file:///workspace/artifacts/trainflow/src/lib/mock-data.ts) como fonte inicial;
  - criar funcoes de leitura/escrita em `localStorage` para colecoes de `students`, `plans`, `assessments`, `conversations` e `messages`;
  - garantir reset facil para voltar ao estado seed durante desenvolvimento;
  - manter os tipos simples e alinhados com o formato ja usado nas telas atuais.

#### [mock-data.ts](file:///workspace/artifacts/trainflow/src/lib/mock-data.ts)
- O que mudar: reorganizar os mocks como seeds oficiais do app e completar campos faltantes para todos os fluxos.
- Por que: o plano depende de uma base de dados mock coerente entre telas e papeis.
- Como:
  - completar usuarios mock de aluno e trainer;
  - incluir relacoes consistentes entre aluno, plano, avaliacoes, conversas e mensagens;
  - adicionar seeds de avaliacao e plano que possam ser listados e detalhados;
  - manter um formato unico que o modulo de estado mock possa clonar ao iniciar.

### 2. Autenticacao mock e entrada nos fluxos

#### [login.tsx](file:///workspace/artifacts/trainflow/src/pages/student/login.tsx)
- O que mudar: converter o login do aluno para usar autenticacao mock local.
- Por que: hoje o submit ignora estado e apenas navega, o que nao sustenta o fluxo protegido.
- Como:
  - remover dependencia operacional de `useStudentMagicLogin()` no modo mock;
  - usar o `AuthProvider` para iniciar sessao mock de aluno;
  - manter o campo de codigo apenas como UX, sem validacao remota;
  - redirecionar para `/welcome` no primeiro acesso mock e para `/home` nos acessos seguintes.

#### [login.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/login.tsx)
- O que mudar: converter o login do trainer para sessao mock local.
- Por que: o dashboard precisa abrir de forma confiavel mesmo sem API.
- Como:
  - remover dependencia operacional de `useTrainerLogin()` no submit;
  - iniciar sessao mock de trainer no `AuthProvider`;
  - manter o formulario visual atual;
  - redirecionar para `/t/dashboard`.

#### [register.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/register.tsx)
- O que mudar: transformar o cadastro em criacao local de conta trainer mock.
- Por que: o fluxo precisa fechar completamente no modo mock sem falhar em mutacao remota.
- Como:
  - remover dependencia operacional de `useTrainerRegister()` quando o modo mock estiver ativo;
  - criar usuario trainer local, gravar sessao mock e navegar para `/t/dashboard`;
  - usar `toast` apenas para feedback local de sucesso ou erro de validacao.

### 3. Correcao de rotas e coerencia de navegacao

#### [App.tsx](file:///workspace/artifacts/trainflow/src/App.tsx)
- O que mudar: consolidar o roteamento para refletir exatamente os caminhos que a interface deve usar em modo mock.
- Por que: varias telas hoje apontam para URLs que nao existem, o que quebra o fluxo mesmo quando a UI parece pronta.
- Como:
  - manter `/home`, `/welcome`, `/profile`, `/treinos`, `/chat` e `/chat/:id` para o aluno;
  - manter `/t/dashboard`, `/t/students`, `/t/students/:id`, `/t/plans/new`, `/t/plans/:id`, `/t/login` e `/t/register` para o trainer;
  - adicionar, se necessario, alias temporarios de redirecionamento apenas para impedir rotas quebradas durante a migracao das telas;
  - garantir que `RootRedirect` respeite a sessao mock persistida.

#### [dashboard.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/dashboard.tsx)
- O que mudar: corrigir todos os `Link` do trainer para o namespace `/t/...`.
- Por que: os cards principais hoje levam para rotas inexistentes.
- Como:
  - trocar `/students` por `/t/students`;
  - trocar `/assessments/new` por uma rota valida do trainer definida no roteador;
  - trocar `/plans/new` por `/t/plans/new`;
  - manter o dashboard como hub principal do trainer.

#### [list.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/students/list.tsx)
- O que mudar: corrigir navegação de retorno e detalhe.
- Por que: o arquivo hoje volta para `/dashboard` e abre detalhe em `/students/:id`, ambos divergentes do roteador.
- Como:
  - trocar retorno para `/t/dashboard`;
  - trocar detalhe para `/t/students/:id`;
  - manter busca local simples filtrando os mocks em memoria.

#### [detail.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/students/detail.tsx)
- O que mudar: alinhar o parser de rota e os links internos com o namespace do trainer.
- Por que: o componente hoje usa `useRoute("/students/:id")` e links que escapam do fluxo do trainer.
- Como:
  - trocar para `useRoute("/t/students/:id")`;
  - trocar links de retorno para `/t/students`;
  - trocar link de plano para `/t/plans/new`;
  - substituir o CTA de chat por uma acao valida no modo mock do trainer, sem cair no chat protegido do aluno;
  - usar as avaliacoes mock do aluno para preencher a timeline em vez de placeholders soltos.

#### [new.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/plans/new.tsx)
- O que mudar: corrigir navegacao e persistir o plano criado no estado mock mutavel.
- Por que: o builder hoje coleta dados, mas nao grava nada de forma reutilizavel nem volta para uma rota valida.
- Como:
  - trocar links `/dashboard` por `/t/dashboard`;
  - salvar o plano no repositorio mock local;
  - redirecionar para `/t/students/:id` ou `/t/plans/:id` conforme o contexto do plano criado;
  - manter a biblioteca de exercicios baseada em [mock-data.ts](file:///workspace/artifacts/trainflow/src/lib/mock-data.ts).

### 4. Fluxo do aluno 100% operacional com mocks

#### [home.tsx](file:///workspace/artifacts/trainflow/src/pages/student/home.tsx)
- O que mudar: substituir dependencia operacional dos hooks por leitura do estado mock local.
- Por que: o dashboard precisa carregar sempre, inclusive offline e sem erro de rede.
- Como:
  - ler treino do dia, ultimas sessoes e preview de conversa do repositorio mock;
  - manter o layout atual;
  - exibir fallback vazio controlado quando nao houver treino ou conversa no estado local.

#### [conversation.tsx](file:///workspace/artifacts/trainflow/src/pages/student/conversation.tsx)
- O que mudar: trocar o envio de mensagem para atualizacao local de conversa.
- Por que: o chat precisa realmente funcionar no modo mock, incluindo envio e exibicao imediata.
- Como:
  - substituir `useSendMessage()` por append local no estado mock;
  - resolver `messages` pelo `conversationId` no repositorio mock;
  - atualizar `lastMessage`, `updatedAt` e `unreadCount` conforme o papel do usuario;
  - manter o visual atual e o scroll automatico.

#### [chat.tsx](file:///workspace/artifacts/trainflow/src/pages/student/chat.tsx)
- O que mudar: ler a lista de conversas do estado mock mutavel.
- Por que: a conversa enviada precisa refletir imediatamente na listagem.
- Como:
  - remover dependencia operacional de `useListConversations()` no modo mock;
  - ordenar por `updatedAt`;
  - manter badge de nao lidas e horario do ultimo contato.

#### [workout.tsx](file:///workspace/artifacts/trainflow/src/pages/student/workout.tsx)
- O que mudar: ligar o player e o historico ao estado mock local.
- Por que: concluir treino deve alterar historico e fazer sentido entre telas.
- Como:
  - usar o seed de treino do dia como sessao ativa;
  - ao concluir treino, registrar sessao finalizada no estado mock;
  - refletir essa sessao em [home.tsx](file:///workspace/artifacts/trainflow/src/pages/student/home.tsx) e no proprio historico.

#### [profile.tsx](file:///workspace/artifacts/trainflow/src/pages/student/profile.tsx)
- O que mudar: alimentar metricas e historico com avaliacao mock persistente.
- Por que: o perfil precisa continuar util sem depender do endpoint de avaliacao.
- Como:
  - ler a ultima avaliacao do repositorio mock;
  - manter o grafico com historico seed;
  - garantir que logout limpe a sessao mock e retorne para `/login`.

### 5. Fluxo do trainer 100% operacional com mocks

#### [dashboard.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/dashboard.tsx)
- O que mudar: ler indicadores do estado mock local, inclusive mensagens pendentes e atividade recente.
- Por que: os indicadores precisam refletir alteracoes feitas no proprio app.
- Como:
  - montar `activeStudents`, `sessionsToday`, `recentActivity` e mensagens pendentes a partir do repositorio mock;
  - remover dependencia operacional do hook remoto quando o modo mock estiver ativo.

#### [list.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/students/list.tsx)
- O que mudar: usar lista mock local com filtro de busca.
- Por que: a pagina precisa continuar funcional mesmo sem API e servir como navegacao principal do trainer.
- Como:
  - ler estudantes do repositorio mock;
  - filtrar por nome e email no cliente;
  - manter status e avatar conforme os seeds.

#### [detail.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/students/detail.tsx)
- O que mudar: carregar aluno, plano ativo e historico de avaliacao do estado mock local.
- Por que: o detalhe do aluno precisa ser confiavel e consistente com planos e avaliacoes criadas localmente.
- Como:
  - resolver o aluno pelo `id` da rota;
  - exibir o plano criado localmente quando existir;
  - popular a secao de historico com eventos mock reais do aluno.

#### Nova tela ou ajuste de rota para avaliacao do trainer
- O que mudar: manter uma rota valida e navegavel para criacao de avaliacao do trainer no namespace `/t/...`.
- Por que: os CTAs atuais apontam para um fluxo que precisa fechar no modo mock.
- Como:
  - alinhar a rota usada pelo dashboard e pelo detalhe do aluno com a tela existente de nova avaliacao;
  - salvar a avaliacao criada no estado mock;
  - refletir a ultima avaliacao no perfil do aluno detalhado.

### 6. Confiabilidade visual e estados vazios

#### [student-bottom-nav.tsx](file:///workspace/artifacts/trainflow/src/components/student-bottom-nav.tsx)
- O que mudar: padronizar labels para o idioma da interface final e garantir marcacao correta da aba ativa.
- Por que: a navegacao inferior aparece em praticamente todo o fluxo do aluno e precisa ficar coerente com o restante do app.
- Como:
  - trocar labels em ingles por labels finais da experiencia;
  - manter a logica atual de destaque por rota.

#### Telas com loaders dependentes de hooks
- O que mudar: substituir `isLoading` vindo de hooks remotos por um bootstrap local rapido do estado mock.
- Por que: no modo mock total nao faz sentido depender de loading de rede para renderizar dados locais.
- Como:
  - usar estado inicial sincrono para leitura do repositorio mock;
  - manter loaders apenas quando houver transicoes locais relevantes.

## Assumptions & Decisions
- O objetivo e **mock-first total**, nao integracao parcial com API real.
- O fluxo deve funcionar mesmo sem backend disponivel, inclusive apos refresh da pagina.
- O namespace oficial do trainer permanece `/t/...` e as telas serao ajustadas para seguir esse contrato.
- O estado mock sera persistido em `localStorage` para permitir sessao, criacao de plano, nova avaliacao e mensagens locais.
- [mock-data.ts](file:///workspace/artifacts/trainflow/src/lib/mock-data.ts) sera tratado como seed inicial, nao como fonte unica imutavel.
- Onde hoje existe hook de API e seed local ao mesmo tempo, o modo mock passara a preferir o repositorio local como verdade.
- O chat do trainer com aluno nao sera acoplado ao mesmo fluxo protegido do aluno; ele tera acao local coerente com o namespace do trainer.

## Verification steps
1. Validar login mock de aluno, refresh do navegador, acesso a `/welcome`, `/home`, `/treinos`, `/chat/:id` e `/profile`.
2. Validar login mock de trainer, refresh do navegador, acesso a `/t/dashboard`, `/t/students`, `/t/students/:id` e `/t/plans/new`.
3. Criar um plano no builder do trainer e confirmar reflexo no detalhe do aluno.
4. Criar uma avaliacao no fluxo do trainer e confirmar reflexo no detalhe do aluno e nos dados mock persistidos.
5. Enviar mensagens na conversa do aluno e confirmar atualizacao imediata na lista de conversas.
6. Concluir treino do aluno e confirmar reflexo no historico da tela de treinos e no dashboard.
7. Validar logout para aluno e trainer e confirmar limpeza da sessao mock.
8. Executar `pnpm --filter @workspace/trainflow typecheck`.
9. Executar `pnpm --filter @workspace/trainflow build`.
