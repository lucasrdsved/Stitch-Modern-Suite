import { useListMySessions } from "@workspace/api-client-react";
import { Link } from "wouter";
import { StudentBottomNav } from "@/components/student-bottom-nav";

export default function StudentWorkout() {
  const { data: sessions, isLoading } = useListMySessions();

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <Link href="/home" className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity active:scale-95 text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">TREINOS</h1>
        </div>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <section className="flex flex-col gap-1 mb-2">
          <h2 className="font-display text-white text-[32px] uppercase tracking-wider leading-none">MEUS TREINOS</h2>
          <p className="text-[#888888] text-base">Seu histórico de sessões.</p>
        </section>

        {isLoading ? (
          <div className="animate-pulse w-full h-32 bg-[#1A1A1A] rounded-2xl border border-[#333333]" />
        ) : (
          <div className="space-y-4">
            {sessions?.length ? (
              sessions.map((session) => (
                <div key={session.id} className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xs text-[#888888] font-medium mb-1">{new Date(session.startedAt).toLocaleDateString("pt-BR")}</div>
                      <div className="font-display text-2xl text-white">{session.planDayName || "Treino"}</div>
                    </div>
                    <div className={`px-3 py-1 rounded text-[10px] font-bold border ${session.finishedAt ? 'bg-primary/10 text-primary border-primary/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                      {session.finishedAt ? "CONCLUÍDO" : "EM ANDAMENTO"}
                    </div>
                  </div>
                  <div className="flex gap-6 mt-4 pt-4 border-t border-[#333333]/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#888888] uppercase font-medium">Séries</span>
                      <span className="font-display text-xl text-white">{session.totalSets || 0}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#888888] uppercase font-medium">Volume</span>
                      <span className="font-display text-xl text-white">{session.totalVolumeKg || 0}<span className="text-sm font-sans text-[#888888] ml-0.5">kg</span></span>
                    </div>
                    {session.durationMinutes && (
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#888888] uppercase font-medium">Tempo</span>
                        <span className="font-display text-xl text-white">{session.durationMinutes}<span className="text-sm font-sans text-[#888888] ml-0.5">m</span></span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-[#1A1A1A] border border-[#333333] rounded-2xl">
                <span className="material-symbols-outlined text-4xl text-[#888888] mb-2">history</span>
                <p className="text-[#888888]">Nenhum treino registrado ainda.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <StudentBottomNav />
    </div>
  );
}
