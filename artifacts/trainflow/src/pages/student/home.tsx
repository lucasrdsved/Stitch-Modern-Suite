import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { getSessions, getStudentToday, listConversations } from "@/lib/mock-store";

export default function StudentHome() {
  const { user } = useAuth();
  
  const today = getStudentToday();
  const sessions = getSessions();
  const conversations = listConversations();
  const lastConversation = conversations[0];

  const firstName = user?.fullName?.split(" ")[0] || "ALUNO";
  const todayWorkout = today?.todayWorkout;

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1A1A1A] border border-white/5 shrink-0 flex items-center justify-center">
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
          <h2 className="font-display text-white text-[40px] uppercase tracking-wider leading-none">OLÁ, {firstName}</h2>
          <p className="text-[#888888] text-base">Pronto para destruir seus limites hoje?</p>
        </section>

        {/* Active Workout Card */}
        {todayWorkout ? (
          <section className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden shadow-2xl group">
            {/* Lime accent glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="flex flex-col gap-2 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs text-primary uppercase tracking-widest font-bold">Treino de Hoje</span>
              </div>
              <h3 className="font-display text-white text-[32px] leading-tight uppercase">
                {todayWorkout.name}<br/>
                <span className="text-[#888888] font-display text-2xl">{(todayWorkout as any).focus || 'COMPLETO'}</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 z-10">
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col">
                <span className="text-[10px] text-[#888888] uppercase font-bold tracking-wider">Exercícios</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-display text-white text-2xl">{(todayWorkout.exercises?.length || 0).toString().padStart(2, '0')}</span>
                </div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col">
                <span className="text-[10px] text-[#888888] uppercase font-bold tracking-wider">Duração Est.</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-display text-white text-2xl">{(todayWorkout as any).estimatedMinutes || 45}</span>
                  <span className="text-[10px] text-[#888888] font-bold">MIN</span>
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
          <section className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 text-center shadow-2xl">
            <h3 className="font-display text-2xl text-[#888888] mb-2 uppercase">Nenhum treino hoje</h3>
            <p className="text-sm text-[#888888]">Aproveite o descanso ou verifique seu histórico.</p>
          </section>
        )}

        {/* Trainer Message Preview */}
        {lastConversation && (
          <Link href={`/chat/${lastConversation.id}`}>
            <section className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 flex gap-4 items-center cursor-pointer hover:bg-[#222222] transition-colors group">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center overflow-hidden border border-white/5">
                  {lastConversation.otherUserAvatarUrl ? (
                    <img alt="Trainer avatar" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all" src={lastConversation.otherUserAvatarUrl} />
                  ) : (
                    <span className="material-symbols-outlined text-white/30">person</span>
                  )}
                </div>
                <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-[#1A1A1A]"></div>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm text-white font-bold">{lastConversation.otherUserName}</span>
                  <span className="text-[10px] text-[#888888] font-bold">{(lastConversation as any).lastMessageTime || 'Agora'}</span>
                </div>
                <p className="text-xs text-[#888888] truncate">{lastConversation.lastMessage}</p>
              </div>
              <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors">chevron_right</span>
            </section>
          </Link>
        )}

        {/* Recent Sessions Horizontal Scroll */}
        <section className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] text-[#888888] uppercase tracking-[0.2em] font-black">Últimas Sessões</h3>
            <Link href="/treinos" className="text-[10px] text-primary hover:underline font-black tracking-widest uppercase">Ver Histórico</Link>
          </div>
          
          <div className="flex overflow-x-auto gap-4 snap-x -mx-6 px-6 pb-4 no-scrollbar">
            {sessions.map((session: any) => (
              <div key={session.id} className="min-w-[220px] bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 snap-center flex flex-col gap-3 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-sm text-white font-bold truncate pr-2">{session.planDayName}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border tracking-widest ${session.status === 'ONTEM' ? 'bg-primary/10 text-primary border-primary/20' : 'text-[#888888] border-white/5'}`}>
                    {session.status}
                  </span>
                </div>
                <div className="flex gap-4 mt-1 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#888888] uppercase font-black tracking-widest mb-0.5">Tempo</span>
                    <span className="font-display text-xl text-white">{session.durationMinutes}<span className="text-[10px] font-sans text-[#888888] ml-0.5">m</span></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#888888] uppercase font-black tracking-widest mb-0.5">Volume</span>
                    <span className="font-display text-xl text-white">{(session.totalVolumeKg / 1000).toFixed(1)}<span className="text-[10px] font-sans text-[#888888] ml-0.5">k</span></span>
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
