import { useState } from "react";
import { useLocation } from "wouter";
import { useCreatePlan } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="min-h-[100dvh] bg-black text-white pb-24">
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <Link href={studentId ? `/t/students/${studentId}` : "/t/students"} className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity active:scale-95 text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">TRAINFLOW</h1>
        </div>
        <div className="w-10" />
      </header>

      <form onSubmit={handleSubmit} className="mt-20 px-6 max-w-2xl mx-auto">
        <section className="mb-8 mt-6">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#888888] uppercase tracking-widest">Nome do Plano</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do Treino..."
              required
              className="bg-transparent border-none px-0 font-display text-[32px] leading-none text-white placeholder:text-white/30 focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="material-symbols-outlined text-[18px] text-[#888888]">person</span>
            <div className="text-sm text-white">{studentId ? `Aluno #${studentId}` : "Aluno nao identificado"}</div>
          </div>
        </section>

        <section className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary">tips_and_updates</span>
            <h2 className="font-display text-2xl uppercase">Builder Inicial</h2>
          </div>
          <p className="text-sm text-[#888888] leading-6">
            Crie a identidade do plano agora. Depois da criacao, voce entra no editor completo para adicionar dias,
            exercicios, series, repeticoes e descanso.
          </p>
        </section>

        <Button
          type="submit"
          disabled={createPlan.isPending || !name.trim()}
          className="w-full h-14 rounded-full bg-primary text-black font-display text-2xl tracking-wide electric-glow hover:bg-primary/90"
        >
          {createPlan.isPending ? "CRIANDO..." : "CRIAR PLANO"}
        </Button>
      </form>
    </div>
  );
}
