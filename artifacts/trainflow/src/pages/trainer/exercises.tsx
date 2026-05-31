import { useListExercises } from "@workspace/api-client-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrainerExercises() {
  const [search, setSearch] = useState("");
  const { data: exercises, isLoading } = useListExercises({ search });

  return (
    <div className="min-h-[100dvh] pb-24 bg-background text-foreground p-6">
      <header className="mb-6">
        <h1 className="font-display text-4xl mb-4">BIBLIOTECA</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Buscar exercício..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 bg-card border-none rounded-2xl pl-12 focus-visible:ring-primary"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 h-16 animate-pulse" />
          ))
        ) : exercises?.length ? (
          exercises.map((ex) => (
            <div key={ex.id} className="bg-card rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                {ex.gifUrl ? <img src={ex.gifUrl} className="w-full h-full object-cover rounded-lg" alt="" /> : <div className="text-muted-foreground text-xs">IMG</div>}
              </div>
              <div className="flex-1">
                <div className="font-bold">{ex.name}</div>
                <div className="text-xs text-muted-foreground">{ex.muscleGroup || 'Geral'}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">Nenhum exercício encontrado</div>
        )}
      </div>

      <Button className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-black shadow-lg shadow-primary/20 p-0">
        <Plus className="w-6 h-6" />
      </Button>

      {/* Bottom Nav Trainer */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-t border-border flex items-center justify-around px-6">
        <a href="/t/dashboard" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Home</span>
        </a>
        <a href="/t/students" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Alunos</span>
        </a>
        <a href="/t/exercises" className="flex flex-col items-center text-primary">
          <span className="text-xs font-medium">Biblioteca</span>
        </a>
      </div>
    </div>
  );
}
