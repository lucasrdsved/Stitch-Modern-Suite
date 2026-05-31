import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-6 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="font-display text-[120px] leading-none text-primary animate-in fade-in zoom-in duration-500">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="font-display text-4xl uppercase tracking-tight">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground text-lg">
            Ops! O conteúdo que você está procurando não existe ou foi movido para outro lugar.
          </p>
        </div>

        <Button asChild className="mt-8 h-14 px-8 rounded-full bg-primary text-black font-bold text-lg hover:scale-105 transition-transform">
          <Link href="/">
            <MoveLeft className="mr-2 h-5 w-5" />
            VOLTAR PARA O INÍCIO
          </Link>
        </Button>
      </div>
      
      {/* Decorative element matching the project's high-performance vibe */}
      <div className="fixed -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="fixed -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
    </div>
  );
}
