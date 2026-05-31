# Plano Total de Correcao do TrainFlow

## Resumo
- Objetivo: corrigir os erros funcionais que hoje impedem o uso confiavel do aplicativo, com foco em autenticacao, roteamento, navegacao, integracao frontend/backend e inconsistencias de dados.
- Restricao operacional: a execucao deve ser sequencial, sem disparar varios agentes ou varios fluxos pesados ao mesmo tempo, porque o ambiente trava quando ha concorrencia excessiva.
- Estrategia: atacar primeiro o que quebra acesso e navegacao, depois estabilizar integracao de API/sessao, e por fim corrigir rotas secundarias, links mortos, metricas e fallbacks mascarados por mocks.

## Analise do Estado Atual

### Problemas de autenticacao e sessao
- [auth.tsx](file:///workspace/artifacts/trainflow/src/lib/auth.tsx) ignora a autenticacao real e injeta um usuario mock fixo com `role: "trainer"`.
- [App.tsx](file:///workspace/artifacts/trainflow/src/App.tsx) depende desse provider para `ProtectedRoute`, entao o fluxo de aluno fica efetivamente quebrado e o app empurra o uso para as rotas de treinador.
- [student/login.tsx](file:///workspace/artifacts/trainflow/src/pages/student/login.tsx) e [trainer/login.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/login.tsx) nao autenticam de verdade; apenas redirecionam.
- O logout em [auth.tsx](file:///workspace/artifacts/trainflow/src/lib/auth.tsx) usa `window.location.href = "/login"`, o que ignora base path e nao limpa sessao real.

### Problemas de roteamento e navegacao
- A rota `/t/assessments/new` existe fisicamente em [new.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/assessments/new.tsx), mas nao esta registrada em [App.tsx](file:///workspace/artifacts/trainflow/src/App.tsx), o que explica o 404 encontrado na simulacao.
- A lista de alunos em [list.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/students/list.tsx) gera link para `/t/students/${student.id}` para todos os itens, inclusive quando o ID invalido ou o status nao deveria permitir detalhe.
- A rota `/welcome` esta registrada em [App.tsx](file:///workspace/artifacts/trainflow/src/App.tsx), mas o fluxo atual nao leva o aluno para ela.
- A tela de conversa student em [conversation.tsx](file:///workspace/artifacts/trainflow/src/pages/student/conversation.tsx) aceita `id` potencialmente invalido e cai em fallback silencioso.

### Problemas de integracao frontend/backend
- O frontend usa chamadas relativas `/api/...` pelo client gerado em [api.ts](file:///workspace/lib/api-client-react/src/generated/api.ts), mas a configuracao em [vite.config.ts](file:///workspace/artifacts/trainflow/vite.config.ts) nao mostra proxy de API preparado para um fluxo local comum.
- Existe suporte a `setBaseUrl` em [custom-fetch.ts](file:///workspace/lib/api-client-react/src/custom-fetch.ts), mas isso nao esta claramente inicializado no bootstrap do app.
- Se a sessao depender de cookie, [custom-fetch.ts](file:///workspace/lib/api-client-react/src/custom-fetch.ts) precisa garantir `credentials: "include"` quando necessario.

### Problemas de dados e experiencia
- [dashboard.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/dashboard.tsx) exibe metrica errada em "TOTAL DE ALUNOS" usando `activeStudents` no lugar de `totalStudents`.
- A mesma tela fixa "MENSAGENS" como `0`, ignorando `unreadMessages`.
- Varias paginas usam fallback automatico para mocks quando a API falha, o que esconde erro real e faz parecer que o app funciona melhor do que funciona de fato.
- O perfil student em [profile.tsx](file:///workspace/artifacts/trainflow/src/pages/student/profile.tsx) mostra acao visual sem fluxo implementado.

## Decisoes e Premissas
- A correcao sera feita primeiro no frontend `artifacts/trainflow`, porque a maior parte dos erros observados em uso diario e de fluxo de interface, rotas e auth.
- A execucao sera sequencial, com no maximo um agente especializado por vez quando realmente necessario.
- O objetivo nao e preservar o comportamento atual de preview a qualquer custo; o objetivo e tornar o app coerente entre interface, rotas e backend.
- Onde houver mock para preview, o uso deve ser explicito e controlado por ambiente, nao hardcoded como estado padrao do app.
- O plano abaixo considera que o backend existente em `artifacts/api-server` e a biblioteca `lib/api-client-react` fazem parte da solucao e podem precisar de pequenos ajustes.

## Mudancas Propostas

### Fase 1: Destravar navegacao principal e rotas quebradas

#### 1. Corrigir registro de rotas no frontend
- Arquivo: [App.tsx](file:///workspace/artifacts/trainflow/src/App.tsx)
- O que mudar:
- Importar e registrar a rota de [new.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/assessments/new.tsx) em `/t/assessments/new`.
- Revisar se existem outras paginas ja criadas mas nao roteadas.
- Por que:
- Hoje o botao "NOVA AVALIACAO" no dashboard leva a 404.
- Como:
- Adicionar import da pagina.
- Inserir o `Route` na secao de trainer routes.
- Verificar a ordem das rotas para nao haver colisao com rotas parametrizadas.

#### 2. Corrigir links invalidos da lista de alunos
- Arquivo: [list.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/students/list.tsx)
- O que mudar:
- Evitar criar link de detalhe quando o aluno estiver pendente ou com ID invalido.
- Renderizar card nao clicavel ou fluxo especifico para aluno pendente.
- Por que:
- O fluxo atual manda para detalhes que nao existem ou nao deveriam abrir.
- Como:
- Condicionar o `Link` a `student.status === "active"` e a um ID valido.
- Em itens pendentes, manter a UI visual, mas sem navegacao quebrada.

#### 3. Corrigir validacao de parametros em rotas de detalhe
- Arquivos: [conversation.tsx](file:///workspace/artifacts/trainflow/src/pages/student/conversation.tsx), [detail.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/students/detail.tsx), possiveis rotas similares
- O que mudar:
- Validar `id` e lidar com `NaN`, IDs vazios ou inconsistentes.
- Por que:
- Evita telas "meio abertas" com fallback enganoso.
- Como:
- Fazer guard clause com redirecionamento para lista correspondente ou renderizacao de estado de erro claro.

### Fase 2: Reestruturar autenticacao para que o app use sessao real

#### 4. Substituir auth mockada por fluxo real
- Arquivo: [auth.tsx](file:///workspace/artifacts/trainflow/src/lib/auth.tsx)
- O que mudar:
- Trocar o `mockUser` fixo por leitura real de sessao via `useGetMe`.
- Implementar logout via `useLogout`.
- Por que:
- Esse e o ponto que mais distorce o comportamento do app e invalida testes de quase todas as rotas.
- Como:
- Expor `user`, `isLoading` e `logout` derivados da API.
- Se for necessario manter preview sem backend, proteger isso por flag de ambiente explicita.

#### 5. Consertar login de aluno e treinador
- Arquivos: [student/login.tsx](file:///workspace/artifacts/trainflow/src/pages/student/login.tsx), [trainer/login.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/login.tsx), possivelmente [register.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/register.tsx)
- O que mudar:
- Fazer submit real via hooks do client gerado.
- Invalidar/refazer query de sessao apos login e cadastro.
- Por que:
- Hoje o formulario apenas navega de pagina e nao autentica.
- Como:
- Chamar `mutate` do hook correto.
- Tratar sucesso, erro, loading e toast.
- Garantir uso da query key correta para sessao.

#### 6. Corrigir redirecionamentos centrais
- Arquivo: [App.tsx](file:///workspace/artifacts/trainflow/src/App.tsx)
- O que mudar:
- Revisar `ProtectedRoute` e `RootRedirect` para respeitar sessao real e fluxo de primeiro acesso.
- Por que:
- O aluno nao consegue seguir um fluxo coerente e a rota `/welcome` fica orfa.
- Como:
- Ajustar redirecionamento conforme `user.role`.
- Considerar `isFirstLogin` no retorno de auth, se disponivel.

### Fase 3: Estabilizar comunicacao com API e ambiente local

#### 7. Corrigir bootstrap da base da API
- Arquivos: [main.tsx](file:///workspace/artifacts/trainflow/src/main.tsx), [custom-fetch.ts](file:///workspace/lib/api-client-react/src/custom-fetch.ts), [vite.config.ts](file:///workspace/artifacts/trainflow/vite.config.ts)
- O que mudar:
- Definir estrategia unica para base da API em desenvolvimento e preview.
- Por que:
- Sem isso, o frontend pode estar chamando o servidor errado e mascarando erros.
- Como:
- Opcao preferida: inicializar `setBaseUrl` no bootstrap com `VITE_API_BASE_URL`.
- Opcao complementar: adicionar proxy Vite para `/api` se o fluxo local exigir.

#### 8. Garantir sessao por cookie quando necessario
- Arquivo: [custom-fetch.ts](file:///workspace/lib/api-client-react/src/custom-fetch.ts)
- O que mudar:
- Incluir `credentials: "include"` se o backend usar cookie/sessao cross-origin.
- Por que:
- Sem isso, login pode "funcionar" no backend e falhar silenciosamente no frontend.
- Como:
- Ajustar configuracao padrao do fetch customizado e validar impacto no restante do client.

### Fase 4: Corrigir inconsistencias visiveis de dados

#### 9. Corrigir metricas do dashboard do treinador
- Arquivo: [dashboard.tsx](file:///workspace/artifacts/trainflow/src/pages/trainer/dashboard.tsx)
- O que mudar:
- Exibir `totalStudents` no card de total.
- Exibir `unreadMessages` no card de mensagens.
- Por que:
- Sao erros visiveis, simples e impactam a confianca no produto.
- Como:
- Alinhar a tela ao contrato retornado pela API.
- Ajustar mock correspondente se o modo preview continuar existindo.

#### 10. Revisar mocks para nao mascarar falhas reais
- Arquivos: [mock-data.ts](file:///workspace/artifacts/trainflow/src/lib/mock-data.ts), paginas que fazem fallback automatico
- O que mudar:
- Diferenciar claramente "preview mode" de "erro real de integracao".
- Por que:
- Hoje a UI pode mostrar dados falsos quando deveria denunciar erro.
- Como:
- Restringir fallback por flag de ambiente.
- Em erro real, renderizar estado de erro amigavel em vez de dados fake.

### Fase 5: Corrigir links mortos e fluxos incompletos

#### 11. Revisar acoes visuais sem navegacao real
- Arquivos: [profile.tsx](file:///workspace/artifacts/trainflow/src/pages/student/profile.tsx) e demais telas com botoes nao conectados
- O que mudar:
- Conectar acoes a rotas reais ou remover/desabilitar temporariamente.
- Por que:
- Botoes "bonitos" sem fluxo funcional viram erro de produto no uso diario.
- Como:
- Levantar cada CTA sem handler.
- Escolher entre implementar, desabilitar ou rotular como em breve.

#### 12. Revisar navegacao global student e trainer
- Arquivos: [student-bottom-nav.tsx](file:///workspace/artifacts/trainflow/src/components/student-bottom-nav.tsx), [trainer-bottom-nav.tsx](file:///workspace/artifacts/trainflow/src/components/trainer-bottom-nav.tsx)
- O que mudar:
- Validar se todas as rotas expostas existem e se o estado ativo corresponde ao caminho real.
- Por que:
- Menus fixos sao a base da experiencia diaria; qualquer erro aqui tem alto impacto.
- Como:
- Conferir consistencia com [App.tsx](file:///workspace/artifacts/trainflow/src/App.tsx).
- Ajustar nomes, paths e destaque ativo.

## Ordem de Execucao Recomendada
- Etapa 1: corrigir [App.tsx](file:///workspace/artifacts/trainflow/src/App.tsx) e rotas quebradas.
- Etapa 2: corrigir [auth.tsx](file:///workspace/artifacts/trainflow/src/lib/auth.tsx) e os dois logins.
- Etapa 3: estabilizar integracao API em [main.tsx](file:///workspace/artifacts/trainflow/src/main.tsx), [vite.config.ts](file:///workspace/artifacts/trainflow/vite.config.ts) e [custom-fetch.ts](file:///workspace/lib/api-client-react/src/custom-fetch.ts).
- Etapa 4: corrigir dashboards, listas e detalhes.
- Etapa 5: revisar fallbacks, CTAs incompletos e navegacao secundaria.

## Delegacao Sequencial para Agentes
- Agente 1, sequencial: auditoria/implementacao de rotas e navegacao.
- Agente 2, sequencial apos concluir Agente 1: autenticacao, login e guards.
- Agente 3, sequencial apos concluir Agente 2: integracao API, base URL, sessao e fetch.
- Agente 4, sequencial apos concluir Agente 3: ajustes finos de dados, mocks e UX residual.
- Regra operacional: nunca rodar mais de um agente pesado ao mesmo tempo neste ambiente.

## Verificacao
- Abrir o app como treinador e validar:
- dashboard abre sem 404;
- "VER ALUNOS" abre lista;
- "NOVA AVALIACAO" abre pagina correta;
- aluno pendente nao gera detalhe quebrado;
- metricas refletem dados corretos.
- Abrir o app como aluno e validar:
- login autentica de verdade;
- `/home`, `/welcome`, `/treinos`, `/chat`, `/profile` respeitam `ProtectedRoute`;
- conversa invalida redireciona ou mostra erro apropriado.
- Validar sessao:
- login persiste;
- logout limpa sessao e redireciona corretamente;
- reload da pagina nao injeta usuario falso.
- Validar integracao:
- requests vao para a API correta;
- cookies/sessao funcionam se esse for o modelo adotado;
- nao ha fallback silencioso para mocks em erro real.
- Rodar diagnosticos/lint nos arquivos alterados e fazer nova simulacao manual no navegador, em fluxo sequencial.

## Resultado Esperado
- O aplicativo deixa de parecer funcional apenas por mock e passa a ser funcional de fato nos fluxos principais.
- As paginas deixam de quebrar em uso diario.
- O ambiente continua estavel porque a execucao e a verificacao seguirao de forma sequencial, sem paralelismo agressivo.
