import { useState } from "react";
import { useLocation } from "wouter";
import { useCreatePlan } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function TrainerNewPlan() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createPlan = useCreatePlan();

  const searchParams = new URLSearchParams(window.location.search);
  const studentId = Number(searchParams.get("studentId"));

  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      toast({ title: "Erro", description: "Aluno não identificado.", variant: "destructive" });
      return;
    }

    createPlan.mutate(
      { data: { name, studentId } },
      {
        onSuccess: (plan) => {
          setLocation(`/t/plans/${plan.id}`);
        },
        onError: () => {
          toast({ title: "Erro", description: "Falha ao criar plano.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="p-6 pb-4 border-b border-border flex items-center gap-4">
        <Link href={studentId ? `/t/students/${studentId}` : "/t/students"}>
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="font-display text-3xl">NOVO PLANO</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground uppercase">Nome do Plano</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Hipertrofia A/B"
            required
            className="bg-card border-border h-14 rounded-2xl text-base"
          />
        </div>

        <Button
          type="submit"
          disabled={createPlan.isPending || !name.trim()}
          className="w-full h-14 rounded-full bg-primary text-black font-bold text-lg"
        >
          {createPlan.isPending ? "CRIANDO..." : "CRIAR PLANO"}
        </Button>
      </form>
    </div>
  );
}
