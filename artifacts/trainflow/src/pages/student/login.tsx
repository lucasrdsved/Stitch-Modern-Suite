import { useState } from "react";
import { useStudentMagicLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function StudentLogin() {
  const [token, setToken] = useState("");
  const login = useStudentMagicLogin();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedToken = token.trim();
    if (!trimmedToken) return;

    login.mutate({ data: { token: trimmedToken } }, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["auth/me"] });
        if (data.isFirstLogin) {
          setLocation("/welcome");
        } else {
          setLocation("/home");
        }
      },
      onError: () => {
        toast({ title: "Token inválido", description: "Verifique o código enviado pelo seu personal.", variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between p-6 bg-black text-foreground relative z-10" data-testid="page-student-login">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-black"></div>
      
      {/* Top: Logo Anchor */}
      <header className="w-full max-w-md pt-8 flex justify-center md:justify-start">
        <h1 className="font-display text-primary tracking-widest text-2xl" data-testid="text-logo">TRAINFLOW</h1>
      </header>

      {/* Center: Primary Interaction Canvas */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center animate-in fade-in duration-700">
        <div className="mb-10 text-center md:text-left">
          <h2 className="font-display text-[64px] leading-none text-primary mb-2 drop-shadow-[0_0_15px_rgba(201,242,54,0.15)]" data-testid="text-heading">
            BEM-VINDO
          </h2>
          <p className="text-muted-foreground text-base">Insira o código de acesso enviado pelo seu personal.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative group">
            <Input
              type="text"
              placeholder="Código de acesso"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full h-14 bg-[#121212] border border-[#222222] rounded-xl px-4 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 group-hover:border-[#333333] font-mono"
              data-testid="input-token"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-primary text-black font-display text-2xl rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all duration-200 mt-4 electric-glow tracking-wide"
            disabled={login.isPending}
            data-testid="button-submit"
          >
            {login.isPending ? "VERIFICANDO..." : "ENTRAR"}
            {!login.isPending && <span className="material-symbols-outlined text-[28px]">arrow_forward</span>}
          </Button>
        </form>
      </main>

      {/* Footer: Secondary Action */}
      <footer className="w-full max-w-md pb-8 flex justify-center">
        <Link href="/t/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 inline-block py-2 px-4 rounded-full hover:bg-[#121212]" data-testid="link-trainer-login">
          Sou Personal Trainer
        </Link>
      </footer>
    </div>
  );
}
