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
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center space-y-2">
          <h1 className="font-display text-primary tracking-widest text-3xl">TRAINFLOW</h1>
          <h2 className="font-display text-4xl mt-4">NOVA CONTA PERSONAL</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Nome Completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-14 bg-card border-none rounded-2xl px-6 focus-visible:ring-primary"
            required
          />
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 bg-card border-none rounded-2xl px-6 focus-visible:ring-primary"
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 bg-card border-none rounded-2xl px-6 focus-visible:ring-primary"
            required
          />
          
          <Button 
            type="submit" 
            className="w-full h-14 rounded-full bg-primary text-black font-bold text-lg mt-4 hover:bg-primary/90"
            disabled={register.isPending}
          >
            {register.isPending ? "CRIANDO..." : "CRIAR CONTA"}
          </Button>
        </form>

        <div className="text-center pt-4">
          <Link href="/t/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Já tenho uma conta
          </Link>
        </div>
      </div>
    </div>
  );
}
