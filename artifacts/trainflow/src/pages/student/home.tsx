import { useAuth } from "@/lib/auth";
import { useGetStudentToday } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { StudentBottomNav } from "@/components/student-bottom-nav";

export default function StudentHome() {
  const { user } = useAuth();
  const { data: today, isLoading } = useGetStudentToday();

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-black"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  const firstName = user?.fullName?.split(" ")[0] || "ALUNO";

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1A1A1A] border border-[#333333] shrink-0 flex items-center justify-center">
            {user?.avatarUrl ? (
              <img alt="User profile avatar" className="w-full h-full object-cover" src={user.avatarUrl} />
            ) : (
              <span className="material-symbols-outlined text-white/70 text-sm">person</span>
            )}
          </div>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">TRAINFLOW</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity active:scale-95 text-primary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 pt-24 px-6 flex flex-col gap-8 max-w-2xl mx-auto w-full">
        {/* Greeting Section */}
        <section className="flex flex-col gap-1">
          <h2 className="font-display text-white text-[32px] uppercase tracking-wider leading-none">OLÁ, {firstName}</h2>
          <p className="text-[#888888] text-base">Pronto para destruir seus limites hoje?</p>
        </section>

        {/* Active Workout Card */}
        {today?.todayWorkout ? (
          <section className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden shadow-2xl">
            {/* Lime accent glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col gap-2 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs text-primary uppercase tracking-widest font-bold">Treino de Hoje</span>
              </div>
              <h3 className="font-display text-white text-[32px] leading-tight">
                {today.todayWorkout.name}<br/>
                <span className="text-[#888888] font-display text-2xl">{today.todayWorkout.focus || 'COMPLETO'}</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 z-10">
              <div className="bg-black/40 border border-[#333333] rounded-lg p-3 flex flex-col">
                <span className="text-xs text-[#888888] uppercase font-medium">Exercícios</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-display text-white text-2xl">{(today.todayWorkout.exercises?.length || 0).toString().padStart(2, '0')}</span>
                </div>
              </div>
              <div className="bg-black/40 border border-[#333333] rounded-lg p-3 flex flex-col">
                <span className="text-xs text-[#888888] uppercase font-medium">Duração Est.</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-display text-white text-2xl">{today.todayWorkout.estimatedMinutes || 45}</span>
                  <span className="text-xs text-[#888888] font-medium">MIN</span>
                </div>
              </div>
            </div>
            
            <Button asChild className="w-full h-14 bg-primary text-black rounded-full flex items-center justify-center gap-2 font-display text-2xl hover:brightness-110 transition-all active:scale-95 z-10 mt-2 tracking-wide electric-glow">
              <Link href="/treinos">
                INICIAR TREINO
                <span className="material-symbols-outlined font-bold text-[28px]">arrow_forward</span>
              </Link>
            </Button>
          </section>
        ) : (
          <section className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 text-center shadow-2xl">
            <h3 className="font-display text-2xl text-[#888888] mb-2">NENHUM TREINO HOJE</h3>
            <p className="text-sm text-[#888888]">Aproveite o descanso ou verifique seu histórico.</p>
          </section>
        )}

        {/* Recent Sessions Horizontal Scroll */}
        <section className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-[#888888] uppercase tracking-wider font-bold">Últimas Sessões</h3>
            <Link href="/treinos" className="text-xs text-primary hover:underline font-medium">Ver Histórico</Link>
          </div>
          
          <div className="flex overflow-x-auto gap-4 snap-x -mx-6 px-6 pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Fake data based on mockup for now, since API doesn't return recent sessions in this endpoint */}
            <div className="min-w-[220px] bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 snap-center flex flex-col gap-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-sm text-white font-medium">Costas e Bíceps</span>
                <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">ONTEM</span>
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#888888] uppercase font-medium">Tempo</span>
                  <span className="font-display text-xl text-white">52<span className="text-sm font-sans text-[#888888] ml-0.5">m</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#888888] uppercase font-medium">Volume</span>
                  <span className="font-display text-xl text-white">4.2<span className="text-sm font-sans text-[#888888] ml-0.5">k</span></span>
                </div>
              </div>
            </div>
            
            <div className="min-w-[220px] bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 snap-center flex flex-col gap-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-sm text-white font-medium">Pernas Completas</span>
                <span className="text-[10px] text-[#888888] font-medium">24 OUT</span>
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#888888] uppercase font-medium">Tempo</span>
                  <span className="font-display text-xl text-white">65<span className="text-sm font-sans text-[#888888] ml-0.5">m</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#888888] uppercase font-medium">Volume</span>
                  <span className="font-display text-xl text-white">6.8<span className="text-sm font-sans text-[#888888] ml-0.5">k</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StudentBottomNav />
    </div>
  );
}
