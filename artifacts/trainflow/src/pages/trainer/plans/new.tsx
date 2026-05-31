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
    <div className="min-h-[100dvh] bg-black text-white pb-24 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(201,242,54,0.10),transparent_60%)]" />
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <Link href={studentId ? `/t/students/${studentId}` : "/t/students"} className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity active:scale-95 text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">TRAINFLOW</h1>
        </div>
        <div className="w-10" />
      </header>

      <form onSubmit={handleSubmit} className="mt-20 px-6 max-w-2xl mx-auto pt-6 relative">
        <section className="mb-10">
          <div className="flex flex-col gap-1">
            <div className="text-[10px] text-[#888888] uppercase tracking-[0.28em]">Builder Profissional</div>
            <label className="text-[11px] text-[#888888] uppercase tracking-widest mt-4">Nome do Plano</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do Treino..."
              required
              className="h-auto bg-transparent border-0 border-b border-[#333333] rounded-none px-0 py-2 font-display text-[38px] leading-none text-white shadow-none placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#888888]">person</span>
            <div className="text-sm text-white/90">{studentId ? `Aluno #${studentId}` : "Aluno não identificado"}</div>
          </div>
        </section>

        <section className="glass-panel rounded-2xl p-6 mb-10 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -right-12 h-40 w-40 bg-primary/10 blur-3xl" />
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary">tips_and_updates</span>
            <h2 className="font-display text-2xl uppercase">Builder Inicial</h2>
          </div>
          <p className="text-sm text-white/75 leading-6">
            Crie a identidade do plano agora. Depois da criação, você entra no editor completo para adicionar dias,
            exercícios, séries, repetições e descanso.
          </p>
        </section>

        <Button
          type="submit"
          disabled={createPlan.isPending || !name.trim()}
          className="w-full h-14 rounded-full bg-primary text-black font-display text-2xl tracking-wide electric-glow hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 disabled:shadow-none"
        >
          {createPlan.isPending ? "CRIANDO..." : "CRIAR PLANO"}
        </Button>
      </form>
    </div>
  );
}
