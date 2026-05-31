import { useState } from "react";
import { useCreateAssessment } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function TrainerNewAssessment() {
  const createAssessment = useCreateAssessment();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    sex: "M" as "M"|"F",
    birthDate: "",
    weightKg: "",
    heightCm: "",
    skinfoldChest: "",
    skinfoldAbdomen: "",
    skinfoldThigh: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createAssessment.mutate({
      data: {
        fullName: formData.fullName,
        email: formData.email,
        sex: formData.sex,
        birthDate: formData.birthDate,
        weightKg: Number(formData.weightKg),
        heightCm: Number(formData.heightCm),
        skinfoldChest: formData.skinfoldChest ? Number(formData.skinfoldChest) : null,
        skinfoldAbdomen: formData.skinfoldAbdomen ? Number(formData.skinfoldAbdomen) : null,
        skinfoldThigh: formData.skinfoldThigh ? Number(formData.skinfoldThigh) : null,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Sucesso", description: "Avaliação salva com sucesso!" });
        setLocation("/t/students");
      },
      onError: () => {
        toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-[100dvh] pb-24 bg-background text-foreground">
      <header className="p-6 pb-4 border-b border-border">
        <h1 className="font-display text-3xl">NOVA AVALIAÇÃO</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <section className="space-y-4">
          <h2 className="font-bold text-muted-foreground uppercase text-sm">Dados Básicos</h2>
          <Input name="fullName" placeholder="Nome Completo" value={formData.fullName} onChange={handleChange} required className="bg-card border-border" />
          <Input name="email" type="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required className="bg-card border-border" />
          <div className="flex gap-4">
            <select name="sex" value={formData.sex} onChange={handleChange} className="flex-1 bg-card border-border rounded-xl px-4 py-2" required>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
            <Input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required className="flex-1 bg-card border-border" />
          </div>
          <div className="flex gap-4">
            <Input name="weightKg" type="number" step="0.1" placeholder="Peso (kg)" value={formData.weightKg} onChange={handleChange} required className="flex-1 bg-card border-border" />
            <Input name="heightCm" type="number" placeholder="Altura (cm)" value={formData.heightCm} onChange={handleChange} required className="flex-1 bg-card border-border" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-bold text-muted-foreground uppercase text-sm">Dobras Cutâneas (opcional)</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input name="skinfoldChest" type="number" step="0.1" placeholder="Peitoral (mm)" value={formData.skinfoldChest} onChange={handleChange} className="bg-card border-border" />
            <Input name="skinfoldAbdomen" type="number" step="0.1" placeholder="Abdômen (mm)" value={formData.skinfoldAbdomen} onChange={handleChange} className="bg-card border-border" />
            <Input name="skinfoldThigh" type="number" step="0.1" placeholder="Coxa (mm)" value={formData.skinfoldThigh} onChange={handleChange} className="bg-card border-border" />
          </div>
        </section>

        <Button 
          type="submit" 
          className="w-full h-14 rounded-full bg-primary text-black font-bold text-lg mt-8"
          disabled={createAssessment.isPending}
        >
          {createAssessment.isPending ? "SALVANDO..." : "SALVAR E ENVIAR CONVITE"}
        </Button>
      </form>
    </div>
  );
}
