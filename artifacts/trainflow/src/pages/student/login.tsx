import { useState } from "react";
import { useStudentMagicLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function StudentLogin() {
  const [token, setToken] = useState("");
  const login = useStudentMagicLogin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedToken = token.trim();
    if (!trimmedToken) return;

    login.mutate({ data: { token: trimmedToken } }, {
      onSuccess: (data) => {
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
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-background text-foreground" data-testid="page-student-login">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-2">
          <h1 className="font-display text-primary tracking-widest text-4xl" data-testid="text-logo">TRAINFLOW</h1>
          <h2 className="font-display text-5xl mt-8" data-testid="text-heading">BEM-VINDO</h2>
          <p className="text-muted-foreground text-sm">Insira o código de acesso enviado pelo seu personal trainer.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            placeholder="Código de acesso"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="h-14 bg-card border-none rounded-2xl px-6 focus-visible:ring-primary font-mono text-sm"
            data-testid="input-token"
            required
          />

          <Button
            type="submit"
            className="w-full h-14 rounded-full bg-primary text-black font-bold text-lg hover:bg-primary/90"
            disabled={login.isPending}
            data-testid="button-submit"
          >
            {login.isPending ? "VERIFICANDO..." : "ENTRAR →"}
          </Button>
        </form>

        <div className="text-center pt-8">
          <Link href="/t/login" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-trainer-login">
            Sou Personal Trainer
          </Link>
        </div>
      </div>
    </div>
  );
}
