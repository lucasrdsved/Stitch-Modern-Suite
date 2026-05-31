import { useGetMyLatestAssessment, useListMySessions } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowLeft, Play, Dumbbell } from "lucide-react";

export default function StudentWorkout() {
  const { data: sessions, isLoading } = useListMySessions();

  return (
    <div className="min-h-[100dvh] pb-24 bg-background text-foreground p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-4xl">MEUS TREINOS</h1>
      </header>

      {isLoading ? (
        <div className="animate-pulse w-full h-32 bg-card rounded-3xl" />
      ) : (
        <div className="space-y-4">
          {sessions?.length ? (
            sessions.map((session) => (
              <div key={session.id} className="bg-card border border-border rounded-3xl p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-muted-foreground text-sm mb-1">{new Date(session.startedAt).toLocaleDateString()}</div>
                    <div className="font-bold text-lg">{session.planDayName || 'Treino'}</div>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                    {session.finishedAt ? 'CONCLUÍDO' : 'EM ANDAMENTO'}
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <div><span className="text-muted-foreground">Séries:</span> <span className="font-bold">{session.totalSets || 0}</span></div>
                  <div><span className="text-muted-foreground">Volume:</span> <span className="font-bold">{session.totalVolumeKg || 0}kg</span></div>
                  {session.durationMinutes && <div><span className="text-muted-foreground">Tempo:</span> <span className="font-bold">{session.durationMinutes}m</span></div>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">Nenhum treino registrado ainda.</div>
          )}
        </div>
      )}

      {/* Bottom Nav Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-t border-border flex items-center justify-around px-6">
        <Link href="/home" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/treinos" className="flex flex-col items-center text-primary">
          <span className="text-xs font-medium">Treino</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Chat</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Perfil</span>
        </Link>
      </div>
    </div>
  );
}
