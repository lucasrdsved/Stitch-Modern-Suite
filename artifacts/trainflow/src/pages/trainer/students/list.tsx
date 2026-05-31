import { useListStudents } from "@workspace/api-client-react";
import { Link } from "wouter";
import { TrainerBottomNav } from "@/components/trainer-bottom-nav";
import { MOCK_STUDENTS } from "@/lib/mock-data";

export default function TrainerStudentList() {
  const { data: studentsResponse, isLoading, isError } = useListStudents();
  const students = studentsResponse || (isError || !studentsResponse ? MOCK_STUDENTS : undefined);

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <Link href="/t/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity active:scale-95 text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">ALUNOS</h1>
        </div>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center mb-2">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-white text-[32px] uppercase tracking-wider leading-none">MEUS ALUNOS</h2>
            <p className="text-[#888888] text-base">Gerencie seus atletas.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-[#1A1A1A] rounded-2xl border border-[#333333]" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {students?.length ? (
              students.map((student) => (
                <Link key={student.id} href={`/t/students/${student.id}`}>
                  <div className="bg-[#1A1A1A]/60 backdrop-blur-xl border border-[#333333] p-4 rounded-xl flex items-center gap-4 hover:border-primary transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-[#222222] flex items-center justify-center border border-primary/20 shrink-0 overflow-hidden">
                      {student.avatarUrl ? (
                        <img src={student.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[#888888]">person</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-white truncate">{student.fullName}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${student.status === 'active' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                          {student.status === 'active' ? 'Ativo' : 'Pendente'}
                        </span>
                      </div>
                      <p className="text-sm text-[#888888] truncate">{student.email}</p>
                    </div>
                    <span className="material-symbols-outlined text-[#888888] group-hover:text-primary transition-colors">arrow_forward_ios</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 text-[#888888] bg-[#1A1A1A]/60 border border-[#333333] rounded-xl">
                <span className="material-symbols-outlined text-4xl mb-2">group_off</span>
                <p>Nenhum aluno ativo.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <TrainerBottomNav />
    </div>
  );
}
