import { useState } from "react";
import { useGetStudentToday, useListMySessions } from "@workspace/api-client-react";
import { Link } from "wouter";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { Button } from "@/components/ui/button";
import { MOCK_STUDENT_TODAY, MOCK_SESSIONS } from "@/lib/mock-data";

export default function StudentWorkout() {
  const { data: todayResponse, isLoading: loadingToday } = useGetStudentToday();
  const { data: sessionsResponse, isLoading: loadingSessions } = useListMySessions();
  const [isActiveMode, setIsActiveMode] = useState(false);

  const today = todayResponse || MOCK_STUDENT_TODAY;
  const sessions = sessionsResponse || MOCK_SESSIONS;
  const todayWorkout = today?.todayWorkout;

  if (loadingToday || loadingSessions) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-black"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  if (isActiveMode && todayWorkout) {
    return (
      <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-6 selection:bg-primary selection:text-black animate-in fade-in duration-500">
        <header className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsActiveMode(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1 uppercase">PLAYER</h1>
          </div>
          <div className="text-primary font-display text-2xl tracking-widest animate-pulse">00:42:15</div>
        </header>

        <main className="flex-1 pt-24 px-6 flex flex-col gap-8 max-w-2xl mx-auto w-full">
          <section>
            <div className="flex items-center gap-2 mb-2">
               <span className="w-2 h-2 rounded-full bg-primary"></span>
               <span className="text-[10px] text-primary uppercase font-black tracking-widest">Foco: {(todayWorkout as any).focus}</span>
            </div>
            <h2 className="font-display text-white text-5xl uppercase leading-none mb-6">{todayWorkout.name}</h2>
          </section>

          <div className="space-y-4">
            {todayWorkout.exercises?.map((ex: any, idx: number) => (
              <div key={ex.id} className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-5 flex items-center gap-5 group hover:border-primary/30 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center font-display text-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-black transition-colors">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-2xl text-white uppercase tracking-tight group-hover:text-primary transition-colors truncate">{ex.name}</h3>
                  <div className="flex gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#888888]">layers</span>
                      <span className="text-xs text-[#888888] font-bold">{ex.sets} SÉRIES</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#888888]">refresh</span>
                      <span className="text-xs text-[#888888] font-bold">{ex.reps} REPS</span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <span className="material-symbols-outlined text-white/20 group-hover:text-primary">check_circle</span>
                </div>
              </div>
            ))}
          </div>
          
          <Button onClick={() => setIsActiveMode(false)} className="w-full h-16 bg-primary text-black rounded-full font-display text-2xl tracking-widest electric-glow hover:brightness-110 active:scale-95 transition-all mt-4 mb-8">
             CONCLUIR TREINO
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24 selection:bg-primary selection:text-black">
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <Link href="/home" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-all text-white">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">TREINOS</h1>
        </div>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-10 max-w-2xl mx-auto w-full">
        {/* Treino de Hoje CTA */}
        {todayWorkout && (
          <section className="bg-gradient-to-br from-primary to-[#A8D12D] rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
               <span className="material-symbols-outlined text-[120px] text-black">fitness_center</span>
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-black text-black/60 uppercase tracking-[0.2em]">Sua sessão de hoje</span>
              <h2 className="font-display text-black text-5xl leading-none mt-2 mb-6 uppercase italic tracking-tighter">{todayWorkout.name}</h2>
              <Button onClick={() => setIsActiveMode(true)} className="bg-black text-white rounded-full px-8 h-14 font-display text-2xl tracking-widest hover:bg-black/90 active:scale-95 transition-all">
                START NOW
                <span className="material-symbols-outlined ml-2">play_arrow</span>
              </Button>
            </div>
          </section>
        )}

        {/* History Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-[11px] text-[#888888] uppercase tracking-[0.3em] font-black">Histórico Recente</h3>
             <span className="text-[10px] text-[#888888] font-bold uppercase">{sessions.length} SESSÕES</span>
          </div>
          
          <div className="space-y-4">
            {sessions.map((session: any) => (
              <div key={session.id} className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/10 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#888888] font-bold uppercase tracking-widest mb-1">
                       {new Date(session.startedAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
                    </span>
                    <h4 className="font-display text-3xl text-white uppercase tracking-tight leading-none">{session.planDayName}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-black border border-white/5 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">check</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                  <div>
                    <span className="text-[9px] text-[#888888] uppercase font-black tracking-widest block mb-1">Tempo</span>
                    <span className="font-display text-2xl text-white">{session.durationMinutes}<span className="text-xs font-sans text-[#888888] ml-0.5">m</span></span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#888888] uppercase font-black tracking-widest block mb-1">Volume</span>
                    <span className="font-display text-2xl text-white">{(session.totalVolumeKg / 1000).toFixed(1)}<span className="text-xs font-sans text-[#888888] ml-0.5">k</span></span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#888888] uppercase font-black tracking-widest block mb-1">Séries</span>
                    <span className="font-display text-2xl text-white">{session.totalSets}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <StudentBottomNav />
    </div>
  );
}
