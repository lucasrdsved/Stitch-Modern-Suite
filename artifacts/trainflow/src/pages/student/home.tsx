import { useAuth } from "@/lib/auth";
import { useGetStudentToday } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function StudentHome() {
  const { user } = useAuth();
  const { data: today, isLoading } = useGetStudentToday();

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-background"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  return (
    <div className="min-h-[100dvh] pb-24 bg-background text-foreground p-6">
      <header className="mb-8">
        <h1 className="font-display text-4xl">OLÁ, <span className="text-primary">{user?.fullName?.split(" ")[0] || "ALUNO"}</span></h1>
      </header>

      {today?.todayWorkout ? (
        <div className="bg-card rounded-[32px] p-6 mb-8 border border-border">
          <h3 className="font-display text-2xl mb-2">{today.todayWorkout.name}</h3>
          <p className="text-muted-foreground mb-6">{today.todayWorkout.exercises?.length || 0} exercícios</p>
          <Button asChild className="w-full h-12 rounded-full bg-primary text-black font-bold">
            <Link href={`/workout/new?dayId=${today.todayWorkout.id}`}>INICIAR TREINO →</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-card rounded-[32px] p-6 mb-8 border border-border text-center">
          <h3 className="font-display text-2xl text-muted-foreground">NENHUM TREINO HOJE</h3>
        </div>
      )}

      {/* Bottom Nav Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-t border-border flex items-center justify-around px-6">
        <div className="flex flex-col items-center text-primary">
          <div className="w-1.5 h-1.5 rounded-full bg-primary mb-1" />
          <span className="text-xs font-medium">Home</span>
        </div>
        <div className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Treino</span>
        </div>
        <div className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Chat</span>
        </div>
        <div className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Perfil</span>
        </div>
      </div>
    </div>
  );
}
