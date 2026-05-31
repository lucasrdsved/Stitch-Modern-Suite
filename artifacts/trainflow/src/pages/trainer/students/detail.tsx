import { useGetStudent } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MOCK_STUDENT_DETAIL } from "@/lib/mock-data";

export default function TrainerStudentDetail() {
  const { id } = useParams();
  const studentId = Number(id);
  const { data: studentResponse, isLoading, isError } = useGetStudent(studentId, { query: { enabled: !!studentId, queryKey: ['getStudent', studentId] } });
  const student = studentResponse || (isError || !studentResponse ? MOCK_STUDENT_DETAIL : undefined);

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-black"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  if (!student) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-black text-white">Aluno não encontrado</div>;
  }

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <Link href="/t/students" className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity active:scale-95 text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">PERFIL</h1>
        </div>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-8 max-w-2xl mx-auto w-full">
        <section className="flex flex-col items-center mb-2">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#1A1A1A] border-2 border-primary shrink-0 flex items-center justify-center mb-4 relative">
            {student.avatarUrl ? (
              <img src={student.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-white/70 text-4xl">person</span>
            )}
            <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-black ${student.status === 'active' ? 'bg-primary' : 'bg-warning'}`}></div>
          </div>
          <h2 className="font-display text-white text-[32px] uppercase tracking-wider leading-none mb-1">{student.fullName}</h2>
          <p className="text-[#888888] text-sm">{student.email}</p>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-[#333333] p-5 rounded-xl flex flex-col justify-between h-28 group hover:border-primary transition-all">
            <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider">Treinos Totais</div>
            <span className="font-display text-4xl block text-white">{student.totalSessions || 0}</span>
          </div>
          <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-[#333333] p-5 rounded-xl flex flex-col justify-between h-28 group hover:border-primary transition-all">
            <div className="text-[10px] text-[#888888] font-medium uppercase tracking-wider">BF% Atual</div>
            <span className="font-display text-4xl block text-primary">
              {student.latestAssessment?.bodyFatPct ? `${student.latestAssessment.bodyFatPct}%` : '--'}
            </span>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-[#888888] uppercase tracking-wider font-bold">PLANO DE TREINO</h3>
          </div>

          {student.activePlan ? (
            <div className="glass-panel border border-[#333333] rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-7xl text-white">fitness_center</span>
              </div>
              <div className="relative z-10">
                <div className="text-[10px] text-primary font-medium uppercase tracking-widest mb-1">Ativo Agora</div>
                <h4 className="font-display text-3xl text-white mb-6 uppercase">{student.activePlan.name}</h4>
                <Button asChild className="w-full h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-colors">
                  <Link href={`/t/plans/${student.activePlan.id}`}>ABRIR BUILDER</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-[#1A1A1A]/40 border border-dashed border-[#333333] rounded-2xl p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-[#444444] mb-3">format_list_bulleted_add</span>
              <p className="text-[#888888] mb-6 text-sm">Este aluno ainda não possui um plano de treino ativo.</p>
              <Button asChild className="w-full h-14 rounded-full bg-primary text-black font-display text-xl electric-glow tracking-wide">
                <Link href={`/t/plans/new?studentId=${student.id}`}>CRIAR PRIMEIRO PLANO</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
