import { useParams, Link } from "wouter";
import { useGetPlan, useUpdatePlan, useAddPlanDay, useAddExerciseToDay, useListExercises } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Search, X, Dumbbell } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Exercise = {
  id: number;
  name: string;
  muscleGroup?: string | null;
  gifUrl?: string | null;
};

function ExercisePicker({
  open,
  onClose,
  onAdd,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (exerciseId: number, sets: number, reps: number, restSeconds: number) => void;
  isPending: boolean;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("12");
  const [rest, setRest] = useState("60");

  const { data: exercises = [] } = useListExercises(
    { search: search || undefined },
    { query: { enabled: open, queryKey: ["exercises", search] } }
  );

  const handleClose = () => {
    setSearch("");
    setSelected(null);
    onClose();
  };

  const handleAdd = () => {
    if (!selected) return;
    onAdd(selected.id, Number(sets), Number(reps), Number(rest));
    setSearch("");
    setSelected(null);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && handleClose()}>
      <SheetContent side="bottom" className="bg-card border-border rounded-t-3xl px-0 pb-0 max-h-[90dvh] flex flex-col">
        <SheetHeader className="px-6 pb-4 border-b border-border shrink-0">
          <SheetTitle className="font-display text-2xl text-left">
            {selected ? "CONFIGURAR EXERCÍCIO" : "ADICIONAR EXERCÍCIO"}
          </SheetTitle>
        </SheetHeader>

        {selected ? (
          <div className="px-6 py-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center gap-3 bg-background rounded-2xl p-4">
              {selected.gifUrl ? (
                <img src={selected.gifUrl} alt="" className="w-14 h-14 rounded-xl object-cover bg-muted" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <div className="font-bold">{selected.name}</div>
                {selected.muscleGroup && (
                  <div className="text-xs text-muted-foreground uppercase mt-0.5">{selected.muscleGroup}</div>
                )}
              </div>
              <button onClick={() => setSelected(null)} className="ml-auto text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase font-bold">Séries</label>
                <Input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="bg-background border-border h-12 rounded-xl text-center text-lg font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase font-bold">Reps</label>
                <Input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="bg-background border-border h-12 rounded-xl text-center text-lg font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase font-bold">Descanso (s)</label>
                <Input
                  type="number"
                  value={rest}
                  onChange={(e) => setRest(e.target.value)}
                  className="bg-background border-border h-12 rounded-xl text-center text-lg font-bold"
                />
              </div>
            </div>

            <Button
              onClick={handleAdd}
              disabled={isPending}
              className="w-full h-14 rounded-full bg-primary text-black font-bold text-lg mt-2"
            >
              {isPending ? "ADICIONANDO..." : "ADICIONAR AO DIA"}
            </Button>
          </div>
        ) : (
          <>
            <div className="px-6 py-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar exercício..."
                  className="pl-10 bg-background border-border rounded-xl h-11"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 pb-6">
              {exercises.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  {search ? "Nenhum exercício encontrado" : "Carregando..."}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {exercises.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => setSelected(ex)}
                      className="w-full flex items-center gap-4 px-6 py-3 hover:bg-background/60 transition-colors text-left"
                    >
                      {ex.gifUrl ? (
                        <img src={ex.gifUrl} alt="" className="w-12 h-12 rounded-xl object-cover bg-muted shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <Dumbbell className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{ex.name}</div>
                        {ex.muscleGroup && (
                          <div className="text-xs text-muted-foreground uppercase mt-0.5">{ex.muscleGroup}</div>
                        )}
                      </div>
                      <Plus className="w-5 h-5 text-primary ml-auto shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default function TrainerPlanDetail() {
  const { id } = useParams();
  const planId = Number(id);
  const { data: plan, isLoading, refetch } = useGetPlan(planId, { query: { enabled: !!planId, queryKey: ["getPlan", planId] } });
  const addDay = useAddPlanDay();
  const addExercise = useAddExerciseToDay();
  const [activeTab, setActiveTab] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-background"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  if (!plan) return <div className="p-6">Plano não encontrado</div>;

  const currentDay = plan.days?.[activeTab];

  const handleAddDay = () => {
    addDay.mutate(
      { data: { name: `Dia ${String.fromCharCode(65 + (plan.days?.length || 0))}`, dayOrder: (plan.days?.length || 0) + 1 }, planId },
      { onSuccess: () => refetch() }
    );
  };

  const handleAddExercise = (exerciseId: number, sets: number, reps: number, restSeconds: number) => {
    if (!currentDay) return;
    addExercise.mutate(
      {
        planId,
        dayId: currentDay.id,
        data: {
          exerciseId,
          sets: String(sets),
          reps: String(reps),
          restSeconds,
          exerciseOrder: (currentDay.exercises?.length || 0) + 1,
        },
      },
      {
        onSuccess: () => {
          refetch();
          setPickerOpen(false);
        },
      }
    );
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
            className={`px-6 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-colors ${activeTab === idx ? "bg-primary text-black" : "bg-card text-muted-foreground"}`}
          >
            {day.name.toUpperCase()}
          </button>
        ))}
        <button
          onClick={handleAddDay}
          disabled={addDay.isPending}
          className="px-4 py-2 rounded-full bg-card text-muted-foreground font-bold flex items-center gap-1 shrink-0"
        >
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
                  <Input defaultValue={ex.sets || ""} className="bg-background h-10 rounded-xl" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Reps</div>
                  <Input defaultValue={ex.reps || ""} className="bg-background h-10 rounded-xl" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Descanso</div>
                  <Input defaultValue={ex.restSeconds || ""} className="bg-background h-10 rounded-xl" />
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
          <Button
            onClick={() => setPickerOpen(true)}
            variant="outline"
            className="w-full h-14 border-dashed border-primary text-primary rounded-2xl"
          >
            <Plus className="w-5 h-5 mr-2" /> Adicionar Exercício
          </Button>
        )}
      </div>

      <ExercisePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onAdd={handleAddExercise}
        isPending={addExercise.isPending}
      />
    </div>
  );
}
