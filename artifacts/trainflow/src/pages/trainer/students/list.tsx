import { useState } from "react";
import { useListStudents } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, User } from "lucide-react";

export default function TrainerStudentList() {
  const [search, setSearch] = useState("");
  const { data: students, isLoading } = useListStudents({ search });

  return (
    <div className="min-h-[100dvh] pb-24 bg-background text-foreground p-6">
      <header className="mb-6">
        <h1 className="font-display text-4xl mb-4">ALUNOS</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Buscar aluno..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 bg-card border-none rounded-2xl pl-12 focus-visible:ring-primary"
          />
        </div>
      </header>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 h-20 animate-pulse" />
          ))
        ) : students?.length ? (
          students.map((student) => (
            <Link key={student.id} href={`/t/students/${student.id}`}>
              <div className="bg-card rounded-2xl p-4 flex items-center justify-between hover:bg-card/80 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-muted-foreground">
                    {student.avatarUrl ? <img src={student.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" /> : <User className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="font-bold">{student.fullName}</div>
                    <div className="text-sm text-muted-foreground">{student.email}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs px-2 py-1 rounded-full ${student.status === 'active' ? 'bg-primary/20 text-primary' : student.status === 'invited' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'}`}>
                    {student.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">Nenhum aluno encontrado</div>
        )}
      </div>

      <Link href="/t/assessments/new">
        <Button className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-black shadow-lg shadow-primary/20 p-0">
          <Plus className="w-6 h-6" />
        </Button>
      </Link>

      <div className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-t border-border flex items-center justify-around px-6">
        <Link href="/t/dashboard" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/t/students" className="flex flex-col items-center text-primary">
          <span className="text-xs font-medium">Alunos</span>
        </Link>
        <Link href="/t/exercises" className="flex flex-col items-center text-muted-foreground">
          <span className="text-xs font-medium">Biblioteca</span>
        </Link>
      </div>
    </div>
  );
}
