import { useGetTrainerDashboard } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function TrainerDashboard() {
  const { data: dashboard, isLoading } = useGetTrainerDashboard();

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-background"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  return (
    <div className="min-h-[100dvh] pb-24 bg-background text-foreground p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl">DASHBOARD</h1>
        <div className="w-10 h-10 rounded-full bg-card" />
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card rounded-3xl p-5">
          <div className="text-muted-foreground text-sm mb-1">Alunos Ativos</div>
          <div className="font-display text-4xl text-primary">{dashboard?.activeStudents || 0}</div>
        </div>
        <div className="bg-card rounded-3xl p-5">
          <div className="text-muted-foreground text-sm mb-1">Sessões Hoje</div>
          <div className="font-display text-4xl text-primary">{dashboard?.sessionsToday || 0}</div>
        </div>
      </div>

      <div className="flex gap-4 mb-10">
        <Button asChild className="flex-1 h-14 rounded-full bg-primary text-black font-bold">
          <Link href="/t/assessments/new">Nova Avaliação</Link>
        </Button>
        <Button asChild variant="secondary" className="flex-1 h-14 rounded-full bg-card text-white font-bold border border-border">
          <Link href="/t/students">Ver Alunos</Link>
        </Button>
      </div>

      <h2 className="font-display text-2xl mb-4 text-muted-foreground">ATIVIDADE RECENTE</h2>
      <div className="space-y-4">
        {dashboard?.recentActivity?.length ? (
          dashboard.recentActivity.map((act, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 flex gap-4 items-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div>
                <div className="font-bold">{act.studentName}</div>
                <div className="text-sm text-muted-foreground">{act.description}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground text-center py-8">Nenhuma atividade recente</div>
        )}
      </div>

      {/* Bottom Nav Trainer */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-t border-border flex items-center justify-around px-6">
        <Link href="/t/dashboard" className="flex flex-col items-center text-primary">
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/t/students" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Alunos</span>
        </Link>
        <Link href="/t/exercises" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Biblioteca</span>
        </Link>
      </div>
    </div>
  );
}
