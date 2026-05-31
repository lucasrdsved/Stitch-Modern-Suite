import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { getTrainerDashboard, listStudents } from "@/lib/mock-store";

export default function TrainerDashboard() {
  const { user } = useAuth();
  const base = getTrainerDashboard() as any;
  const students = listStudents();
  const dashboard = {
    ...base,
    activeStudents: students.filter((s: any) => s.status === "active").length,
  };

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-6 selection:bg-primary selection:text-black">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-black">
            <span className="material-symbols-outlined font-bold">dashboard</span>
          </div>
          <h1 className="font-display text-white tracking-widest text-3xl mt-1">COACH DASH</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-white">
            <span className="material-symbols-outlined">search</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center overflow-hidden">
             {user?.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-white/20">person</span>}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-8 max-w-5xl mx-auto w-full">
        {/* Welcome Section */}
        <section>
          <h2 className="font-display text-white text-4xl uppercase tracking-tighter leading-none mb-2">BOM DIA, {user?.fullName?.split(" ")[0]}</h2>
          <p className="text-[#888888] text-sm font-medium tracking-wide uppercase">Sua academia tem {dashboard.activeStudents} alunos ativos hoje.</p>
        </section>

        {/* Quick Stats Bento Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 flex flex-col gap-1 hover:border-primary/20 transition-all group">
              <span className="text-[10px] text-[#888888] uppercase font-black tracking-widest">Alunos Ativos</span>
              <div className="font-display text-4xl text-primary group-hover:scale-105 transition-transform">{dashboard.activeStudents}</div>
           </div>
           <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 flex flex-col gap-1 hover:border-primary/20 transition-all group">
              <span className="text-[10px] text-[#888888] uppercase font-black tracking-widest">Treinos Hoje</span>
              <div className="font-display text-4xl text-white group-hover:scale-105 transition-transform">{dashboard.sessionsToday}</div>
           </div>
           <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 flex flex-col gap-1 hover:border-primary/20 transition-all group col-span-2">
              <span className="text-[10px] text-[#888888] uppercase font-black tracking-widest">Mensagens Pendentes</span>
              <div className="flex items-center gap-3">
                 <div className="font-display text-4xl text-white">04</div>
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] bg-black overflow-hidden">
                         <img src={`https://i.pravatar.cc/100?u=${i}`} className="w-full h-full object-cover grayscale" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Action Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Link href="/t/students" className="bg-primary hover:bg-primary/90 text-black rounded-[32px] p-8 flex flex-col gap-4 group transition-all active:scale-[0.98] shadow-2xl electric-glow">
              <span className="material-symbols-outlined text-5xl font-bold group-hover:scale-110 transition-transform">group</span>
              <div>
                 <h3 className="font-display text-3xl uppercase leading-none mb-1">Gerenciar Alunos</h3>
                 <p className="text-black/60 text-xs font-bold uppercase tracking-widest">Ver lista, evoluções e perfis</p>
              </div>
           </Link>
           <div className="grid grid-cols-1 gap-4">
              <Link href="/t/assessments/new" className="bg-[#1A1A1A] border border-white/5 hover:border-primary/30 rounded-[32px] p-6 flex items-center justify-between group transition-all">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined">analytics</span>
                    </div>
                    <div>
                       <h3 className="font-display text-2xl uppercase leading-none">Nova Avaliação</h3>
                       <p className="text-[#888888] text-[10px] font-bold uppercase tracking-widest">Protocolo Pollock 7 Dobras</p>
                    </div>
                 </div>
                 <span className="material-symbols-outlined text-white/10 group-hover:text-primary transition-colors">arrow_forward</span>
              </Link>
              <Link href="/t/plans/new" className="bg-[#1A1A1A] border border-white/5 hover:border-primary/30 rounded-[32px] p-6 flex items-center justify-between group transition-all">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined">fitness_center</span>
                    </div>
                    <div>
                       <h3 className="font-display text-2xl uppercase leading-none">Prescrever Treino</h3>
                       <p className="text-[#888888] text-[10px] font-bold uppercase tracking-widest">Montar novo plano de ação</p>
                    </div>
                 </div>
                 <span className="material-symbols-outlined text-white/10 group-hover:text-primary transition-colors">arrow_forward</span>
              </Link>
           </div>
        </section>

        {/* Recent Activity Feed */}
        <section className="flex flex-col gap-6 mb-8">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] text-[#888888] uppercase tracking-[0.3em] font-black">Atividade Recente</h3>
              <button className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">Ver Todas</button>
           </div>

           <div className="bg-[#1A1A1A] border border-white/5 rounded-[32px] overflow-hidden">
              {dashboard.recentActivity.map((activity: any, idx: number) => (
                <div key={activity.id} className={`p-5 flex items-center gap-4 hover:bg-white/5 transition-colors ${idx !== dashboard.recentActivity.length - 1 ? 'border-b border-white/5' : ''}`}>
                   <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-xl">notifications</span>
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm text-white leading-tight">
                         <span className="font-bold">{activity.studentName}</span> {activity.description}
                      </p>
                      <span className="text-[10px] text-[#888888] font-bold uppercase tracking-tighter mt-1 block">{activity.time}</span>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </main>

      {/* Navigation for Trainer could be added here if needed, but currently dashboard serves as hub */}
    </div>
  );
}
