'use client'

import Link from 'next/link'

// Páginas organizadas por categoria
const pages = {
  "Login & Onboarding": [
    { name: "Login do Aluno", path: "login_do_aluno", description: "Tela de login para alunos" },
    { name: "Login Animado", path: "login_do_aluno_animated", description: "Login com animações" },
    { name: "Login Dark Mode", path: "login_do_aluno_dark_mode", description: "Login em modo escuro" },
    { name: "Boas Vindas", path: "boas_vindas_do_aluno", description: "Tela de boas vindas" },
    { name: "Boas Vindas Animado", path: "boas_vindas_do_aluno_animated", description: "Boas vindas com animações" },
    { name: "Boas Vindas Dark", path: "boas_vindas_do_aluno_dark_mode", description: "Boas vindas em modo escuro" },
    { name: "Onboarding Completo", path: "boas_vindas_e_somat_tipo_onboarding", description: "Fluxo completo de onboarding" },
  ],
  "Dashboard Aluno": [
    { name: "Dashboard do Aluno", path: "dashboard_do_aluno", description: "Painel principal do aluno" },
    { name: "Dashboard Dark Mode", path: "dashboard_do_aluno_dark_mode", description: "Dashboard em modo escuro" },
    { name: "Perfil do Aluno", path: "perfil_do_aluno", description: "Página de perfil" },
    { name: "Perfil Animado", path: "perfil_do_aluno_animated", description: "Perfil com animações" },
    { name: "Comunidade e Conquistas", path: "comunidade_e_conquistas", description: "Rede social e badges" },
    { name: "Diário de Hábitos", path: "di_rio_de_h_bitos_saud_veis", description: "Registro de hábitos saudáveis" },
  ],
  "Treino (Player)": [
    { name: "Player de Treino", path: "player_de_treino", description: "Player principal de exercícios" },
    { name: "Player Dark 1", path: "player_de_treino_dark_mode_1", description: "Player modo escuro v1" },
    { name: "Player Dark 2", path: "player_de_treino_dark_mode_2", description: "Player modo escuro v2" },
    { name: "Modo Foco Total", path: "player_de_treino_modo_foco_total", description: "Player em tela cheia" },
    { name: "Timer Tabata", path: "timer_tabata_ativo", description: "Cronômetro HIIT/Tabata" },
    { name: "Cronômetros de Performance", path: "cron_metros_de_performance", description: "Métricas em tempo real" },
  ],
  "Histórico & Avaliações (Aluno)": [
    { name: "Histórico de Avaliações", path: "hist_rico_de_avalia_es_do_aluno", description: "Lista de avaliações" },
    { name: "Avaliações com Gráficos", path: "hist_rico_de_avalia_es_com_gr_ficos", description: "Avaliações visualizadas" },
    { name: "Gráfico de Peso", path: "hist_rico_com_gr_fico_de_peso_total", description: "Evolução do peso corporal" },
    { name: "Gráficos Corporais", path: "hist_rico_com_todos_os_gr_ficos_corporais", description: "Todas as métricas corporais" },
    { name: "Perímetros", path: "hist_rico_com_gr_ficos_de_per_metros_cintura_bra_o", description: "Cintura, braço, etc." },
    { name: "Metas nos Gráficos", path: "hist_rico_com_metas_nos_gr_ficos", description: "Progresso vs objetivos" },
  ],
  "Dashboard Personal (Trainer)": [
    { name: "Dashboard do Personal", path: "dashboard_do_personal", description: "Painel principal do trainer" },
    { name: "Dashboard Animado", path: "dashboard_do_personal_animated", description: "Dashboard com animações" },
    { name: "Gestão de Alunos", path: "gest_o_de_alunos_trainer", description: "Administração de alunos" },
    { name: "Lista de Alunos", path: "lista_de_alunos", description: "Todos os alunos" },
    { name: "Detalhe do Aluno 1", path: "detalhe_do_aluno_coach_1", description: "Ficha completa v1" },
    { name: "Detalhe do Aluno 2", path: "detalhe_do_aluno_coach_2", description: "Ficha completa v2" },
    { name: "Insights de Performance", path: "insights_de_performance_e_reten_o_coach", description: "Analytics e retenção" },
    { name: "Relatórios Avançados", path: "relat_rios_avan_ados_trainer", description: "Relatórios detalhados" },
  ],
  "Criação de Treinos (Trainer)": [
    { name: "Builder de Treino", path: "builder_de_plano_de_treino", description: "Criador de planos" },
    { name: "Builder Profissional", path: "builder_de_plano_de_treino_profissional", description: "Builder avançado" },
    { name: "Builder com Imagens", path: "builder_de_treino_com_imagens_reais", description: "Com fotos dos exercícios" },
    { name: "Biblioteca de Exercícios", path: "biblioteca_de_exerc_cios", description: "Catálogo completo" },
    { name: "Selecionar Exercício", path: "selecionar_exerc_cio", description: "Modal de seleção" },
    { name: "Nova Avaliação Física", path: "nova_avalia_o_f_sica", description: "Formulário de avaliação" },
    { name: "Avaliação Profissional", path: "formul_rio_de_avalia_o_f_sica_profissional", description: "Avaliação completa" },
  ],
  "Mensagens": [
    { name: "Mensagens do Personal", path: "mensagens_do_personal", description: "Lista de conversas" },
    { name: "Conversa", path: "mensagens_do_personal_conversa", description: "Chat individual" },
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen bg-pure-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-pure-black/80 backdrop-blur-xl border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display-lg text-3xl md:text-4xl text-primary-fixed tracking-tight">TRAINFLOW</h1>
          <span className="text-label-sm text-text-muted uppercase tracking-widest">Modern Fitness Suite</span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-fixed/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg md:text-display-lg text-on-surface mb-4">
            SUITE COMPLETA DE TELAS
          </h2>
          <p className="text-body-lg text-text-muted max-w-xl mx-auto">
            Explore todas as 42 telas do aplicativo Trainflow. Clique em qualquer card para visualizar a página completa.
          </p>
        </div>
      </section>

      {/* Pages Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {Object.entries(pages).map(([category, categoryPages]) => (
          <section key={category} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-primary-fixed rounded-full" />
              <h3 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider">
                {category}
              </h3>
              <span className="text-label-sm text-text-muted ml-2">
                {categoryPages.length} telas
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryPages.map((page) => (
                <Link
                  key={page.path}
                  href={`/pages/${page.path}/code.html`}
                  target="_blank"
                  className="group bg-surface-container-low border border-border-subtle rounded-xl p-5 hover:border-primary-fixed/50 hover:bg-surface-container transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-label-md text-on-surface group-hover:text-primary-fixed transition-colors">
                      {page.name}
                    </h4>
                    <svg 
                      className="w-4 h-4 text-text-muted group-hover:text-primary-fixed group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="text-label-sm text-text-muted line-clamp-2">
                    {page.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8 px-6 text-center">
        <p className="text-label-sm text-text-muted">
          Trainflow - Modern Fitness Suite | {Object.values(pages).flat().length} telas disponíveis
        </p>
      </footer>
    </div>
  )
}
