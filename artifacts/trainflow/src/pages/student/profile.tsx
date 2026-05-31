import { useAuth } from "@/lib/auth";
import { useGetMyLatestAssessment } from "@workspace/api-client-react";
import { Link } from "wouter";
import { StudentBottomNav } from "@/components/student-bottom-nav";

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const { data: assessment, isLoading } = useGetMyLatestAssessment();

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <Link href="/home" className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity active:scale-95 text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">PERFIL</h1>
        </div>
        <button 
          onClick={logout}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors active:scale-95 text-white"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-8 max-w-2xl mx-auto w-full">
        <section className="flex flex-col items-center mb-2">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#1A1A1A] border-2 border-primary shrink-0 flex items-center justify-center mb-4">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-white/70 text-4xl">person</span>
            )}
          </div>
          <h2 className="font-display text-white text-[32px] uppercase tracking-wider leading-none mb-1">{user?.fullName}</h2>
          <p className="text-[#888888] text-sm">{user?.email}</p>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm text-[#888888] uppercase tracking-wider font-bold">MÉTRICAS ATUAIS</h3>
          
          {isLoading ? (
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 h-48 animate-pulse" />
          ) : assessment ? (
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-8xl text-white">accessibility_new</span>
              </div>
              
              <div className="relative z-10 flex justify-between items-end border-b border-[#333333]/50 pb-4">
                <div>
                  <div className="text-[10px] text-[#888888] uppercase font-medium mb-1">Somatotipo</div>
                  <div className="font-display text-3xl text-primary">{assessment.somatotype || 'N/A'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#888888] uppercase font-medium mb-1">Gordura</div>
                  <div className="font-display text-3xl text-white">{assessment.bodyFatPct ? `${assessment.bodyFatPct}%` : '--'}</div>
                </div>
              </div>
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-[#888888] uppercase font-medium mb-1">Peso</div>
                  <div className="font-display text-3xl text-white">{assessment.weightKg}kg</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#888888] uppercase font-medium mb-1">Massa Magra</div>
                  <div className="font-display text-3xl text-white">{assessment.leanMassKg ? `${assessment.leanMassKg}kg` : '--'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 text-center text-[#888888]">
              Sem avaliação física registrada.
            </div>
          )}
        </section>
      </main>

      <StudentBottomNav />
    </div>
  );
}
