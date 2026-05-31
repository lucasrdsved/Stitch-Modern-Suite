import { useAuth } from "@/lib/auth";
import { useGetMyLatestAssessment } from "@workspace/api-client-react";
import { Link } from "wouter";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const { data: assessment, isLoading } = useGetMyLatestAssessment();

  return (
    <div className="min-h-[100dvh] pb-24 bg-background text-foreground p-6">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-4xl">PERFIL</h1>
        <Button variant="outline" onClick={logout} className="border-border text-muted-foreground hover:text-white">SAIR</Button>
      </header>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center text-muted-foreground mb-4">
          {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" /> : <User className="w-12 h-12" />}
        </div>
        <h2 className="font-bold text-2xl">{user?.fullName}</h2>
        <p className="text-muted-foreground">{user?.email}</p>
      </div>

      <div className="space-y-6">
        <h3 className="font-display text-2xl text-muted-foreground">MÉTRICAS ATUAIS</h3>
        
        {isLoading ? (
          <div className="bg-card rounded-[32px] p-6 h-32 animate-pulse" />
        ) : assessment ? (
          <div className="bg-card border border-border rounded-[32px] p-6 space-y-6">
            <div className="flex justify-between items-end border-b border-border pb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Somatotipo</div>
                <div className="font-display text-2xl text-primary">{assessment.somatotype || 'N/A'}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Gordura</div>
                <div className="font-display text-2xl">{assessment.bodyFatPct ? `${assessment.bodyFatPct}%` : '--'}</div>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Peso</div>
                <div className="font-display text-2xl">{assessment.weightKg}kg</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Massa Magra</div>
                <div className="font-display text-2xl">{assessment.leanMassKg ? `${assessment.leanMassKg}kg` : '--'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-[32px] p-6 text-center text-muted-foreground">
            Sem avaliação física.
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-t border-border flex items-center justify-around px-6">
        <Link href="/home" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/treinos" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Treino</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Chat</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-primary">
          <span className="text-xs font-medium">Perfil</span>
        </Link>
      </div>
    </div>
  );
}
