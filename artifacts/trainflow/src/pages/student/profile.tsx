import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { motion } from "framer-motion";
import { getLatestAssessment } from "@/lib/mock-store";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const assessment = getLatestAssessment();

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <Link href="/home" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors active:scale-95 text-white">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-widest text-3xl leading-none mt-1 uppercase">Perfil</h1>
        </div>
        <button 
          onClick={logout}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors active:scale-95 text-white"
        >
          <span className="material-symbols-outlined text-2xl">logout</span>
        </button>
      </header>

      <main className="flex-1 pt-28 px-6 flex flex-col gap-10 max-w-2xl mx-auto w-full">
        {/* User Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-primary/20 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-[#1A1A1A] border-2 border-primary/50 electric-glow shrink-0 flex items-center justify-center">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[#888888] text-5xl">person</span>
              )}
            </div>
          </div>
          <h2 className="font-display text-white text-4xl uppercase tracking-wider leading-none mb-2">{user?.fullName}</h2>
          <p className="text-[#888888] text-sm font-medium tracking-wide uppercase">{user?.email}</p>
        </motion.section>

        {/* Metrics Grid */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-white/5" />
            <h3 className="text-[10px] text-[#888888] uppercase tracking-[0.2em] font-black">Métricas Corporais</h3>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-primary/20 transition-all">
              <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-7xl text-white">monitoring</span>
              </div>
              <span className="text-[9px] text-[#888888] uppercase font-black tracking-widest block mb-1">Somatotipo</span>
              <div className="font-display text-3xl text-primary uppercase">{assessment.somatotype}</div>
            </div>
            <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-primary/20 transition-all">
              <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-7xl text-white">percent</span>
              </div>
              <span className="text-[9px] text-[#888888] uppercase font-black tracking-widest block mb-1">% Gordura</span>
              <div className="font-display text-3xl text-white">{assessment.bodyFatPct}%</div>
            </div>
            <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-primary/20 transition-all">
               <span className="text-[9px] text-[#888888] uppercase font-black tracking-widest block mb-1">Peso</span>
               <div className="font-display text-3xl text-white">{assessment.weightKg} <span className="text-sm font-sans text-[#888888] lowercase">kg</span></div>
            </div>
            <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-primary/20 transition-all">
               <span className="text-[9px] text-[#888888] uppercase font-black tracking-widest block mb-1">Massa Magra</span>
               <div className="font-display text-3xl text-white">{assessment.leanMassKg} <span className="text-sm font-sans text-[#888888] lowercase">kg</span></div>
            </div>
          </div>
        </section>

        {/* Evolution Chart */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-white/5" />
            <h3 className="text-[10px] text-[#888888] uppercase tracking-[0.2em] font-black">Evolução do Peso</h3>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 rounded-[32px] p-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={(assessment as any).history}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9F236" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C9F236" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#C9F236', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#C9F236" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Settings Links */}
        <section className="space-y-3 pb-8">
           <button className="w-full h-16 bg-[#1A1A1A] border border-white/5 rounded-2xl flex items-center justify-between px-6 hover:bg-[#222222] transition-colors group">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">history</span>
                <span className="font-display text-xl tracking-wider uppercase">Histórico de Medidas</span>
              </div>
              <span className="material-symbols-outlined text-[#888888]">chevron_right</span>
           </button>
           <button className="w-full h-16 bg-[#1A1A1A] border border-white/5 rounded-2xl flex items-center justify-between px-6 hover:bg-[#222222] transition-colors group">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">settings</span>
                <span className="font-display text-xl tracking-wider uppercase">Configurações</span>
              </div>
              <span className="material-symbols-outlined text-[#888888]">chevron_right</span>
           </button>
        </section>
      </main>

      <StudentBottomNav />
    </div>
  );
}
