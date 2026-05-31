import { useGetMyLatestAssessment } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MOCK_ASSESSMENT } from "@/lib/mock-data";

export default function StudentWelcome() {
  const { data: assessmentResponse, isLoading, isError } = useGetMyLatestAssessment();
  const assessment = assessmentResponse || (isError || !assessmentResponse ? MOCK_ASSESSMENT : undefined);
  const { user } = useAuth();

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-black"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  const firstName = user?.fullName?.split(" ")[0] || "ALUNO";

  return (
    <div className="min-h-[100dvh] bg-black text-foreground p-6 flex flex-col justify-between relative z-10">
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-black"></div>

      {/* TopAppBar */}
      <header className="w-full pt-8 pb-4 flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="font-display text-primary tracking-widest text-2xl">TRAINFLOW</h1>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1A1A1A] flex items-center justify-center">
          <span className="material-symbols-outlined text-white/70">person</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <section>
          <h2 className="font-display text-primary uppercase mb-1 tracking-widest text-xl">BEM-VINDO AO NOVO NÍVEL</h2>
          <h3 className="font-display text-[64px] leading-none text-white">OLÁ, <span className="text-white">{firstName}</span></h3>
          <p className="text-white/60 mt-4 text-base">
            Analisamos seus dados. Seu plano foi construído para máxima eficiência baseada no seu perfil físico.
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
                <span className="text-sm font-medium text-primary tracking-widest uppercase">CLASSIFICAÇÃO</span>
              </div>
              <h4 className="font-display text-4xl text-white mb-2 uppercase">{assessment.somatotype || 'N/A'}</h4>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Gordura</div>
                  <div className="font-display text-3xl text-white">{assessment.bodyFatPct ? `${assessment.bodyFatPct}%` : '--'}</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Massa Magra</div>
                  <div className="font-display text-3xl text-white">{assessment.leanMassKg ? `${assessment.leanMassKg}kg` : '--'}</div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="text-center text-muted-foreground py-12 bg-[#1A1A1A] rounded-2xl border border-white/5">
            Nenhuma avaliação encontrada.
          </div>
        )}
      </main>

      {/* Main CTA */}
      <div className="mt-8 pb-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
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
