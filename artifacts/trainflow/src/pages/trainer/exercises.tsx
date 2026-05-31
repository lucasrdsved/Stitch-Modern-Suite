import { useListExercises } from "@workspace/api-client-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TrainerBottomNav } from "@/components/trainer-bottom-nav";

export default function TrainerExercises() {
  const [search, setSearch] = useState("");
  const { data: exercises, isLoading } = useListExercises({ search });

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <Link href="/t/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity active:scale-95 text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">BIBLIOTECA</h1>
        </div>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <section className="flex flex-col gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] group-focus-within:text-primary transition-colors">search</span>
            <Input
              placeholder="Buscar exercício..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 bg-[#1A1A1A] border border-[#333333] rounded-2xl pl-12 focus-visible:ring-primary focus-visible:border-primary transition-all placeholder:text-[#444444]"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#1A1A1A] rounded-2xl p-4 h-20 border border-[#333333] animate-pulse" />
            ))
          ) : exercises?.length ? (
            exercises.map((ex) => (
              <div key={ex.id} className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-[#333333] p-4 rounded-xl flex items-center gap-4 hover:border-primary transition-colors group">
                <div className="w-14 h-14 bg-[#222222] rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-[#333333]">
                  {ex.gifUrl ? (
                    <img src={ex.gifUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span className="material-symbols-outlined text-[#444444] text-3xl">fitness_center</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white truncate">{ex.name}</div>
                  <div className="text-xs text-primary font-medium uppercase tracking-wider mt-0.5">{ex.muscleGroup || "Geral"}</div>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-[#888888] text-xl">info</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-[#888888] bg-[#1A1A1A]/40 border border-dashed border-[#333333] rounded-2xl">
              <span className="material-symbols-outlined text-5xl mb-3 block opacity-20">search_off</span>
              <p className="text-sm">Nenhum exercício encontrado para "{search}"</p>
            </div>
          )}
        </div>
      </main>

      <Button className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-black shadow-2xl shadow-primary/40 p-0 electric-glow active:scale-90 transition-transform z-50">
        <span className="material-symbols-outlined text-3xl">add</span>
      </Button>

      <TrainerBottomNav />
    </div>
  );
}
