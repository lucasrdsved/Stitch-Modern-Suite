import { useParams, Link } from "wouter";
import { useGetPlan, useUpdatePlan, useAddPlanDay, useAddExerciseToDay } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function TrainerPlanDetail() {
  const { id } = useParams();
  const planId = Number(id);
  const { data: plan, isLoading, refetch } = useGetPlan(planId, { query: { enabled: !!planId, queryKey: ['getPlan', planId] } });
  const updatePlan = useUpdatePlan();
  const addDay = useAddPlanDay();
  const [activeTab, setActiveTab] = useState(0);

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-background"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  if (!plan) return <div className="p-6">Plano não encontrado</div>;

  const currentDay = plan.days?.[activeTab];

  const handleAddDay = () => {
    addDay.mutate({ data: { name: `Dia ${String.fromCharCode(65 + (plan.days?.length || 0))}`, dayOrder: (plan.days?.length || 0) + 1 }, planId }, {
      onSuccess: () => refetch()
    });
  };

  return (
    <div className="min-h-[100dvh] pb-24 bg-background text-foreground">
      <header className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/t/students/${plan.studentId}`}>
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-display text-3xl">{plan.name}</h1>
        </div>
        <Button className="bg-primary text-black font-bold h-10 rounded-full px-6">PUBLICAR</Button>
      </header>

      <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-border">
        {plan.days?.map((day, idx) => (
          <button 
            key={day.id} 
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-colors ${activeTab === idx ? 'bg-primary text-black' : 'bg-card text-muted-foreground'}`}
          >
            {day.name.toUpperCase()}
          </button>
        ))}
        <button onClick={handleAddDay} className="px-4 py-2 rounded-full bg-card text-muted-foreground font-bold flex items-center gap-1 shrink-0">
          <Plus className="w-4 h-4" /> NOVO DIA
        </button>
      </div>

      <div className="p-6 space-y-4">
        {currentDay?.exercises?.length ? (
          currentDay.exercises.map((ex) => (
            <div key={ex.id} className="bg-card border border-border rounded-2xl p-4">
              <div className="font-bold mb-3">{ex.exerciseName}</div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Séries</div>
                  <Input defaultValue={ex.sets || ''} className="bg-background h-10 rounded-xl" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Reps</div>
                  <Input defaultValue={ex.reps || ''} className="bg-background h-10 rounded-xl" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Descanso</div>
                  <Input defaultValue={ex.restSeconds || ''} className="bg-background h-10 rounded-xl" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-2xl">
            Nenhum exercício neste dia
          </div>
        )}

        {currentDay && (
          <Button variant="outline" className="w-full h-14 border-dashed border-primary text-primary rounded-2xl">
            <Plus className="w-5 h-5 mr-2" /> Adicionar Exercício
          </Button>
        )}
      </div>
    </div>
  );
}
