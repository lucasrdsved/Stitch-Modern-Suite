import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createPlan, listExercises } from "@/lib/mock-store";

export default function TrainerNewPlan() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const exercises = listExercises();

  const handleAddExercise = (ex: any) => {
    if (selectedExercises.find(e => e.id === ex.id)) return;
    setSelectedExercises([...selectedExercises, { ...ex, sets: 4, reps: "12", rest: 60 }]);
  };

  const handleRemoveExercise = (id: number) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== id));
  };

  const handleSubmit = async () => {
    if (!name || selectedExercises.length === 0) {
      toast({ title: "Erro", description: "Nome e exercícios são obrigatórios.", variant: "destructive" });
      return;
    }
    
    const plan = createPlan({
      name,
      description,
      studentId: 1,
      days: [
        {
          id: 1,
          name: "Dia A",
          exercises: selectedExercises.map((ex, idx) => ({
            id: idx + 1,
            exerciseName: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: ex.rest,
          })),
        },
      ],
    });

    toast({ title: "Sucesso!", description: "Plano de treino criado." });
    setLocation(`/t/plans/${plan.id}`);
  };

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-6 selection:bg-primary selection:text-black">
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <Link href="/t/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-white">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-widest text-3xl mt-1 uppercase">BUILDER</h1>
        </div>
        <Button onClick={handleSubmit} className="bg-primary text-black rounded-full h-10 px-6 font-display text-xl uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">
           SALVAR
        </Button>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-10 max-w-5xl mx-auto w-full">
        {/* Info Section */}
        <section className="flex flex-col gap-6 bg-[#1A1A1A] border border-white/5 rounded-[40px] p-8">
           <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Nome do Plano</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Hipertrofia Avançada A" 
                className="bg-black/40 border border-white/10 rounded-2xl p-4 text-2xl font-display uppercase tracking-tight focus:border-primary/50 outline-none transition-all placeholder:text-[#222]" 
              />
           </div>
           <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Descrição / Observações</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Focar na fase excêntrica..." 
                className="bg-black/40 border border-white/10 rounded-2xl p-4 text-sm min-h-[100px] focus:border-primary/50 outline-none transition-all placeholder:text-[#222]" 
              />
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Library Section */}
           <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-1">
                 <h3 className="text-[11px] text-[#888888] uppercase tracking-[0.3em] font-black">Biblioteca</h3>
                 <span className="text-[10px] text-[#444] font-bold uppercase">{exercises.length} ITENS</span>
              </div>
              <div className="space-y-3">
                 {exercises.map((ex: any) => (
                   <div key={ex.id} className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-white/10 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-[#222]">
                            <span className="material-symbols-outlined text-3xl">fitness_center</span>
                         </div>
                         <div>
                            <p className="text-sm text-white font-bold">{ex.name}</p>
                            <span className="text-[10px] text-[#888888] font-bold uppercase">{ex.muscleGroup}</span>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleAddExercise(ex)}
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#444] hover:text-primary hover:border-primary/50 transition-all"
                      >
                         <span className="material-symbols-outlined">add</span>
                      </button>
                   </div>
                 ))}
              </div>
           </section>

           {/* Selection Section */}
           <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-1">
                 <h3 className="text-[11px] text-[#888888] uppercase tracking-[0.3em] font-black">Selecionados</h3>
                 <span className="text-[10px] text-primary font-bold uppercase">{selectedExercises.length} EXERCÍCIOS</span>
              </div>
              <div className="space-y-4">
                 {selectedExercises.map((ex, idx) => (
                   <div key={ex.id} className="bg-[#1A1A1A] border-l-4 border-primary rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-3">
                            <span className="font-display text-xl text-primary">{(idx + 1).toString().padStart(2, '0')}</span>
                            <h4 className="font-display text-2xl text-white uppercase">{ex.name}</h4>
                         </div>
                         <button onClick={() => handleRemoveExercise(ex.id)} className="text-[#444] hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                         </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                         <div className="bg-black/40 rounded-xl p-2 flex flex-col items-center">
                            <span className="text-[8px] text-[#444] font-black uppercase tracking-widest">Séries</span>
                            <span className="font-display text-xl text-white">{ex.sets}</span>
                         </div>
                         <div className="bg-black/40 rounded-xl p-2 flex flex-col items-center">
                            <span className="text-[8px] text-[#444] font-black uppercase tracking-widest">Reps</span>
                            <span className="font-display text-xl text-white">{ex.reps}</span>
                         </div>
                         <div className="bg-black/40 rounded-xl p-2 flex flex-col items-center">
                            <span className="text-[8px] text-[#444] font-black uppercase tracking-widest">Pausa</span>
                            <span className="font-display text-xl text-white">{ex.rest}s</span>
                         </div>
                      </div>
                   </div>
                 ))}
                 {selectedExercises.length === 0 && (
                   <div className="py-20 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center opacity-20">
                      <span className="material-symbols-outlined text-6xl mb-4">playlist_add</span>
                      <p className="font-display text-xl uppercase">Nenhum exercício selecionado</p>
                   </div>
                 )}
              </div>
           </section>
        </div>
      </main>
    </div>
  );
}
