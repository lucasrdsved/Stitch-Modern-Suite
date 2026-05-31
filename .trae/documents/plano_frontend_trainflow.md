# Plano de Implementação do Frontend: TrainFlow

## Resumo
Este plano descreve a integração e o refinamento do frontend do TrainFlow utilizando os mockups HTML fornecidos na pasta `attached_assets`. A implementação será feita **uma página/componente de cada vez**, garantindo a qualidade visual, responsividade e integração com os hooks da API já existentes.

## Estado Atual
O repositório já possui as dependências instaladas, o Vite configurado e os arquivos base do React (roteamento com Wouter, React Query). No entanto, o visual atual das páginas está em um estado "rascunho" ou básico. Os mockups finais em HTML (que utilizam Tailwind CSS) estão prontos para serem extraídos e adaptados para os componentes React do shadcn/ui.

## Passos de Implementação (Execução Passo a Passo)

### Passo 1: Configuração Base e Estilos Globais
- **O que:** Atualizar `index.css` e o arquivo `App.tsx`/`main.tsx` para garantir que o tema "Dark Mode" esteja consistente com os mockups (usando as cores corretas, como o accent Lime `#C8F135`, fontes `Bebas Neue` e `Inter`).
- **Arquivos alvo:** `artifacts/trainflow/src/index.css`, `artifacts/trainflow/tailwind.config.ts` (ou configurações no CSS).
- **Referência:** `attached_assets/stitch_extracted/.../high_performance_athletic/DESIGN.md`.

### Passo 2: Fluxo de Autenticação (Aluno)
- **O que:** Melhorar o visual da página de Login do Aluno e a tela de Boas-vindas (Onboarding).
- **Arquivos alvo:** `artifacts/trainflow/src/pages/student/login.tsx` e `welcome.tsx`.
- **Referência:** `login_do_aluno_dark_mode`, `boas_vindas_do_aluno_dark_mode`.

### Passo 3: Área do Aluno - Dashboard e Navegação
- **O que:** Implementar o dashboard principal do aluno (Home) e a barra de navegação inferior (Bottom Nav).
- **Arquivos alvo:** `artifacts/trainflow/src/pages/student/home.tsx`.
- **Referência:** `dashboard_do_aluno_dark_mode`.

### Passo 4: Área do Aluno - Player de Treino
- **O que:** Implementar a visualização da lista de treinos e o Player de Treino (modo foco total).
- **Arquivos alvo:** `artifacts/trainflow/src/pages/student/workout.tsx` (e criar sub-rotas/componentes para o player ativo se necessário).
- **Referência:** `player_de_treino_dark_mode_1`, `player_de_treino_modo_foco_total`.

### Passo 5: Área do Aluno - Perfil e Histórico
- **O que:** Implementar a visualização do perfil do aluno, contendo histórico de medidas e gráficos.
- **Arquivos alvo:** `artifacts/trainflow/src/pages/student/profile.tsx`.
- **Referência:** `perfil_do_aluno`.

### Passo 6: Área do Personal - Dashboard e Autenticação
- **O que:** Ajustar o Login/Registro do Personal e seu Dashboard principal.
- **Arquivos alvo:** `artifacts/trainflow/src/pages/trainer/login.tsx`, `register.tsx`, `dashboard.tsx`.
- **Referência:** `dashboard_do_personal`.

### Passo 7: Área do Personal - Gestão de Alunos
- **O que:** Listagem de alunos e visualização detalhada do perfil do aluno pelo lado do personal.
- **Arquivos alvo:** `artifacts/trainflow/src/pages/trainer/students/list.tsx`, `detail.tsx`.
- **Referência:** `gest_o_de_alunos_trainer`, `detalhe_do_aluno_coach_1`.

### Passo 8: Área do Personal - Avaliação Física
- **O que:** Formulário profissional de avaliação física, com múltiplos passos.
- **Arquivos alvo:** `artifacts/trainflow/src/pages/trainer/assessments/new.tsx`.
- **Referência:** `formul_rio_de_avalia_o_f_sica_profissional`.

### Passo 9: Área do Personal - Builder de Treino
- **O que:** Interface para montagem de planos de treino (seleção de exercícios, séries, repetições).
- **Arquivos alvo:** `artifacts/trainflow/src/pages/trainer/plans/new.tsx`, `detail.tsx`.
- **Referência:** `builder_de_plano_de_treino_profissional`.

### Passo 10: Sistema de Chat (Ambas as Visões)
- **O que:** Melhorar as telas de listagem de mensagens e a tela de conversa (chat) tanto para o Aluno quanto para o Personal.
- **Arquivos alvo:** `artifacts/trainflow/src/pages/student/chat.tsx`, `conversation.tsx` (e equivalentes no trainer se houver).
- **Referência:** `mensagens_do_personal_conversa`.

## Regras de Implementação
1. Seguir rigorosamente o padrão visual dos mockups HTML.
2. Não alterar a estrutura do backend/banco de dados (foco estrito no frontend).
3. Testar a compilação e a renderização de cada página antes de passar para a próxima.
4. Preservar a integração existente com os hooks gerados (`@workspace/api-client-react`).
