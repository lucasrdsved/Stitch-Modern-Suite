# TrainFlow — Especificação Mestre do Produto
**Versão 2.0 | Independente de plataforma**

---

## 1. O que é o TrainFlow

O TrainFlow é uma Progressive Web Application (PWA) projetada para conectar personal trainers aos seus alunos, oferecendo duas experiências de usuário distintas e otimizadas dentro de um único codebase. Uma interface é dedicada ao aluno para acompanhamento e execução de treinos, enquanto a outra capacita o personal trainer com ferramentas de gerenciamento. A aplicação opera de forma robusta offline, proporcionando uma experiência semelhante a um aplicativo nativo e é instalável em dispositivos Android e iOS.

É fundamental destacar que o acesso do aluno é sempre iniciado pelo personal trainer, especificamente durante o processo de avaliação física inicial, garantindo um controle centralizado e personalizado do onboarding.

---

## 2. Stack Recomendada

A arquitetura do TrainFlow é baseada em tecnologias modernas para garantir performance, escalabilidade e uma excelente experiência de usuário. A stack principal é a seguinte:

| Camada | Tecnologia |
|---|---|
| **Framework Frontend** | React + Vite (SPA) |
| **Roteamento** | TanStack Router |
| **PWA / Service Worker** | Vite PWA Plugin (Workbox) |
| **Backend & Autenticação** | Supabase (Postgres + Auth + Realtime + Storage) |
| **Estilização** | Tailwind CSS v4 + shadcn/ui |
| **Animações** | Motion (ex-Framer Motion) |
| **Drag & Drop** | @dnd-kit/sortable |
| **Armazenamento Offline** | idb (IndexedDB wrapper) |
| **Áudio** | Howler.js |
| **Push Notifications** | web-push (servidor) + PushManager (cliente) |
| **Gerenciamento de Estado** | Zustand |
| **Deploy** | Vercel (SPA estática) |

> **Nota sobre o Framework Frontend:** Embora a stack recomendada priorize **React com Vite** para uma Single Page Application (SPA) leve e rápida, é importante notar que a lógica de negócio central, o schema do banco de dados, as políticas de Row Level Security (RLS), os hooks e a estratégia offline são agnósticos ao framework. Uma alternativa viável, especialmente para projetos que se beneficiam de renderização no servidor ou geradores de código como Lovable/v0.dev/Bolt, seria utilizar **Next.js 14 App Router com Serwist** para PWA. A escolha final pode ser adaptada conforme as necessidades específicas do projeto e a familiaridade da equipe de desenvolvimento, mantendo a consistência na camada de dados e lógica de sincronização offline.

> **Nota sobre a Lógica de Orientação de Treino:** A geração da "orientação de treino personalizada" mencionada na Seção 5 e 6.3 será implementada como um motor de regras baseado nos dados da avaliação física e na classificação somatotípica. Não haverá integração direta com modelos de Inteligência Artificial generativa (LLMs) externos para esta funcionalidade, garantindo previsibilidade e controle sobre as recomendações. A lógica será desenvolvida internamente para calcular e apresentar as orientações de forma estruturada, conforme o `interface TrainingOrientation` definido.

---

## 3. Design

Com base na análise do design "Fitness Tracker App" no Figma, as seguintes diretrizes foram estabelecidas para o TrainFlow, garantindo uma interface moderna, energética e funcional.

### 3.1. Paleta de Cores e Atmosfera

O design utiliza um esquema de cores de alto contraste, ideal para ambientes de fitness e visibilidade rápida.

*   **Fundo Principal:** `#000000` (Preto puro) ou `#0a0a0a` (Preto profundo).
*   **Cor de Destaque (Ação):** `#C8F135` (Lime elétrico / Volt) — usado para botões principais, indicadores de progresso ativos e elementos de destaque.
*   **Superfícies Secundárias:** `#1A1A1A` (Cinza muito escuro) para cards e seções.
*   **Texto Primário:** `#FFFFFF` (Branco).
*   **Texto Secundário:** `#888888` (Cinza médio) para labels e informações de suporte.
*   **Cores de Status:**
    *   Sucesso/Progresso: `#C8F135` (Lime).
    *   Alerta/Atenção: `#FFB800` (Amarelo/Âmbar).

### 3.2. Tipografia

A tipografia foca em legibilidade e impacto visual.

*   **Headings e Números:** `Bebas Neue` (ou similar sem-serifa condensada e impactante). Usada para títulos de seções, contadores de tempo e números grandes de calorias/passos.
*   **Corpo de Texto:** `Inter` ou `DM Sans`. Uma fonte geométrica limpa para textos de leitura, inputs e descrições.
*   **Hierarquia:**
    *   H1 (Títulos de Tela): 32px+, Bold.
    *   H2 (Subtítulos): 20px, Semi-bold.
    *   Body: 14px - 16px, Regular.

### 3.3. Componentes de UI

*   **Cards:**
    *   Bordas arredondadas: `24px` ou `32px` para um visual moderno e "suave".
    *   Fundo: `#1A1A1A`.
    *   Sem bordas visíveis ou com bordas muito sutis (`1px solid #333`).
*   **Botões:**
    *   Botão Principal: Fundo Lime (`#C8F135`), texto Preto, bordas arredondadas (`12px` ou `full`).
    *   Botão Secundário: Outline ou fundo cinza escuro com texto branco.
*   **Inputs:**
    *   Fundo escuro, bordas arredondadas, foco com borda Lime.
*   **Navegação:**
    *   Barra inferior (Bottom Nav) flutuante ou fixa com fundo translúcido (glassmorphism) e ícones minimalistas.

### 3.4. Elementos Visuais e Layout

*   **Dashboard de Atividade:** Uso de anéis de progresso circulares ou barras de progresso grossas em Lime para visualização rápida de metas.
*   **Imagens/GIFs:** Bordas arredondadas em todos os elementos visuais para manter a consistência com os cards.
*   **Espaçamento:** Uso generoso de "white space" (neste caso, "black space") para evitar poluição visual, focando a atenção nos dados de performance.
*   **Glassmorphism:** Uso sutil de efeitos de desfoque de fundo em modais e barras de navegação para adicionar profundidade.

---

## 4. Banco de Dados (Supabase Postgres)

Criar todas as migrations em `supabase/migrations/`.

```sql
-- Perfis de usuário
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('trainer', 'student')),
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Vínculo trainer-aluno
create table public.trainer_students (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id),
  student_id uuid references public.profiles(id),
  email text not null,
  status text not null default 'invited' check (status in ('invited', 'active', 'inactive')),
  invited_at timestamptz default now(),
  unique(trainer_id, email)
);

-- Avaliação física (criada pelo personal, gera a conta do aluno)
create table public.physical_assessments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  trainer_id uuid not null references public.profiles(id),
  assessed_at timestamptz default now(),

  -- Dados antropométricos básicos
  age int not null,
  sex text not null check (sex in ('M', 'F')),
  weight_kg numeric(5,2) not null,
  height_cm numeric(5,1) not null,

  -- Dobras cutâneas (mm) — protocolo Pollock 7 dobras ou 3 dobras
  skinfold_chest numeric(5,2),
  skinfold_abdomen numeric(5,2),
  skinfold_thigh numeric(5,2),
  skinfold_triceps numeric(5,2),
  skinfold_subscapular numeric(5,2),
  skinfold_suprailiac numeric(5,2),
  skinfold_midaxillary numeric(5,2),

  -- Circunferências (cm)
  circ_waist numeric(5,1),
  circ_hip numeric(5,1),
  circ_chest numeric(5,1),
  circ_arm_relaxed numeric(5,1),
  circ_arm_contracted numeric(5,1),
  circ_thigh numeric(5,1),
  circ_calf numeric(5,1),

  -- Resultados calculados (preenchidos automaticamente)
  body_density numeric(7,6),         -- g/cm³, fórmula Siri
  body_fat_pct numeric(5,2),         -- % gordura
  fat_mass_kg numeric(5,2),
  lean_mass_kg numeric(5,2),
  bmi numeric(5,2),                  -- IMC kg/m²
  waist_hip_ratio numeric(4,3),      -- Relação cintura/quadril

  -- Classificação somatotípica
  somatotype text check (somatotype in ('ectomorph', 'mesomorph', 'endomorph', 'ecto_meso', 'endo_meso')),
  somatotype_score jsonb,            -- { ectomorphy: 2.1, mesomorphy: 4.5, endomorphy: 3.2 }

  -- Orientação gerada
  training_orientation jsonb,        -- ver estrutura abaixo
  orientation_generated_at timestamptz,

  notes text
);

-- Histórico de avaliações (cada avaliação cria um novo registro — não substituir)

-- Exercícios (globais + custom do trainer)
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid references public.profiles(id),
  name text not null,
  description text,
  muscle_group text,
  equipment text,
  gif_url text,
  audio_url text,
  is_global boolean default false,
  created_at timestamptz default now()
);

-- Planos de treino
create table public.training_plans (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id),
  student_id uuid not null references public.profiles(id),
  name text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Dias do plano
create table public.plan_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.training_plans(id) on delete cascade,
  name text not null,
  day_order int not null
);

-- Exercícios do dia
create table public.day_exercises (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.plan_days(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  sets int,
  reps text,
  rest_seconds int default 60,
  notes text,
  exercise_order int not null
);

-- Sessões de treino
create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  client_uuid uuid not null unique,
  student_id uuid not null references public.profiles(id),
  plan_day_id uuid references public.plan_days(id),
  started_at timestamptz not null,
  finished_at timestamptz,
  synced_at timestamptz default now()
);

-- Séries executadas
create table public.session_sets (
  id uuid primary key default gen_random_uuid(),
  client_uuid uuid not null unique,
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  day_exercise_id uuid references public.day_exercises(id),
  set_number int not null,
  reps_done int,
  weight_kg numeric(6,2),
  recorded_at timestamptz not null
);

-- Conversas (diretas e em grupo)
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('direct', 'group')),
  name text,
  trainer_id uuid not null references public.profiles(id),
  created_at timestamptz default now()
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (conversation_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  content text not null,
  sent_at timestamptz default now(),
  read_at timestamptz
);

-- Push notifications
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now(),
  unique(user_id, endpoint)
);
```

### RLS (Row Level Security)

Habilitar em todas as tabelas. Políticas principais:

- `profiles`: própria linha + trainer lê alunos vinculados
- `physical_assessments`: trainer do aluno tem full access; aluno lê as próprias
- `exercises`: todos leem globais; trainer CRUD nas próprias
- `training_plans`: trainer full access; aluno lê o próprio
- `workout_sessions` + `session_sets`: aluno owner
- `conversations` + `messages`: apenas membros
- `push_subscriptions`: própria linha

---

## 5. Fluxo de Criação de Conta — Regra Central

**O aluno nunca cria a própria conta.** O fluxo é:

```
Personal realiza avaliação física
         ↓
Preenche o formulário de avaliação no app (nome, email, dados físicos)
         ↓
Sistema calcula composição corporal e somatótipo automaticamente
         ↓
IA gera orientação de treino personalizada
         ↓
Sistema cria a conta do aluno via Supabase Admin API
         ↓
Aluno recebe email com magic link
         ↓
Aluno clica, acessa app pela primeira vez, vê a tela de boas-vindas
         ↓
Tela de boas-vindas mostra o somatótipo e a orientação de treino
```

**API Route:** `POST /api/auth/new-student`

```typescript
// Requer autenticação de trainer (valida JWT)
// 1. Recebe: { full_name, email, assessment_data }
// 2. Calcula: body_fat_pct, somatotype, training_orientation
// 3. Cria conta: supabase.auth.admin.inviteUserByEmail(email)
//    - Se email já existe: generateLink({ type: 'magiclink', email })
// 4. Cria: profiles { role: 'student' }
// 5. Cria: trainer_students { status: 'invited' }
// 6. Insere: physical_assessments com todos os resultados
// 7. Retorna: { student_id, somatotype, orientation }
// Usa SUPABASE_SERVICE_ROLE_KEY — nunca expor ao cliente
```

---

## 6. Sistema de Avaliação Física e Classificação Somatotípica

### 6.1 Protocolos de cálculo (normas brasileiras / referências ACSM)

**Densidade corporal — Pollock 7 dobras:**
```
Homens:   DC = 1.112 − (0.00043499 × Σ7) + (0.00000055 × Σ7²) − (0.00028826 × idade)
Mulheres: DC = 1.097 − (0.00046971 × Σ7) + (0.00000056 × Σ7²) − (0.00012828 × idade)
Σ7 = soma das 7 dobras em mm
```

**Percentual de gordura — Equação de Siri:**
```
%G = (4.95 / DC − 4.50) × 100
```

**IMC:**
```
IMC = peso(kg) / altura(m)²
```

**Relação Cintura/Quadril:**
```
RCQ = circunferência_cintura / circunferência_quadril
```

**Classificação % gordura (referência ACSM / CELAFISCS):**

| Classificação | Homens | Mulheres |
|---|---|---|
| Muito baixo | < 5% | < 10% |
| Excelente | 5–10% | 10–16% |
| Bom | 11–14% | 17–22% |
| Regular | 15–20% | 23–28% |
| Ruim | 21–24% | 29–32% |
| Muito ruim | > 24% | > 32% |

### 6.2 Classificação Somatotípica

Baseada no método de Heath-Carter (referência padrão na literatura brasileira).

**Endomorfismo** (tendência a gordura):
```
Endo = −0.7182 + 0.1451×(Σ3dc) − 0.00068×(Σ3dc)² + 0.0000014×(Σ3dc)³
Σ3dc = dobras tríceps + subescapular + suprailíaca, corrigidas pela altura
```

**Mesomorfismo** (musculatura):
```
Meso = 0.858×(diâmetro_úmero) + 0.601×(diâmetro_fêmur) 
     + 0.188×(braço_corrigido) + 0.161×(coxa_corrigida) 
     − 0.131×(altura) + 4.50
(diâmetros ósseos: opcional — se não coletados, estimar por tabela antropométrica padrão)
```

**Ectomorfismo** (linearidade):
```
índice_altura_peso = altura_cm / (peso_kg^0.333)
Se índice ≥ 40.75: Ecto = 0.732×índice − 28.58
Se 38.28 ≤ índice < 40.75: Ecto = 0.463×índice − 17.63
Se índice < 38.28: Ecto = 0.1
```

**Classificação final** (baseada no componente dominante):

| Somatótipo | Critério |
|---|---|
| `endomorph` | Endo dominante (≥ 1 ponto acima dos demais) |
| `mesomorph` | Meso dominante |
| `ectomorph` | Ecto dominante |
| `endo_meso` | Endo e Meso dentro de 1 ponto, ambos > Ecto |
| `ecto_meso` | Ecto e Meso dentro de 1 ponto, ambos > Endo |

### 6.3 Orientação de Treino Gerada (estrutura JSON)

```typescript
interface TrainingOrientation {
  somatotype: 'ectomorph' | 'mesomorph' | 'endomorph' | 'ecto_meso' | 'endo_meso';
  summary: string;          // 2–3 frases, linguagem acessível para o aluno
  primary_goal: 'fat_loss' | 'muscle_gain' | 'body_recomposition' | 'maintenance';
  
  training_focus: {
    type: string[];         // ex: ["Hipertrofia", "Força"]
    frequency_per_week: number;
    session_duration_min: number;
    cardio_recommendation: string;
    intensity: 'low' | 'moderate' | 'high';
  };
  
  nutrition_note: string;   // nota geral, não prescrição (redirecionar ao nutricionista)
  
  highlights: string[];     // 3–5 pontos curtos, exibidos como cards para o aluno
  trainer_notes: string;    // visível só para o personal, linguagem técnica
}
```

### 6.4 Tabela de Orientações por Somatótipo

| Somatótipo | Objetivo padrão | Foco de treino | Cardio | Frequência sugerida |
|---|---|---|---|---|
| **Endomorfo** | Perda de gordura | Circuito, alta repetição, supersets | 3–4x/semana, HIIT ou moderado | 4–5x |
| **Ectomorfo** | Ganho de massa | Força progressiva, volume moderado, baixo cardio | 1–2x/semana, leve | 3–4x |
| **Mesomorfo** | Recomposição / manutenção | Hipertrofia clássica, periodização | 2–3x/semana | 4–5x |
| **Endo-Meso** | Recomposição (reduzir gordura + manter músculo) | Força + circuito misto | 2–3x/semana HIIT | 4–5x |
| **Ecto-Meso** | Ganho de massa qualidade | Hipertrofia, força funcional | 1–2x/semana | 4x |

---

## 7. Telas e Fluxos

### 7.1 Entrada no app — Login do Aluno `/login`

Tela principal. Ponto de entrada padrão do app.

- Ocupa tela inteira. Fundo `#0a0a0a` com textura noise sutil (CSS).
- Topo: "TRAINFLOW" em Bebas Neue, lime, pequeno.
- Centro: Texto grande em Bebas Neue 64px lime — "BEM-VINDO" (ou "BOM DIA, [NOME]" se retornando).
- Input único de email, 56px altura.
- Botão "ENTRAR →" full width, fundo lime, texto preto, Bebas Neue.
- Subtexto: "Enviaremos um link de acesso para o seu email."
- Rodapé fixo: "Sou personal trainer" → `/t/login`. Texto muted, sem estilo de botão.

**Aluno novo:** recebe email com magic link → clica → cai em `/welcome` (tela de boas-vindas, não em home).

### 7.2 Boas-Vindas do Aluno `/welcome`

Exibida apenas no primeiro acesso (após magic link).

- Mostra o nome do aluno.
- Card com o somatótipo classificado: ícone visual + nome + `summary` do `TrainingOrientation`.
- Lista de `highlights` como cards horizontais deslizáveis.
- Nota nutricional em destaque mais suave.
- Botão "ENTENDER MEU TREINO" → vai para home.
- Não mostra dados técnicos brutos (dobras, density). Só a interpretação.

### 7.3 Home do Aluno `/home`

- Header: "OLÁ, [NOME]" + avatar.
- Card do treino do dia: nome do dia, plano, número de exercícios, duração estimada. CTA "INICIAR TREINO →".
- Scroll horizontal: últimas 3 sessões (data, duração, volume).
- Preview da última mensagem não lida do personal.
- Bottom nav: Home | Treino | Chat | Perfil.

### 7.4 Player de Treino `/workout/[sessionId]`

Tela mais importante do app. Full-screen, sem bottom nav.

**Layout:**
- Barra top: "X" (sair, pede confirmação) | contador "3/8" | anel de progresso SVG lime.
- Área principal (60% da tela): GIF do exercício full-width, nome em Bebas Neue 36px, séries×reps em lime.
- Logger de série: dois inputs grandes (KG | REPS), 80px altura. Botão "CONFIRMAR SÉRIE" lime, full width.
- Timer de descanso (overlay): blur full-screen, countdown Bebas Neue 120px lime, anel SVG, botão "PULAR DESCANSO". Beeps nos últimos 3s via Web Audio API.
- Controles: ← Anterior | ⏸ Pause | → Próximo. Mínimos, apenas ícone.
- Banner âmbar se offline: "● Offline — salvando no dispositivo."
- ErrorBoundary: nunca tela branca. "Algo deu errado. Seu progresso foi salvo." + retry.

**Comportamentos críticos:**
- GIF do próximo exercício pré-carregado em `<img>` oculto.
- Áudio pré-carregado para transição instantânea (Howler.js).
- AudioContext criado apenas no primeiro toque (requisito iOS).
- `navigator.vibrate()` com feature-detect (não funciona no iOS).
- Cada série gravada no IndexedDB antes de tentar Supabase.
- Estado do treino persistido: reload não perde progresso.
- Tela de conclusão: tempo total, séries, volume. Botão de sync se offline.

### 7.5 Chat `/chat/[conversationId]`

- WhatsApp-dark: enviadas à direita (fundo lime, texto preto), recebidas à esquerda (`#1a1a1a`, texto branco).
- Mensagens em tempo real via Supabase Realtime.
- Offline: mensagem fica com indicador pendente (⏳), sincroniza ao voltar online.
- Input fixo no bottom, cresce até 4 linhas.

### 7.6 Perfil do Aluno `/profile`

- Avatar, nome, dados básicos.
- **Seção "Minha Avaliação":** último somatótipo + percentual de gordura + massa magra. Orientação de treino em formato legível. Botão "Ver histórico" (todas as avaliações anteriores).
- Não exibe dobras brutas. Exibe apenas métricas interpretadas.

### 7.7 Login do Personal `/t/login`

Simples, sem tratamento visual especial. Fundo escuro.

- "ÁREA DO PERSONAL" em Bebas Neue.
- Input email + botão "ACESSAR".
- Sem magic link (senha convencional ou magic link simples — definir).

### 7.8 Dashboard do Personal `/t/dashboard`

- Visão geral: total de alunos ativos, sessões realizadas hoje, mensagens não lidas.
- Lista de atividade recente.
- Atalhos rápidos: "Nova avaliação", "Ver alunos".

### 7.9 Lista de Alunos `/t/students`

- Todos os alunos vinculados com status (Convidado / Ativo / Inativo).
- Botão "NOVA AVALIAÇÃO" → abre formulário de avaliação física.
- Tap no aluno → detalhe do aluno.

### 7.10 Formulário de Avaliação Física `/t/assessments/new`

Este é o formulário que **cria a conta do aluno** (se novo) ou registra nova avaliação (se existente).

**Seção 1 — Identificação:**
- Nome completo (required)
- Email (required) — se já existe na base, apenas cria nova avaliação
- Sexo (M/F)
- Data de nascimento → calcula idade automaticamente

**Seção 2 — Dados Básicos:**
- Peso (kg)
- Estatura (cm)
- IMC calculado em tempo real e exibido

**Seção 3 — Dobras Cutâneas (mm):**
- Protocolo selecionável: Pollock 7 dobras (padrão) ou Pollock 3 dobras
- Campos: Peitoral, Abdômen, Coxa, Tríceps, Subescapular, Suprailíaca, Axilar Média
- Se 3 dobras: apenas Peitoral, Abdômen, Coxa (homens) ou Tríceps, Suprailíaca, Coxa (mulheres)

**Seção 4 — Circunferências (cm):**
- Cintura, Quadril, Tórax, Braço relaxado, Braço contraído, Coxa, Panturrilha

**Seção 5 — Preview de Resultados (calculado ao vivo):**
- Densidade corporal
- % Gordura + classificação (Excelente / Bom / Regular / Ruim)
- Massa gorda (kg) e Massa magra (kg)
- IMC + classificação OMS
- RCQ + classificação de risco
- Somatótipo estimado (Endomorfo / Mesomorfo / Ectomorfo / etc.)
- Orientação de treino gerada — exibida para o personal revisar antes de salvar

**Ação final:**
- Botão "SALVAR E ENVIAR CONVITE" → chama `POST /api/auth/new-student`
- Se aluno já existe: "SALVAR AVALIAÇÃO"
- Spinner durante processamento.
- Sucesso: "Avaliação salva. Convite enviado para [email]."

**Validações:**
- Todos os campos obrigatórios de Seção 1 e 2 bloqueiam o avanço.
- Dobras e circunferências aceitam valores fora do range esperado mas exibem alerta amarelo.
- Se qualquer dobra = 0 ou vazia, o cálculo de densidade usa Pollock 3 dobras automaticamente com os campos disponíveis.

### 7.11 Detalhe do Aluno `/t/students/[studentId]`

Tabs: **Treinos | Histórico | Avaliações | Chat**

- **Treinos:** plano ativo resumido + "Criar plano" + "Trocar plano".
- **Histórico:** sessões realizadas (data, duração, volume).
- **Avaliações:** linha do tempo das avaliações físicas. Cada card mostra data, %G, massa magra, somatótipo. Botão "Nova avaliação".
- **Chat:** atalho para a conversa direta.

### 7.12 Biblioteca de Exercícios `/t/exercises`

- Search por nome (debounce 300ms).
- Filtros: músculo (Peito, Costas, Pernas, Ombros, Bíceps, Tríceps, Core, Cardio).
- Toggle: Global | Meus exercícios.
- Grid 2 col mobile / 3 col desktop. Cards com GIF + nome + chip de músculo.
- FAB "+" → modal de criação.

### 7.13 Builder de Plano `/t/plans/[planId]`

- Nome do plano editável inline.
- Sidebar de dias (mobile: tabs horizontais). Reorder por drag-and-drop.
- Cada exercício do dia: thumbnail GIF + nome + inputs inline (séries, reps, descanso) + drag handle + delete.
- "Adicionar exercício" → bottom sheet com busca na biblioteca.
- Auto-save com debounce 1000ms. Indicador "Salvando..." → "Salvo".
- Botão "PUBLICAR" (lime) envia ao aluno.

### 7.14 Chat do Personal `/t/chat`

- Lista de conversas: diretas + grupos, com badge de não lidas.
- Criar grupo: selecionar múltiplos alunos.
- Conversa: mesmo layout do chat do aluno.

---

## 8. Offline

Crítico. Não opcional.

**IndexedDB (`trainflow-offline`, version 1):**
- Store `outbox`: eventos pendentes. keyPath: `id`. Index em `status`.
- Store `sessions-cache`: dados do treino atual para acesso offline.

**Tipos de evento no outbox:**
```typescript
type OutboxEvent =
  | { type: 'START_SESSION'; payload: { client_uuid: string; plan_day_id: string; started_at: string } }
  | { type: 'UPSERT_SET'; payload: { client_uuid: string; session_client_uuid: string; day_exercise_id: string; set_number: number; reps_done: number; weight_kg: number; recorded_at: string } }
  | { type: 'END_SESSION'; payload: { client_uuid: string; finished_at: string } }
```

**Sync (`lib/offline/sync.ts`):**
- `syncOutbox()`: envia batch para `POST /api/sync/workout-events`.
- UPSERT idempotente por `client_uuid` (reenvio nunca duplica).
- Retry com backoff exponencial (máx 3 tentativas, depois marca `failed`).
- Background Sync API: `registerBackgroundSync('workout-sync')` com feature-detect.

**Trigger de sync:** evento `window online` + botão manual no banner.

**UX offline:**
- Banner âmbar no topo de todas as telas do aluno.
- Badge com count de pendentes: "3 pendentes".
- Botão "SINCRONIZAR AGORA".

---

## 9. PWA e Instalação

**Manifest:**
```json
{
  "name": "TrainFlow",
  "short_name": "TrainFlow",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

**Service Worker (Workbox):**
- Precache assets estáticos.
- Navegação: NetworkFirst (5s timeout) → fallback `/offline`.
- Assets estáticos: CacheFirst 30 dias.
- GIFs e áudio: CacheFirst 7 dias, máx 100 itens.
- Supabase GETs: StaleWhileRevalidate.
- Nunca cachear mutations.
- Push handler: `showNotification` com ícone e `data.url`.
- `notificationclick`: `clients.openWindow(url)`.
- Background sync handler: chama `syncOutbox()`.

**Prompt de instalação:**
- Interceptar `beforeinstallprompt`.
- Mostrar banner customizado após 2ª visita (não o padrão do browser).
- iOS: instruções manuais ("Toque em compartilhar → Adicionar à tela inicial").
- App abre em `standalone` — sem UI do browser.

---

## 10. Push Notifications

- VAPID keys geradas e documentadas em `.env.example`.
- `lib/push/client.ts`: `subscribePush()` — registra SW, chama `pushManager.subscribe`, POST para `/api/push/subscribe`.
- Pedir permissão após primeiro login bem-sucedido.
- **iOS:** só pedir se `navigator.standalone === true` AND iOS 16.4+.
- `/api/push/subscribe`: salva em `push_subscriptions`.
- `/api/push/send`: usa `web-push`, busca subscriptions do usuário, envia.
- Disparo: nova mensagem, novo plano publicado, lembrete de treino.
- Não enviar push se o destinatário tem a conversa aberta (usar Supabase Realtime presence).

---

## 11. Realtime (Chat)

```typescript
// lib/chat/useChat.ts
const channel = supabase
  .channel(`messages:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => {
    setMessages(prev => [...prev, payload.new as Message])
  })
  .subscribe()

// Limpar subscription no unmount — obrigatório
return () => supabase.removeChannel(channel)
```

---

## 12. Middleware / Proteção de Rotas

```typescript
// middleware.ts — Edge runtime
// Lê user_role do JWT app_metadata (sem chamada ao banco)
// trainer → apenas /t/* routes
// student → apenas /(student)/* routes
// não autenticado → redirect para /login ou /t/login
// Excluir do matcher: _next/static, _next/image, sw.js, manifest, icons
```

**JWT Hook Supabase:**
```sql
-- Função que injeta user_role no JWT ao autenticar
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql as $$
declare
  user_role text;
begin
  select role into user_role from public.profiles where id = (event->>'user_id')::uuid;
  return jsonb_set(event, '{claims,app_metadata,user_role}', to_jsonb(user_role));
end;
$$;
```

---

## 13. Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:seuemail@dominio.com
```

---

## 14. Dependências

```json
{
  "@supabase/supabase-js": "latest",
  "@supabase/ssr": "latest",
  "idb": "latest",
  "howler": "latest",
  "@types/howler": "latest",
  "web-push": "latest",
  "@types/web-push": "latest",
  "nanoid": "latest",
  "@dnd-kit/core": "latest",
  "@dnd-kit/sortable": "latest",
  "zustand": "latest",
  "motion": "latest"
}
```

> **Se Next.js:** adicionar `@serwist/next` e `serwist`.
> **Se Vite:** adicionar `vite-plugin-pwa`.

---

## 15. Ordem de Geração

1. Schema SQL + migrations + RLS + JWT hook
2. Clients Supabase (server + cliente)
3. Middleware de rotas
4. **Formulário de avaliação física + lógica de cálculo** ← novo
5. API `POST /api/auth/new-student` (cria conta + avaliação)
6. Tela de login do aluno
7. Tela de boas-vindas (`/welcome`) com orientação somatotípica
8. Home do aluno
9. Player de treino (implementação completa)
10. Biblioteca de exercícios (personal)
11. Builder de plano (personal)
12. Chat (realtime, ambos os lados)
13. Perfil do aluno com histórico de avaliações
14. Config PWA (manifest + SW + offline)
15. Push notifications

---

## 16. Checklist de Qualidade

### Avaliação Física
- [ ] IMC calculado em tempo real no formulário
- [ ] % gordura calculado ao preencher dobras
- [ ] Somatótipo classificado automaticamente
- [ ] Orientação de treino gerada antes de salvar
- [ ] Fluxo de convite funciona para email novo e existente
- [ ] Tela de boas-vindas exibe somatótipo e orientação

### Player
- [ ] GIF carrega + preload do próximo
- [ ] Timer de descanso funciona com countdown
- [ ] Beep de áudio nos últimos 3s (Web Audio API)
- [ ] Vibração com feature-detect (não quebra no iOS)
- [ ] Sets salvos no IndexedDB antes de tentar Supabase
- [ ] ErrorBoundary: nenhuma tela branca possível

### Chat
- [ ] Mensagem aparece instantaneamente nos dois lados
- [ ] Subscription cancelada ao sair da tela
- [ ] Grupo funciona: personal → múltiplos alunos

### Offline
- [ ] Banner aparece quando offline
- [ ] Sets offline salvos no IndexedDB
- [ ] Sync manual funciona ao voltar online
- [ ] UPSERT idempotente (reenvio não duplica)

### PWA
- [ ] Manifest válido (DevTools → Application)
- [ ] SW registrado e ativo
- [ ] Offline fallback carrega sem internet
- [ ] Lighthouse PWA score ≥ 90
- [ ] Push funciona no Android
- [ ] iOS: push apenas se instalado na home screen

---

## 17. Melhores Práticas para PWAs com Experiência "Native-like"

Este documento sintetiza as melhores práticas para o desenvolvimento de Progressive Web Apps (PWAs) que oferecem uma experiência de usuário indistinguível de aplicativos nativos, com base nas diretrizes e recomendações do Google (web.dev), Microsoft (Edge docs) e Mozilla (MDN).

### 1. Identidade e Instalação Imersiva

Para que um PWA seja percebido como um aplicativo nativo, sua identidade e processo de instalação devem ser fluidos e integrados ao sistema operacional. Isso envolve a configuração detalhada do manifesto da aplicação e a personalização da experiência de instalação.

#### 1.1. Configuração Avançada do Web App Manifest

O arquivo `manifest.json` é crucial para definir como o PWA aparece e se comporta após a instalação. Recomenda-se as seguintes configurações:

*   **Modo de Exibição (`display: standalone`):** Essencial para remover a interface do usuário do navegador (barra de endereço, botões de navegação), fazendo com que o PWA seja executado em sua própria janela, como um aplicativo nativo [1, 3].
*   **Orientação da Tela (`orientation`):** Fixar a orientação (e.g., `portrait`) pode ser benéfico para aplicativos com fluxos de uso específicos, como o player de treino, garantindo uma experiência consistente [1].
*   **Cores de Tema e Fundo (`theme_color`, `background_color`):** Devem ser cuidadosamente escolhidas para corresponder ao esquema de cores do aplicativo (e.g., `#0a0a0a` para o TrainFlow), minimizando o "flash" de conteúdo branco durante o carregamento e proporcionando uma transição visual suave [1, 3].
*   **Ícones Mascaráveis (`maskable icons`):** Para garantir que os ícones do aplicativo se adaptem a diferentes formas e máscaras de ícones em sistemas operacionais como o Android, evitando cortes indesejados e mantendo a estética visual [1].

#### 1.2. Experiência de Instalação Personalizada

Em vez de depender do prompt de instalação padrão do navegador, que pode ser intrusivo ou facilmente ignorado, é preferível criar uma interface de usuário personalizada para a instalação:

*   **Evento `beforeinstallprompt`:** Interceptar este evento permite que o desenvolvedor controle quando e como o prompt de instalação é exibido. Isso possibilita a criação de um botão de instalação dentro da UI do aplicativo (e.g., em uma tela de perfil ou um banner discreto na página inicial), oferecendo uma experiência mais contextual e menos disruptiva [3].
*   **App Shortcuts:** Definir atalhos no manifesto da web permite que os usuários acessem funcionalidades específicas do aplicativo diretamente do ícone na tela inicial ou barra de tarefas (e.g., "Iniciar Treino de Hoje", "Ver Avaliação"). Isso melhora a usabilidade e a velocidade de acesso às ações mais comuns [2, 3].

### 2. Integração Profunda com o Sistema Operacional

Para que um PWA se sinta verdadeiramente nativo, ele deve interagir de forma significativa com o sistema operacional subjacente, aproveitando suas capacidades e convenções.

#### 2.1. Aprimoramentos Visuais e de Interação

*   **Window Controls Overlay (Desktop):** Em ambientes de desktop, a capacidade de ocultar a barra de título padrão do sistema operacional e utilizar essa área para conteúdo do aplicativo (como um logo ou controles personalizados) confere ao PWA uma aparência mais integrada e nativa, similar a aplicações como o Visual Studio Code [3].
*   **Badging API:** Permite que o PWA exiba um distintivo (badge) no ícone do aplicativo na tela inicial ou barra de tarefas, indicando o número de notificações não lidas ou itens pendentes (e.g., mensagens, treinos a serem sincronizados). Isso mantém o usuário informado sem a necessidade de abrir o aplicativo [2, 3].
*   **Web Share & Share Target API:** Habilita o compartilhamento de conteúdo do PWA (e.g., resultados de treino, progresso) com outros aplicativos nativos instalados no dispositivo, e também permite que o PWA receba conteúdo de outras fontes. Isso integra o aplicativo ao ecossistema de compartilhamento do sistema operacional [2, 3].

#### 2.2. Acesso a Recursos do Dispositivo

*   **Wake Lock API:** Essencial para aplicações como o TrainFlow, onde a tela não deve apagar durante a execução de um treino. Esta API impede que o dispositivo entre em modo de suspensão, garantindo que o usuário possa acompanhar o progresso sem interrupções [2].
*   **Media Session API:** Permite que o PWA se integre aos controles de mídia do sistema operacional, possibilitando que o usuário controle a reprodução de áudio (e.g., timer de descanso, instruções de áudio) a partir da tela de bloqueio, fones de ouvido ou outros dispositivos de mídia [2].

### 3. Performance e Confiabilidade (Offline-First)

A expectativa de um aplicativo nativo é que ele seja rápido, responsivo e funcione de forma confiável, mesmo em condições de rede adversas ou na ausência de conexão. O PWA deve adotar uma estratégia "offline-first" para atender a essa expectativa.

#### 3.1. Modelo App Shell e Estratégias de Cache

*   **App Shell Model:** A arquitetura App Shell envolve o cacheamento da interface de usuário básica do aplicativo (o "esqueleto" ou "shell") através de um Service Worker. Isso garante que o aplicativo carregue instantaneamente na primeira visita e em visitas subsequentes, mesmo offline, proporcionando uma percepção de velocidade [1, 2].
*   **Estratégias de Cache Inteligentes:**
    *   **Assets Estáticos (GIFs, Áudios):** Utilizar uma estratégia `CacheFirst` com expiração para mídias e outros assets estáticos garante que esses recursos sejam servidos diretamente do cache, resultando em carregamentos quase instantâneos [1].
    *   **Dados do Usuário (`StaleWhileRevalidate`):** Para dados dinâmicos, como informações de treino ou avaliações, a estratégia `StaleWhileRevalidate` permite que o aplicativo exiba rapidamente dados armazenados em cache enquanto busca atualizações em segundo plano. Isso garante que o usuário sempre veja algum conteúdo, mesmo que não seja o mais recente, e que o conteúdo seja atualizado assim que uma conexão estável for restabelecida [1].

#### 3.2. Sincronização em Segundo Plano e Resiliência Offline

*   **Background Sync API:** Permite que o aplicativo adie a sincronização de dados (e.g., treinos concluídos, mensagens enviadas) para quando uma conexão de rede estável estiver disponível, mesmo que o usuário tenha fechado o aplicativo. Isso é crucial para garantir que as ações do usuário offline sejam eventualmente persistidas no servidor [1, 2].
*   **Periodic Background Sync API:** Habilita a sincronização periódica de dados em segundo plano (e.g., baixar o plano de treino do dia seguinte durante a madrugada), garantindo que o conteúdo esteja sempre atualizado e disponível antes mesmo de o usuário abrir o aplicativo [2].
*   **Fallback Offline Robusto:** Além de uma página offline personalizada, é fundamental que as rotas principais do aplicativo (e.g., `/home`, `/workout`) exibam estados vazios amigáveis ou dados cacheados quando offline, em vez de uma tela de erro genérica. Isso mantém o usuário engajado e informado sobre a situação da conectividade [1, 3].

### 4. Experiência de Usuário (UX) Refinada

Uma experiência "native-like" vai além da funcionalidade, abrangendo também a forma como o usuário interage e percebe o aplicativo.

*   **Skeleton Screens:** A exibição de "esqueletos" de conteúdo durante o carregamento inicial ou de dados assíncronos reduz a percepção de espera, informando visualmente o usuário de que o conteúdo está a caminho [1, 3].
*   **Feedback Tátil (Vibration API):** O uso sutil de vibrações (com detecção de recursos para compatibilidade) pode fornecer feedback tátil para ações importantes, como o fim de um timer de descanso ou a conclusão de uma série de exercícios, enriquecendo a interação [2].
*   **Gestos Nativos:** A implementação de gestos comuns em aplicativos nativos, como "pull-to-refresh" para atualizar conteúdo ou gestos de deslizar (swipe) para navegação entre elementos (e.g., dias de treino), contribui para uma experiência mais intuitiva e familiar. Bibliotecas de animação como `Motion` (ex-Framer Motion) podem facilitar a criação desses gestos [2].
*   **Fontes de Sistema (`system-ui`):** Utilizar `system-ui` como uma fonte de fallback garante que o texto seja renderizado instantaneamente com a fonte padrão do sistema operacional antes que as fontes personalizadas (e.g., Bebas Neue, DM Sans) sejam carregadas. Isso melhora a performance percebida e a consistência visual [3].
*   **Toque e Acessibilidade:** Manter áreas de toque mínimas de 44px e garantir um contraste de cores adequado são fundamentais para a acessibilidade e usabilidade, especialmente em ambientes desafiadores como academias com iluminação variada [1, 3].

## Referências

[1] Google. (s.d.). *What makes a good Progressive Web App?* web.dev. Disponível em: [https://web.dev/articles/pwa-checklist](https://web.dev/articles/pwa-checklist)
[2] Google. (2020, 15 de junho). *Make your PWA feel more like an app*. web.dev. Disponível em: [https://web.dev/articles/app-like-pwas](https://web.dev/articles/app-like-pwas)
[3] Microsoft. (s.d.). *Best practices for PWAs*. learn.microsoft.com. Disponível em: [https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/best-practices](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/best-practices)
[4] Mozilla. (s.d.). *Best practices for PWAs*. developer.mozilla.org. Disponível em: [https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Best_practices](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Best_practices)
