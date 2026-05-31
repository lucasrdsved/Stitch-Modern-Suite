import { useGetTrainerDashboard } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { TrainerBottomNav } from "@/components/trainer-bottom-nav";
import { MOCK_TRAINER_DASHBOARD } from "@/lib/mock-data";

export default function TrainerDashboard() {
  const { user } = useAuth();
  const { data: dashboardResponse, isLoading, isError } = useGetTrainerDashboard();
  const dashboard = dashboardResponse || (isError || !dashboardResponse ? MOCK_TRAINER_DASHBOARD : undefined);

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-black"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  const firstName = user?.fullName?.split(" ")[0] || "TREINADOR";

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">TRAINFLOW</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:opacity-80 transition-opacity active:scale-95 text-primary">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
          <div className="h-8 w-8 rounded-full border border-primary/30 overflow-hidden bg-[#1A1A1A] flex items-center justify-center">
            {user?.avatarUrl ? (
              <img alt="User profile avatar" className="w-full h-full object-cover" src={user.avatarUrl} />
            ) : (
              <span className="material-symbols-outlined text-white/70 text-sm">person</span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 px-6 max-w-7xl mx-auto w-full space-y-8">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-primary text-[10px] font-medium uppercase tracking-widest mb-1">Coach Dashboard</p>
            <h2 className="font-display text-white text-[40px] leading-none drop-shadow-[0_0_15px_rgba(201,242,54,0.15)]">
              BOM DIA, {firstName}.
            </h2>
          </div>
          <div className="flex gap-3">
            <Button asChild className="flex-1 md:flex-none h-14 px-6 rounded-full bg-[#1A1A1A] border border-[#333333] hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 group text-white">
              <Link href="/t/students">
                <span className="material-symbols-outlined text-[#888888] group-hover:text-primary">group</span>
                <span className="text-sm font-medium">VER ALUNOS</span>
              </Link>
            </Button>
            <Button asChild className="flex-1 md:flex-none h-14 px-6 rounded-full bg-primary text-black font-bold hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 electric-glow">
              <Link href="/t/assessments/new">
                <span className="material-symbols-outlined">add_chart</span>
                <span className="text-sm font-bold">NOVA AVALIAÇÃO</span>
              </Link>
            </Button>
          </div>
        </section>

        {/* Metrics Bento Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-[#333333] p-5 rounded-xl flex flex-col justify-between h-36 group hover:border-primary transition-all">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary text-2xl">groups</span>
            </div>
            <div>
              <span className="font-display text-4xl block text-white">{dashboard?.activeStudents || 0}</span>
              <span className="text-[10px] text-[#888888] font-medium uppercase tracking-wider">TOTAL DE ALUNOS</span>
            </div>
          </div>
          
          <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-[#333333] p-5 rounded-xl flex flex-col justify-between h-36 group hover:border-primary transition-all">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary text-2xl">fitness_center</span>
            </div>
            <div>
              <span className="font-display text-4xl block text-white">{dashboard?.sessionsToday || 0}</span>
              <span className="text-[10px] text-[#888888] font-medium uppercase tracking-wider">TREINOS HOJE</span>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 bg-[#1A1A1A]/60 backdrop-blur-xl border border-[#333333] p-5 rounded-xl flex flex-col justify-between h-36 group hover:border-primary transition-all relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
              <span className="material-symbols-outlined text-primary text-2xl">chat_bubble</span>
            </div>
            <div className="z-10">
              <span className="font-display text-4xl block text-white">0</span>
              <span className="text-[10px] text-[#888888] font-medium uppercase tracking-wider">MENSAGENS</span>
            </div>
            {/* Decorative element */}
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[100px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
            </div>
          </div>
        </section>

        {/* Activity Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              ATIVIDADE RECENTE
            </h3>
          </div>
          
          <div className="space-y-3">
            {dashboard?.recentActivity?.length ? (
              dashboard.recentActivity.map((act, i) => (
                <div key={i} className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-[#333333] p-4 rounded-xl flex items-center gap-4 hover:translate-x-1 transition-transform">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#222222] flex items-center justify-center border border-primary/20">
                      <span className="material-symbols-outlined text-[#888888]">person</span>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-black"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-bold text-white">{act.studentName}</h4>
                    </div>
                    <p className="text-sm text-[#888888] mt-1">{act.description}</p>
                  </div>
                  <button className="p-2 rounded-full hover:bg-[#222222] transition-colors">
                    <span className="material-symbols-outlined text-[#888888]">arrow_forward_ios</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-[#888888] bg-[#1A1A1A]/60 border border-[#333333] rounded-xl">
                Nenhuma atividade recente
              </div>
            )}
          </div>
        </section>
      </main>

      <TrainerBottomNav />
    </div>
  );
}
