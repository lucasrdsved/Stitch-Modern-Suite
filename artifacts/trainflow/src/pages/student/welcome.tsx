import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { getLatestAssessment } from "@/lib/mock-store";

export default function StudentWelcome() {
  const assessment = getLatestAssessment();
  const { user } = useAuth();

  const firstName = user?.fullName?.split(" ")[0] || "ALUNO";

  return (
    <div className="min-h-[100dvh] bg-black text-foreground p-6 flex flex-col relative z-10">
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-black"></div>

      {/* TopAppBar */}
      <header className="bg-black/90 backdrop-blur-xl border-b border-white/5 fixed top-0 left-0 w-full z-50">
        <div className="flex items-center justify-between px-6 h-14 max-w-7xl mx-auto w-full">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1A1A1A] flex items-center justify-center">
            <span className="material-symbols-outlined text-white/70">person</span>
          </div>
          <h1 className="font-display text-primary tracking-widest text-2xl">TRAINFLOW</h1>
          <button className="w-8 h-8 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col mt-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <section className="mt-4">
          <h2 className="font-display text-primary uppercase mb-1 tracking-widest text-xl">BEM-VINDO AO NOVO NÍVEL</h2>
          <h3 className="font-display text-[64px] leading-none text-white">OLÁ, <span className="text-white">{firstName}</span></h3>
          <p className="text-white/60 mt-2 text-base max-w-md">
            Analisamos seus dados. Seu plano foi construído para máxima eficiência baseada no seu perfil biológico.
          </p>
        </section>

        {assessment ? (
          <section className="relative rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/5 p-6 shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-9xl text-white">accessibility_new</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">electric_bolt</span>
                <span className="text-xs font-medium text-primary tracking-widest uppercase">CLASSIFICAÇÃO</span>
              </div>
              <h4 className="font-display text-4xl text-white mb-2 uppercase">{assessment.somatotype || 'N/A'}</h4>
              
              <div className="flex flex-col gap-2 mt-4">
                <p className="text-white/70 text-sm">
                  Metabolismo e perfil físico analisados. Foco total em <strong className="text-white">hipertrofia</strong> com volume controlado e cargas elevadas.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-black/40 rounded-full text-[10px] text-white/80 border border-white/5 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">fitness_center</span> Carga Alta
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-black/40 rounded-full text-[10px] text-white/80 border border-white/5 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">timer</span> Volume Baixo
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-black/40 rounded-full text-[10px] text-white/80 border border-white/5 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">restaurant</span> Superávit
                </span>
              </div>
            </div>
          </section>
        ) : (
          <div className="text-center text-muted-foreground py-12 bg-[#1A1A1A] rounded-2xl border border-white/5">
            Nenhuma avaliação encontrada.
          </div>
        )}

        {/* Highlights Section */}
        <section className="space-y-4">
          <h5 className="font-display text-xl text-white uppercase tracking-widest">DIRETRIZES DO TREINO</h5>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-6 px-6 snap-x">
            <div className="min-w-[280px] bg-[#1A1A1A] rounded-xl p-5 border border-white/5 snap-center">
              <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">vital_signs</span>
              </div>
              <h6 className="font-display text-xl text-white mb-2 uppercase tracking-wide">FALHA CONCÊNTRICA</h6>
              <p className="text-white/60 text-sm">
                Busque a falha real nas duas últimas séries de cada exercício. O estímulo precisa ser agressivo.
              </p>
            </div>
            <div className="min-w-[280px] bg-[#1A1A1A] rounded-xl p-5 border border-white/5 snap-center">
              <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary">timer</span>
              </div>
              <h6 className="font-display text-xl text-white mb-2 uppercase tracking-wide">DESCANSO LONGO</h6>
              <p className="text-white/60 text-sm">
                Respeite os 90-120 segundos de descanso. A recuperação neural é crucial para a próxima série pesada.
              </p>
            </div>
          </div>
        </section>

        {/* Nutrition Note */}
        <section className="bg-[#1A1A1A] border-l-4 border-primary/50 rounded-r-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-1">warning</span>
            <div>
              <h6 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Aviso Nutricional Crítico</h6>
              <p className="text-white/70 text-sm">
                Sem combustível, não há motor. Mantenha a ingestão de carboidratos alta pré e pós-treino para suportar a intensidade.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Main CTA */}
      <div className="mt-auto pt-6 pb-4 sticky bottom-0 z-40 bg-gradient-to-t from-black via-black to-transparent">
        <Button asChild className="w-full h-14 rounded-full bg-primary text-black font-display text-2xl flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all electric-glow tracking-wide">
          <Link href="/home">
            ENTENDER MEU TREINO
            <span className="material-symbols-outlined font-bold text-[28px]">arrow_forward</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
