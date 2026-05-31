import { useGetMyLatestAssessment } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function StudentWelcome() {
  const { data: assessment, isLoading } = useGetMyLatestAssessment();

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-background"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground p-6 flex flex-col justify-center">
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-display text-primary tracking-widest text-xl">AVALIAÇÃO CONCLUÍDA</h1>
          <h2 className="font-display text-4xl">SEU PERFIL FÍSICO</h2>
        </div>

        {assessment ? (
          <div className="bg-card border border-border rounded-[32px] p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">fitness_center</span>
            </div>
            <h3 className="font-display text-3xl text-primary uppercase">{assessment.somatotype || 'N/A'}</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-background rounded-2xl p-4">
                <div className="text-sm text-muted-foreground">Gordura</div>
                <div className="font-display text-2xl">{assessment.bodyFatPct ? `${assessment.bodyFatPct}%` : '--'}</div>
              </div>
              <div className="bg-background rounded-2xl p-4">
                <div className="text-sm text-muted-foreground">Massa Magra</div>
                <div className="font-display text-2xl">{assessment.leanMassKg ? `${assessment.leanMassKg}kg` : '--'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            Nenhuma avaliação encontrada.
          </div>
        )}

        <Button asChild className="w-full h-14 rounded-full bg-primary text-black font-bold text-lg hover:bg-primary/90">
          <Link href="/home">ENTENDER MEU TREINO</Link>
        </Button>
      </div>
    </div>
  );
}
