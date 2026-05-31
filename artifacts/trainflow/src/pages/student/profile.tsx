import { useAuth } from "@/lib/auth";
import { useGetMyLatestAssessment } from "@workspace/api-client-react";
import { Link } from "wouter";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { motion } from "framer-motion";

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const { data: assessment, isLoading } = useGetMyLatestAssessment();

  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col pb-24">
      {/* TopAppBar - Glassmorphism */}
      <header className="fixed top-0 w-full z-50 glass-nav flex items-center justify-between px-6 h-16 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/home" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors active:scale-95 text-foreground">
            <span className="material-symbols-outlined !text-2xl">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-widest text-3xl leading-none mt-1 uppercase">Perfil</h1>
        </div>
        <button 
          onClick={logout}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors active:scale-95 text-foreground"
        >
          <span className="material-symbols-outlined !text-2xl">logout</span>
        </button>
      </header>

      <main className="flex-1 pt-28 px-6 flex flex-col gap-10 max-w-2xl mx-auto w-full">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-primary/20 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-card border-2 border-primary/50 electric-glow shrink-0 flex items-center justify-center mb-6">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-muted-foreground text-5xl">person</span>
              )}
            </div>
          </div>
          <h2 className="font-display text-foreground text-4xl uppercase tracking-wider leading-none mb-2">{user?.fullName}</h2>
          <p className="text-muted-foreground text-sm font-medium tracking-wide">{user?.email}</p>
        </motion.section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-white/5" />
            <h3 className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">Métricas Atuais</h3>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>
          
          {isLoading ? (
            <div className="glass-panel rounded-3xl p-8 h-56 animate-pulse" />
          ) : assessment ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-3xl p-8 space-y-8 relative overflow-hidden group hover:border-primary/20 transition-colors"
            >
              <div className="absolute -top-6 -right-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <span className="material-symbols-outlined text-[160px] text-white">accessibility_new</span>
              </div>
              
              <div className="relative z-10 grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">monitoring</span>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Somatotipo</div>
                  </div>
                  <div className="font-display text-4xl text-primary">{assessment.somatotype || 'N/A'}</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Gordura Corporal</div>
                    <span className="material-symbols-outlined text-primary text-sm">percent</span>
                  </div>
                  <div className="font-display text-4xl text-foreground">{assessment.bodyFatPct ? `${assessment.bodyFatPct}%` : '--'}</div>
                </div>
              </div>

              <div className="h-[1px] w-full bg-white/5" />

              <div className="relative z-10 grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">weight</span>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Peso Atual</div>
                  </div>
                  <div className="font-display text-4xl text-foreground">{assessment.weightKg} <span className="text-lg opacity-50">KG</span></div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Massa Magra</div>
                    <span className="material-symbols-outlined text-primary text-sm">fitness_center</span>
                  </div>
                  <div className="font-display text-4xl text-foreground">{assessment.leanMassKg ? `${assessment.leanMassKg}kg` : '--'}</div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass-panel rounded-3xl p-10 text-center text-muted-foreground border-dashed border-white/10">
              <span className="material-symbols-outlined text-4xl mb-3 block opacity-20">analytics</span>
              <p className="text-sm font-medium tracking-wide">Nenhuma avaliação física registrada.</p>
            </div>
          )}
        </section>

        <section className="mt-4">
           <button className="w-full h-14 glass-panel rounded-2xl flex items-center justify-between px-6 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">history</span>
                <span className="font-display text-xl tracking-wider">Histórico de Avaliações</span>
              </div>
              <span className="material-symbols-outlined text-muted-foreground">chevron_right</span>
           </button>
        </section>
      </main>

      <StudentBottomNav />
    </div>
  );
}
