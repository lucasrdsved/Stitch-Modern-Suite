import { useParams, Link } from "wouter";
import { useGetPlan, useAddPlanDay, useAddExerciseToDay, useListExercises } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Plus, Search, X, Dumbbell } from "lucide-react";
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
      <SheetContent side="bottom" className="bg-[#111111] border-[#333333] rounded-t-3xl px-0 pb-0 max-h-[90dvh] flex flex-col text-white">
        <SheetHeader className="px-6 pb-4 border-b border-[#333333] shrink-0">
          <SheetTitle className="font-display text-2xl text-left text-primary tracking-wide">
            {selected ? "CONFIGURAR EXERCÍCIO" : "ADICIONAR EXERCÍCIO"}
          </SheetTitle>
        </SheetHeader>

        {selected ? (
          <div className="px-6 py-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center gap-3 bg-black rounded-2xl p-4 border border-[#333333]">
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
                  <div className="text-xs text-[#888888] uppercase mt-0.5">{selected.muscleGroup}</div>
                )}
              </div>
              <button onClick={() => setSelected(null)} className="ml-auto text-[#888888]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[#888888] uppercase font-bold">Séries</label>
                <Input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="bg-black border-[#333333] h-12 rounded-xl text-center text-lg font-bold focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#888888] uppercase font-bold">Reps</label>
                <Input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="bg-black border-[#333333] h-12 rounded-xl text-center text-lg font-bold focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#888888] uppercase font-bold">Descanso (s)</label>
                <Input
                  type="number"
                  value={rest}
                  onChange={(e) => setRest(e.target.value)}
                  className="bg-black border-[#333333] h-12 rounded-xl text-center text-lg font-bold focus-visible:ring-primary"
                />
              </div>
            </div>

            <Button
              onClick={handleAdd}
              disabled={isPending}
              className="w-full h-14 rounded-full bg-primary text-black font-display text-2xl tracking-wide mt-2 electric-glow"
            >
              {isPending ? "ADICIONANDO..." : "ADICIONAR AO DIA"}
            </Button>
          </div>
        ) : (
          <>
            <div className="px-6 py-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar exercício..."
                  className="pl-10 bg-black border-[#333333] rounded-xl h-11 focus-visible:ring-primary"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 pb-6">
              {exercises.length === 0 ? (
                <div className="text-center py-12 text-[#888888] text-sm">
                  {search ? "Nenhum exercício encontrado" : "Carregando..."}
                </div>
              ) : (
                <div className="divide-y divide-[#333333]">
                  {exercises.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => setSelected(ex)}
                      className="w-full flex items-center gap-4 px-6 py-3 hover:bg-white/5 transition-colors text-left"
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
                          <div className="text-xs text-[#888888] uppercase mt-0.5">{ex.muscleGroup}</div>
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
    return <div className="min-h-[100dvh] flex items-center justify-center bg-black"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  if (!plan) return <div className="p-6 bg-black text-white">Plano não encontrado</div>;

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
          sets,
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
    <div className="min-h-[100dvh] pb-24 bg-black text-white relative overflow-hidden">
      <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(201,242,54,0.10),transparent_60%)]" />
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-4">
          <Link href={`/t/students/${plan.studentId}`} className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity active:scale-95 text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">TRAINFLOW</h1>
        </div>
        <Button className="bg-primary text-black font-display text-xl tracking-wide h-10 rounded-full px-6 electric-glow hover:brightness-110 active:scale-[0.99] transition">
          PUBLICAR
        </Button>
      </header>

      <main className="mt-20 px-6 max-w-2xl mx-auto pt-6 relative">
        <section className="mb-8">
          <div className="flex flex-col gap-1">
            <div className="text-[10px] text-[#888888] uppercase tracking-[0.28em]">Builder Profissional</div>
            <label className="text-[11px] text-[#888888] uppercase tracking-widest mt-4">Nome do Plano</label>
            <div className="font-display text-[38px] leading-none text-white">{plan.name}</div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#888888]">person</span>
            <div className="text-sm text-white/90">Aluno #{plan.studentId}</div>
          </div>
        </section>

        <div
          className="pb-2 pt-1 flex gap-4 overflow-x-auto border-b border-[#333333] sticky top-14 -mx-6 px-6 bg-black/90 backdrop-blur-xl z-40"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {plan.days?.map((day, idx) => (
            <button
              key={day.id}
              onClick={() => setActiveTab(idx)}
              className={`py-3 whitespace-nowrap font-display text-2xl transition-colors border-b-[3px] ${activeTab === idx ? "text-primary border-primary" : "text-[#888888] border-transparent hover:text-white"}`}
            >
              {day.name.toUpperCase()}
            </button>
          ))}
          <button
            onClick={handleAddDay}
            disabled={addDay.isPending}
            className="ml-1 px-4 py-2 text-primary font-bold inline-flex items-center gap-1 shrink-0 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/15 transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> NOVO DIA
          </button>
        </div>

        <div className="py-6 space-y-4">
          {currentDay?.exercises?.length ? (
            currentDay.exercises.map((ex) => (
              <div key={ex.id} className="glass-panel rounded-2xl p-5 overflow-hidden relative">
                <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 bg-primary/10 blur-3xl" />
                <div className="font-display text-2xl mb-4 text-white uppercase tracking-tight">{ex.exerciseName}</div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-xs text-[#888888] mb-1 uppercase tracking-widest">Séries</div>
                    <Input defaultValue={ex.sets || ""} className="bg-black/60 border-[#333333] h-11 rounded-xl text-center font-bold focus-visible:ring-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-[#888888] mb-1 uppercase tracking-widest">Reps</div>
                    <Input defaultValue={ex.reps || ""} className="bg-black/60 border-[#333333] h-11 rounded-xl text-center font-bold focus-visible:ring-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-[#888888] mb-1 uppercase tracking-widest">Descanso</div>
                    <Input defaultValue={ex.restSeconds || ""} className="bg-black/60 border-[#333333] h-11 rounded-xl text-center font-bold focus-visible:ring-primary" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-panel text-center py-12 text-white/70 rounded-2xl">
              <div className="font-display text-2xl text-white/80">NENHUM EXERCÍCIO</div>
              <div className="text-sm text-white/60 mt-1">Adicione exercícios para montar o treino do dia.</div>
            </div>
          )}

          {currentDay && (
            <Button
              onClick={() => setPickerOpen(true)}
              variant="outline"
              className="w-full h-14 border-dashed border-primary/60 text-primary rounded-2xl bg-primary/5 hover:bg-primary/10 hover:border-primary transition"
            >
              <Plus className="w-5 h-5 mr-2" /> Adicionar Exercício
            </Button>
          )}
        </div>
      </main>

      <ExercisePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onAdd={handleAddExercise}
        isPending={addExercise.isPending}
      />
    </div>
  );
}
