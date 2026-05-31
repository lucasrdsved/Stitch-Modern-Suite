import { useGetStudent, useListStudentAssessments } from "@workspace/api-client-react";
import { useRoute, Link } from "wouter";
import { MOCK_STUDENT_DETAIL } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export default function TrainerStudentDetail() {
  const [, params] = useRoute("/students/:id");
  const studentId = parseInt(params?.id || "0");

  const { data: studentResponse, isLoading } = useGetStudent({ id: studentId });
  const { data: assessments } = useListStudentAssessments({ studentId });

  const student = studentResponse || MOCK_STUDENT_DETAIL;

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-black"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-6 selection:bg-primary selection:text-black">
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <Link href="/students" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-white">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-widest text-3xl mt-1 uppercase">DETALHE</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-white">
          <span className="material-symbols-outlined text-2xl">edit</span>
        </button>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-10 max-w-5xl mx-auto w-full">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-center gap-8 bg-[#1A1A1A] border border-white/5 rounded-[40px] p-8">
           <div className="w-32 h-32 rounded-[32px] bg-black border-2 border-primary/30 flex items-center justify-center overflow-hidden shrink-0 electric-glow">
              {student.avatarUrl ? (
                <img src={student.avatarUrl} className="w-full h-full object-cover grayscale" alt={student.fullName} />
              ) : (
                <span className="material-symbols-outlined text-white/20 text-6xl">person</span>
              )}
           </div>
           <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="font-display text-white text-5xl uppercase leading-none mb-3">{student.fullName}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/5">
                    <span className="material-symbols-outlined text-primary text-sm">mail</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#888888]">{student.email}</span>
                 </div>
                 <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/5">
                    <span className="material-symbols-outlined text-primary text-sm">event</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#888888]">{student.totalSessions} Treinos Realizados</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[#1A1A1A] border border-white/5 rounded-[32px] p-6">
              <span className="text-[10px] text-[#888888] uppercase font-black tracking-widest block mb-4">Composição Corporal</span>
              <div className="flex flex-col gap-4">
                 <div className="flex justify-between items-end">
                    <span className="text-xs text-[#888888] font-bold uppercase">Gordura</span>
                    <span className="font-display text-3xl text-primary">{student.latestAssessment?.bodyFatPct}%</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-xs text-[#888888] font-bold uppercase">Peso Atual</span>
                    <span className="font-display text-3xl text-white">{student.latestAssessment?.weightKg} <small className="text-xs font-sans text-[#444] lowercase">kg</small></span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-xs text-[#888888] font-bold uppercase">Somatotipo</span>
                    <span className="font-display text-3xl text-white">{student.latestAssessment?.somatotype}</span>
                 </div>
              </div>
           </div>

           <div className="bg-[#1A1A1A] border border-white/5 rounded-[32px] p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                 <span className="text-[10px] text-[#888888] uppercase font-black tracking-widest">Plano de Treino Ativo</span>
                 <Link href="/plans/new" className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">Alterar Plano</Link>
              </div>
              <div className="flex flex-col gap-4">
                 <h3 className="font-display text-4xl text-white uppercase italic tracking-tighter leading-none">
                    {student.activePlan?.name || 'Sem plano ativo'}
                 </h3>
                 <div className="flex gap-3">
                    <span className="bg-black/40 border border-white/5 px-3 py-1 rounded-full text-[9px] font-black text-[#888888] uppercase tracking-widest">Volume Alto</span>
                    <span className="bg-black/40 border border-white/5 px-3 py-1 rounded-full text-[9px] font-black text-[#888888] uppercase tracking-widest">Hipertrofia</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Assessment & History Links */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Link href="/assessments/new" className="h-20 bg-primary hover:bg-primary/90 text-black rounded-3xl flex items-center justify-between px-8 group transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                 <span className="material-symbols-outlined text-3xl font-bold">analytics</span>
                 <span className="font-display text-2xl uppercase tracking-wider">Nova Avaliação</span>
              </div>
              <span className="material-symbols-outlined font-bold">arrow_forward</span>
           </Link>
           <Link href={`/chat/${studentId}`} className="h-20 bg-[#1A1A1A] border border-white/5 hover:border-primary/30 text-white rounded-3xl flex items-center justify-between px-8 group transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                 <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">forum</span>
                 <span className="font-display text-2xl uppercase tracking-wider">Abrir Chat</span>
              </div>
              <span className="material-symbols-outlined text-white/10 group-hover:text-primary transition-colors">arrow_forward</span>
           </Link>
        </section>

        {/* History Timeline */}
        <section className="flex flex-col gap-6 mb-8">
           <div className="flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-white/5" />
              <h3 className="text-[10px] text-[#888888] uppercase tracking-[0.2em] font-black">Histórico de Atividades</h3>
              <div className="h-[1px] flex-1 bg-white/5" />
           </div>
           
           <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-[#222222] transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-[#444]">
                         <span className="material-symbols-outlined">history</span>
                      </div>
                      <div>
                         <p className="text-sm text-white font-bold">Completou Treino A</p>
                         <span className="text-[10px] text-[#888888] font-bold uppercase">Há {i * 2} dias</span>
                      </div>
                   </div>
                   <span className="material-symbols-outlined text-white/5">chevron_right</span>
                </div>
              ))}
           </div>
        </section>
      </main>
    </div>
  );
}
