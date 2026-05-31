import { useListMySessions } from "@workspace/api-client-react";
import { Link } from "wouter";
import { StudentBottomNav } from "@/components/student-bottom-nav";

export default function StudentWorkout() {
  const { data: sessions, isLoading } = useListMySessions();

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24 selection:bg-primary selection:text-black">
      {/* Glassmorphism Header */}
      <header className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <Link href="/home" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95 text-white">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">TREINOS</h1>
        </div>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-8 max-w-2xl mx-auto w-full">
        {/* Page Header Section */}
        <section className="flex flex-col gap-1">
          <h2 className="font-display text-white text-4xl uppercase tracking-tight leading-none">MEUS TREINOS</h2>
          <p className="text-muted-foreground text-base">Seu histórico de sessões e performance.</p>
        </section>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse w-full h-40 bg-white/5 rounded-3xl border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {sessions?.length ? (
              sessions.map((session) => (
                <div 
                  key={session.id} 
                  className="group relative bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-md border border-white/10 rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:translate-y-[-2px] hover:shadow-[0_20px_40px_-15px_rgba(200,241,53,0.1)]"
                >
                  {/* Glassmorphism gradient accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="relative flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-muted-foreground/80">
                        <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.1em]">
                          {new Date(session.startedAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-display text-3xl text-white mt-0.5 leading-none uppercase tracking-tight group-hover:text-primary transition-colors">
                        {session.planDayName || "Sessão de Treino"}
                      </h3>
                    </div>
                    
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border tracking-widest ${
                      session.finishedAt 
                        ? 'bg-primary/10 text-primary border-primary/20' 
                        : 'bg-warning/10 text-warning border-warning/20'
                    }`}>
                      {session.finishedAt ? "CONCLUÍDO" : "EM ANDAMENTO"}
                    </div>
                  </div>

                  <div className="relative grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground/60 mb-1">
                        <span className="material-symbols-outlined text-lg">layers</span>
                        <span className="text-[10px] uppercase font-black tracking-widest">Séries</span>
                      </div>
                      <div className="font-display text-3xl text-white">
                        {session.totalSets || 0}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground/60 mb-1">
                        <span className="material-symbols-outlined text-lg">fitness_center</span>
                        <span className="text-[10px] uppercase font-black tracking-widest">Volume</span>
                      </div>
                      <div className="font-display text-3xl text-white flex items-baseline gap-1">
                        {session.totalVolumeKg || 0}
                        <span className="text-xs font-sans text-muted-foreground font-medium lowercase">kg</span>
                      </div>
                    </div>

                    {session.durationMinutes && (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground/60 mb-1">
                          <span className="material-symbols-outlined text-lg">timer</span>
                          <span className="text-[10px] uppercase font-black tracking-widest">Tempo</span>
                        </div>
                        <div className="font-display text-3xl text-white flex items-baseline gap-1">
                          {session.durationMinutes}
                          <span className="text-xs font-sans text-muted-foreground font-medium lowercase">min</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white/[0.03] border border-white/10 border-dashed rounded-[32px]">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                  <span className="material-symbols-outlined text-5xl text-muted-foreground/30">history</span>
                </div>
                <h3 className="font-display text-2xl text-white mb-2 uppercase tracking-tight">Sem histórico</h3>
                <p className="text-muted-foreground text-base max-w-[240px] leading-relaxed">
                  Suas sessões aparecerão aqui assim que você começar a treinar.
                </p>
                <Link href="/home" className="mt-8 px-8 py-3 bg-primary text-black font-bold rounded-full text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_-5px_rgba(200,241,53,0.3)]">
                  Começar Agora
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      <StudentBottomNav />
    </div>
  );
}
