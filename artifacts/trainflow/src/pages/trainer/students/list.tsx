import { useMemo, useState } from "react";
import { Link } from "wouter";
import { listStudents } from "@/lib/mock-store";

export default function TrainerStudentList() {
  const [search, setSearch] = useState("");
  const students = listStudents();
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s: any) => {
      const name = String(s.fullName || "").toLowerCase();
      const email = String(s.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [students, search]);

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-6 selection:bg-primary selection:text-black">
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <Link href="/t/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-white">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-widest text-3xl mt-1 uppercase">ALUNOS</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-black shadow-lg electric-glow">
          <span className="material-symbols-outlined font-bold">person_add</span>
        </button>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <div className="relative group">
           <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#888888] group-focus-within:text-primary transition-colors">search</span>
           <input 
             placeholder="Buscar aluno por nome ou e-mail..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-[#444]"
           />
        </div>

        <div className="flex items-center gap-2 px-1">
           <span className="text-[10px] text-[#888888] uppercase font-black tracking-[0.3em]">{filtered.length} Alunos na Base</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((student: any) => (
            <Link key={student.id} href={`/t/students/${student.id}`}>
              <div className="bg-[#1A1A1A] border border-white/5 rounded-[32px] p-5 flex items-center gap-5 cursor-pointer hover:border-primary/30 transition-all group active:scale-[0.98]">
                <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary/50 transition-colors">
                  {student.avatarUrl ? (
                    <img src={student.avatarUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={student.fullName} />
                  ) : (
                    <span className="material-symbols-outlined text-white/20 text-4xl">person</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-2xl text-white uppercase leading-none mb-1 group-hover:text-primary transition-colors">{student.fullName}</h3>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${
                      student.status === 'active' 
                        ? 'bg-primary/10 text-primary border-primary/20' 
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}>
                      {student.status === 'active' ? 'Ativo' : 'Pendente'}
                    </span>
                    <span className="text-[10px] text-[#888888] font-bold uppercase truncate">{student.email}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-white/10 group-hover:text-primary transition-colors">chevron_right</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
