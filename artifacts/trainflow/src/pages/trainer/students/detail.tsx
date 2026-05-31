import { useGetStudent } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrainerStudentDetail() {
  const { id } = useParams();
  const studentId = Number(id);
  const { data: student, isLoading } = useGetStudent(studentId, { query: { enabled: !!studentId, queryKey: ['getStudent', studentId] } });

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-background"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  if (!student) {
    return <div className="p-6 text-center">Aluno não encontrado</div>;
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="p-6 pb-0 flex items-center gap-4">
        <Link href="/t/students">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="font-display text-3xl">PERFIL DO ALUNO</h1>
      </header>

      <div className="p-6 flex flex-col items-center text-center border-b border-border">
        <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center text-muted-foreground mb-4">
          {student.avatarUrl ? <img src={student.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" /> : <User className="w-12 h-12" />}
        </div>
        <h2 className="font-bold text-2xl">{student.fullName}</h2>
        <p className="text-muted-foreground">{student.email}</p>
        <div className="mt-4 flex gap-2">
          <span className={`text-xs px-3 py-1 rounded-full ${student.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
            {student.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border mt-6 border-y border-border">
        <div className="bg-background p-4 text-center">
          <div className="font-display text-3xl text-primary">{student.totalSessions || 0}</div>
          <div className="text-xs text-muted-foreground uppercase">Treinos</div>
        </div>
        <div className="bg-background p-4 text-center">
          <div className="font-display text-3xl text-primary">{student.latestAssessment?.bodyFatPct ? `${student.latestAssessment.bodyFatPct}%` : '--'}</div>
          <div className="text-xs text-muted-foreground uppercase">BF%</div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section>
          <h3 className="font-display text-xl mb-4 text-muted-foreground">PLANO ATUAL</h3>
          {student.activePlan ? (
            <div className="bg-card rounded-2xl p-4">
              <div className="font-bold text-lg">{student.activePlan.name}</div>
              <Button asChild className="w-full mt-4 bg-secondary text-white border border-border">
                <Link href={`/t/plans/${student.activePlan.id}`}>EDITAR PLANO</Link>
              </Button>
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-6 text-center border border-dashed border-border">
              <p className="text-muted-foreground mb-4">Sem plano ativo</p>
              <Button asChild className="bg-primary text-black font-bold">
                <Link href={`/t/plans/new?studentId=${student.id}`}>CRIAR PLANO</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
