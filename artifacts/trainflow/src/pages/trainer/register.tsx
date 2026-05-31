import { useState } from "react";
import { useTrainerRegister } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function TrainerRegister() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const register = useTrainerRegister();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;

    register.mutate({ data: { fullName, email, password } }, {
      onSuccess: () => {
        setLocation("/t/dashboard");
      },
      onError: () => {
        toast({ title: "Erro", description: "Não foi possível criar a conta.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between p-6 bg-black text-foreground relative z-10">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-black"></div>
      
      {/* Top: Logo Anchor */}
      <header className="w-full max-w-md pt-8 flex justify-center md:justify-start">
        <h1 className="font-display text-primary tracking-widest text-2xl">TRAINFLOW</h1>
      </header>

      {/* Center: Primary Interaction Canvas */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center animate-in fade-in duration-700">
        <div className="mb-10 text-center md:text-left">
          <h2 className="font-display text-[64px] leading-none text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
            NOVA CONTA
          </h2>
          <p className="text-muted-foreground text-base">Comece a gerenciar seus alunos com alta performance.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative group">
            <Input
              placeholder="Nome Completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-14 bg-[#121212] border border-[#222222] rounded-xl px-4 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 group-hover:border-[#333333]"
              required
            />
          </div>

          <div className="relative group">
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-[#121212] border border-[#222222] rounded-xl px-4 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 group-hover:border-[#333333]"
              required
            />
          </div>
          
          <div className="relative group">
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-[#121212] border border-[#222222] rounded-xl px-4 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 group-hover:border-[#333333]"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-primary text-black font-display text-2xl rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all duration-200 mt-4 electric-glow tracking-wide"
            disabled={register.isPending}
          >
            {register.isPending ? "CRIANDO..." : "CRIAR CONTA"}
            {!register.isPending && <span className="material-symbols-outlined text-[28px]">arrow_forward</span>}
          </Button>
        </form>
      </main>

      {/* Footer: Secondary Action */}
      <footer className="w-full max-w-md pb-8 flex justify-center">
        <Link href="/t/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 inline-block py-2 px-4 rounded-full hover:bg-[#121212]">
          Já tenho uma conta
        </Link>
      </footer>
    </div>
  );
}
