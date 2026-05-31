import { useState } from "react";
import { useCreateAssessment } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
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

  const numericSkinfolds = [
    Number(formData.skinfoldChest || 0),
    Number(formData.skinfoldAbdomen || 0),
    Number(formData.skinfoldThigh || 0),
  ];
  const sumSkinfolds = numericSkinfolds.reduce((sum, value) => sum + value, 0);
  const weight = Number(formData.weightKg || 0);
  const heightMeters = Number(formData.heightCm || 0) / 100;
  const bmi =
    weight > 0 && heightMeters > 0
      ? (weight / (heightMeters * heightMeters)).toFixed(1)
      : "--";
  const bodyFatPreview = sumSkinfolds > 0 ? `${(sumSkinfolds * 0.15 + 5).toFixed(1)}%` : "--%";
  const somatotypePreview =
    sumSkinfolds === 0 ? "---" : sumSkinfolds < 50 ? "ECTOMORFO" : sumSkinfolds < 100 ? "MESOMORFO" : "ENDOMORFO";

  return (
    <div className="min-h-[100dvh] bg-black text-white pb-28">
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-[#333333] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <Link href="/t/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity active:scale-95 text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-tighter text-3xl leading-none mt-1">TRAINFLOW</h1>
        </div>
        <span className="material-symbols-outlined text-[#888888]">notifications</span>
      </header>

      <main className="mt-20 px-6 max-w-2xl mx-auto space-y-8">
        <section className="pt-6">
          <h2 className="font-display text-[56px] leading-none text-primary uppercase italic">Nova Avaliacao Fisica</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <p className="text-[#888888] text-xs tracking-wider uppercase">Protocolo Pollock 7 Dobras</p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-[#111111] border border-[#333333] rounded-2xl p-6">
            <div className="flex items-center gap-3 border-b border-[#333333]/40 pb-4 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">badge</span>
              <h3 className="font-display text-2xl uppercase tracking-tight">Identificacao</h3>
            </div>
            <div className="space-y-4">
              <Input
                name="fullName"
                placeholder="Nome Completo"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="h-14 bg-black border-[#333333] rounded-xl focus-visible:ring-primary"
              />
              <Input
                name="email"
                type="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-14 bg-black border-[#333333] rounded-xl focus-visible:ring-primary"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="h-14 bg-black border border-[#333333] rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
                <Input
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="h-14 bg-black border-[#333333] rounded-xl focus-visible:ring-primary"
                />
              </div>
            </div>
          </section>

          <section className="bg-[#111111] border border-[#333333] rounded-2xl p-6">
            <div className="flex items-center gap-3 border-b border-[#333333]/40 pb-4 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">straighten</span>
              <h3 className="font-display text-2xl uppercase tracking-tight">Biometria Basica</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 p-4 bg-black rounded-xl border border-[#333333]">
                <label className="text-xs text-[#888888] uppercase text-center">Peso Corporal (kg)</label>
                <Input
                  name="weightKg"
                  type="number"
                  step="0.1"
                  placeholder="00.0"
                  value={formData.weightKg}
                  onChange={handleChange}
                  required
                  className="bg-transparent border-none p-0 text-center font-display text-[48px] leading-none text-primary focus-visible:ring-0"
                />
              </div>
              <div className="flex flex-col gap-2 p-4 bg-black rounded-xl border border-[#333333]">
                <label className="text-xs text-[#888888] uppercase text-center">Estatura (cm)</label>
                <Input
                  name="heightCm"
                  type="number"
                  placeholder="000"
                  value={formData.heightCm}
                  onChange={handleChange}
                  required
                  className="bg-transparent border-none p-0 text-center font-display text-[48px] leading-none text-primary focus-visible:ring-0"
                />
              </div>
            </div>
          </section>

          <section className="bg-[#111111] border border-[#333333] rounded-2xl p-6">
            <div className="flex items-center gap-3 border-b border-[#333333]/40 pb-4 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">architecture</span>
              <h3 className="font-display text-2xl uppercase tracking-tight">Dobras Cutaneas (mm)</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center justify-between bg-black p-4 rounded-xl border border-[#333333]">
                <span className="text-sm uppercase text-[#888888]">Peitoral</span>
                <Input
                  name="skinfoldChest"
                  type="number"
                  step="0.1"
                  value={formData.skinfoldChest}
                  onChange={handleChange}
                  className="w-20 h-10 bg-[#111111] border-none rounded-lg text-right font-display text-xl text-primary focus-visible:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between bg-black p-4 rounded-xl border border-[#333333]">
                <span className="text-sm uppercase text-[#888888]">Abdomen</span>
                <Input
                  name="skinfoldAbdomen"
                  type="number"
                  step="0.1"
                  value={formData.skinfoldAbdomen}
                  onChange={handleChange}
                  className="w-20 h-10 bg-[#111111] border-none rounded-lg text-right font-display text-xl text-primary focus-visible:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between bg-black p-4 rounded-xl border border-[#333333]">
                <span className="text-sm uppercase text-[#888888]">Coxa</span>
                <Input
                  name="skinfoldThigh"
                  type="number"
                  step="0.1"
                  value={formData.skinfoldThigh}
                  onChange={handleChange}
                  className="w-20 h-10 bg-[#111111] border-none rounded-lg text-right font-display text-xl text-primary focus-visible:ring-primary"
                />
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-black border-2 border-primary rounded-3xl p-8 shadow-[0_0_40px_rgba(201,242,54,0.15)]">
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h3 className="font-display text-4xl uppercase italic text-primary">Preview Analitico</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary/60">Processamento em Tempo Real</p>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  <span className="text-primary text-xs uppercase">Live Data</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 divide-x divide-[#333333]">
                <div className="flex flex-col items-center">
                  <span className="text-xs uppercase text-[#888888] mb-1">IMC</span>
                  <span className="font-display text-5xl text-primary">{bmi}</span>
                </div>
                <div className="flex flex-col items-center px-4">
                  <span className="text-xs uppercase text-[#888888] mb-1">% Gordura</span>
                  <span className="font-display text-5xl text-primary">{bodyFatPreview}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs uppercase text-[#888888] mb-1">Somatotipo</span>
                  <span className="font-display text-2xl uppercase mt-2 text-white">{somatotypePreview}</span>
                </div>
              </div>
            </div>
          </section>

          <div className="pt-2 flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full h-16 bg-primary text-black font-display text-2xl rounded-full shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:bg-primary/90 active:scale-95 transition-all electric-glow"
              disabled={createAssessment.isPending}
            >
              {createAssessment.isPending ? "SALVANDO..." : "SALVAR E ENVIAR CONVITE"}
              {!createAssessment.isPending && <span className="material-symbols-outlined">send</span>}
            </Button>
            <Link
              href="/t/dashboard"
              className="w-full h-12 border border-[#333333] text-[#888888] rounded-full hover:bg-white/5 transition-colors uppercase flex items-center justify-center text-sm"
            >
              Descartar Rascunho
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
