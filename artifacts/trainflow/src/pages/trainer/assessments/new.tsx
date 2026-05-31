import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { setLatestAssessment } from "@/lib/mock-store";

export default function TrainerNewAssessment() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    weightKg: "",
    heightCm: "",
    chest: "",
    waist: "",
    hips: "",
    thigh: "",
    biceps: "",
    subscapular: "",
    triceps: "",
    chestFold: "",
    axillary: "",
    suprailiac: "",
    abdominal: "",
    thighFold: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLatestAssessment({
        id: Date.now(),
        weightKg: Number(formData.weightKg) || 82.5,
        bodyFatPct: 14.2,
        muscleMassKg: 40.1,
        leanMassKg: 70.8,
        somatotype: "Mesomorfo",
        createdAt: new Date().toISOString(),
        history: [
          { date: "Jan", weight: 85, fat: 16 },
          { date: "Fev", weight: 84, fat: 15.5 },
          { date: "Mar", weight: 83.5, fat: 15 },
          { date: "Abr", weight: Number(formData.weightKg) || 82.5, fat: 14.2 },
        ],
        measurements: {
          chest: Number(formData.chest) || 102,
          waist: Number(formData.waist) || 84,
          hips: Number(formData.hips) || 98,
          thigh: Number(formData.thigh) || 62,
          biceps: Number(formData.biceps) || 38,
          neck: 40,
          shoulders: 120,
        },
      });
      toast({
        title: "Sucesso!",
        description: "Avaliação física salva com sucesso.",
      });
      setLocation("/t/dashboard");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar avaliação.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col pb-6 selection:bg-primary selection:text-black">
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <Link href="/t/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-white">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <h1 className="font-display text-primary tracking-widest text-3xl mt-1 uppercase">AVALIAÇÃO</h1>
        </div>
        <div className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Passo {step} de 2</div>
      </header>

      <main className="flex-1 pt-24 px-6 flex flex-col gap-8 max-w-2xl mx-auto w-full">
        <section className="flex flex-col gap-2">
           <h2 className="font-display text-white text-4xl uppercase leading-none">
              {step === 1 ? 'DADOS ANTROPOMÉTRICOS' : 'DOBRAS CUTÂNEAS'}
           </h2>
           <p className="text-[#888888] text-xs font-medium tracking-wide uppercase">
              {step === 1 ? 'Medidas de peso, altura e circunferências' : 'Protocolo Pollock 7 Dobras'}
           </p>
        </section>

        <div className="grid grid-cols-1 gap-6">
          {step === 1 ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Peso (kg)</label>
                <input name="weightKg" value={formData.weightKg} onChange={handleInputChange} placeholder="00.0" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Altura (cm)</label>
                <input name="heightCm" value={formData.heightCm} onChange={handleInputChange} placeholder="000" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Tórax</label>
                <input name="chest" value={formData.chest} onChange={handleInputChange} placeholder="00.0" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Cintura</label>
                <input name="waist" value={formData.waist} onChange={handleInputChange} placeholder="00.0" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Quadril</label>
                <input name="hips" value={formData.hips} onChange={handleInputChange} placeholder="00.0" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Braço Dir.</label>
                <input name="biceps" value={formData.biceps} onChange={handleInputChange} placeholder="00.0" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Subescapular</label>
                <input name="subscapular" value={formData.subscapular} onChange={handleInputChange} placeholder="00" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Tricipital</label>
                <input name="triceps" value={formData.triceps} onChange={handleInputChange} placeholder="00" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Peitoral</label>
                <input name="chestFold" value={formData.chestFold} onChange={handleInputChange} placeholder="00" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Axilar Média</label>
                <input name="axillary" value={formData.axillary} onChange={handleInputChange} placeholder="00" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Suprailíaca</label>
                <input name="suprailiac" value={formData.suprailiac} onChange={handleInputChange} placeholder="00" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Abdominal</label>
                <input name="abdominal" value={formData.abdominal} onChange={handleInputChange} placeholder="00" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Coxa</label>
                <input name="thighFold" value={formData.thighFold} onChange={handleInputChange} placeholder="00" className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 text-xl focus:border-primary/50 outline-none transition-all" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto flex gap-4 pt-10">
          {step === 2 && (
            <Button onClick={() => setStep(1)} variant="outline" className="flex-1 h-14 rounded-full border-white/10 hover:bg-white/5 text-white font-display text-xl uppercase tracking-widest">
              Voltar
            </Button>
          )}
          <Button 
            onClick={step === 1 ? () => setStep(2) : handleSubmit} 
            className="flex-[2] h-14 bg-primary text-black rounded-full font-display text-xl uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-2xl electric-glow"
          >
            {step === 1 ? 'Próximo' : 'Finalizar'}
            <span className="material-symbols-outlined ml-2">arrow_forward</span>
          </Button>
        </div>
      </main>
    </div>
  );
}
