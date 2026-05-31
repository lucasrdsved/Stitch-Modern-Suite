export interface BodyComposition {
  bodyDensity: number;
  bodyFatPct: number;
  fatMassKg: number;
  leanMassKg: number;
  bmi: number;
  waistHipRatio: number | null;
  somatotype: string;
  somatotypeScores: { endo: number; meso: number; ecto: number };
}

export interface TrainingOrientation {
  somatotype: string;
  summary: string;
  primary_goal: string;
  training_focus: {
    type: string[];
    frequency_per_week: number;
    session_duration_min: number;
    cardio_recommendation: string;
    intensity: string;
  };
  nutrition_note: string;
  highlights: string[];
  trainer_notes: string;
}

export function calcBodyComposition(params: {
  age: number;
  sex: "M" | "F";
  weightKg: number;
  heightCm: number;
  skinfoldChest?: number | null;
  skinfoldAbdomen?: number | null;
  skinfoldThigh?: number | null;
  skinfoldTriceps?: number | null;
  skinfoldSubscapular?: number | null;
  skinfoldSuprailiac?: number | null;
  skinfoldMidaxillary?: number | null;
  circWaist?: number | null;
  circHip?: number | null;
}): BodyComposition {
  const {
    age, sex, weightKg, heightCm,
    skinfoldChest, skinfoldAbdomen, skinfoldThigh,
    skinfoldTriceps, skinfoldSubscapular, skinfoldSuprailiac, skinfoldMidaxillary,
    circWaist, circHip,
  } = params;

  // Pollock 7 skinfolds
  const s7 = [
    skinfoldChest, skinfoldAbdomen, skinfoldThigh,
    skinfoldTriceps, skinfoldSubscapular, skinfoldSuprailiac, skinfoldMidaxillary,
  ].filter(Boolean) as number[];

  const sigma7 = s7.length > 0 ? s7.reduce((a, b) => a + b, 0) : 0;

  let bodyDensity: number;
  if (sigma7 > 0) {
    if (sex === "M") {
      bodyDensity = 1.112 - 0.00043499 * sigma7 + 0.00000055 * sigma7 ** 2 - 0.00028826 * age;
    } else {
      bodyDensity = 1.097 - 0.00046971 * sigma7 + 0.00000056 * sigma7 ** 2 - 0.00012828 * age;
    }
  } else {
    // Fallback: estimate from BMI
    const bmiVal = weightKg / (heightCm / 100) ** 2;
    bodyDensity = sex === "M" ? 1.0913 - 0.00116 * bmiVal : 1.0897 - 0.00133 * bmiVal;
  }

  // Siri equation
  const bodyFatPct = Math.max(3, Math.min(50, (4.95 / bodyDensity - 4.5) * 100));
  const fatMassKg = (bodyFatPct / 100) * weightKg;
  const leanMassKg = weightKg - fatMassKg;

  // BMI
  const bmi = weightKg / (heightCm / 100) ** 2;

  // WHR
  const waistHipRatio = circWaist && circHip ? circWaist / circHip : null;

  // Heath-Carter somatotype (simplified)
  const s3 = (skinfoldTriceps ?? 0) + (skinfoldSubscapular ?? 0) + (skinfoldSuprailiac ?? 0);
  const s3Corrected = s3 * (170.18 / heightCm);
  const endo = -0.7182 + 0.1451 * s3Corrected - 0.00068 * s3Corrected ** 2 + 0.0000014 * s3Corrected ** 3;

  // Mesomorphy (simplified without bone diameters)
  const armCorrected = 20; // typical estimate
  const thighCorrected = 48;
  const meso = Math.max(0.5, 0.858 * 6.5 + 0.601 * 9.5 + 0.188 * armCorrected + 0.161 * thighCorrected - 0.131 * heightCm + 4.5);

  // Ectomorphy
  const hwRatio = heightCm / weightKg ** 0.333;
  let ecto: number;
  if (hwRatio >= 40.75) ecto = 0.732 * hwRatio - 28.58;
  else if (hwRatio >= 38.28) ecto = 0.463 * hwRatio - 17.63;
  else ecto = 0.1;

  const endoN = Math.max(0, endo);
  const mesoN = Math.max(0, meso);
  const ectoN = Math.max(0, ecto);

  // Classify
  let somatotype: string;
  const maxComp = Math.max(endoN, mesoN, ectoN);
  const diff = 1;

  if (maxComp === endoN && endoN - mesoN >= diff && endoN - ectoN >= diff) {
    somatotype = "endomorph";
  } else if (maxComp === mesoN && mesoN - endoN >= diff && mesoN - ectoN >= diff) {
    somatotype = "mesomorph";
  } else if (maxComp === ectoN && ectoN - endoN >= diff && ectoN - mesoN >= diff) {
    somatotype = "ectomorph";
  } else if (endoN >= ectoN && mesoN >= ectoN) {
    somatotype = "endo_meso";
  } else {
    somatotype = "ecto_meso";
  }

  return {
    bodyDensity,
    bodyFatPct: parseFloat(bodyFatPct.toFixed(2)),
    fatMassKg: parseFloat(fatMassKg.toFixed(2)),
    leanMassKg: parseFloat(leanMassKg.toFixed(2)),
    bmi: parseFloat(bmi.toFixed(2)),
    waistHipRatio: waistHipRatio ? parseFloat(waistHipRatio.toFixed(3)) : null,
    somatotype,
    somatotypeScores: {
      endo: parseFloat(endoN.toFixed(2)),
      meso: parseFloat(mesoN.toFixed(2)),
      ecto: parseFloat(ectoN.toFixed(2)),
    },
  };
}

export function generateOrientation(somatotype: string, sex: string): TrainingOrientation {
  const orientations: Record<string, TrainingOrientation> = {
    endomorph: {
      somatotype: "endomorph",
      summary: "Seu perfil tende a acumular gordura com facilidade, mas responde muito bem ao treinamento de alta intensidade. Com consistência e foco, os resultados aparecem rapidamente.",
      primary_goal: "fat_loss",
      training_focus: {
        type: ["Circuito", "Alta repetição", "Supersets"],
        frequency_per_week: 5,
        session_duration_min: 60,
        cardio_recommendation: "3-4x/semana, HIIT ou moderado contínuo",
        intensity: "high",
      },
      nutrition_note: "Atenção ao controle calórico e à qualidade dos carboidratos. Consulte um nutricionista.",
      highlights: ["Alta resposta ao cardio HIIT", "Supersets para queima calórica", "5x por semana ideal", "Controle da alimentação é chave"],
      trainer_notes: "Endomorfo dominante. Priorizar déficit calórico e alta frequência. Evitar longos períodos sem treino.",
    },
    ectomorph: {
      somatotype: "ectomorph",
      summary: "Seu metabolismo é acelerado e você tem facilidade em manter o peso. O foco deve ser construir massa muscular com treinos intensos e volume adequado.",
      primary_goal: "muscle_gain",
      training_focus: {
        type: ["Força progressiva", "Hipertrofia"],
        frequency_per_week: 4,
        session_duration_min: 70,
        cardio_recommendation: "1-2x/semana, leve",
        intensity: "moderate",
      },
      nutrition_note: "Superávit calórico com foco em proteínas. Consulte um nutricionista.",
      highlights: ["Foco total em ganho de força", "Cardio mínimo", "Descanso é essencial", "Alta ingestão proteica necessária"],
      trainer_notes: "Ectomorfo dominante. Minimizar cardio, priorizar hipertrofia com progressão de carga.",
    },
    mesomorph: {
      somatotype: "mesomorph",
      summary: "Você tem a estrutura muscular mais favorável para o treinamento. Responde rapidamente a qualquer estímulo e pode trabalhar tanto força quanto definição com eficiência.",
      primary_goal: "body_recomposition",
      training_focus: {
        type: ["Hipertrofia", "Periodização"],
        frequency_per_week: 5,
        session_duration_min: 60,
        cardio_recommendation: "2-3x/semana",
        intensity: "moderate",
      },
      nutrition_note: "Dieta equilibrada com ajuste periódico. Consulte um nutricionista.",
      highlights: ["Alta resposta ao treino", "Recomposição corporal possível", "5x/semana ideal", "Periodização acelera resultados"],
      trainer_notes: "Mesomorfo dominante. Excelente resposta ao treino. Periodizar a cada 6-8 semanas.",
    },
    endo_meso: {
      somatotype: "endo_meso",
      summary: "Você tem boa capacidade muscular mas tende a acumular gordura. Com o treino certo, é possível perder gordura e manter o músculo simultaneamente.",
      primary_goal: "body_recomposition",
      training_focus: {
        type: ["Força", "Circuito misto"],
        frequency_per_week: 5,
        session_duration_min: 65,
        cardio_recommendation: "2-3x/semana HIIT",
        intensity: "high",
      },
      nutrition_note: "Ciclo calórico pode ser eficiente. Consulte um nutricionista.",
      highlights: ["Recomposição corporal possível", "HIIT 2-3x/semana", "Força para manter músculo", "Ciclo alimentar ajuda"],
      trainer_notes: "Endo-Meso. Combinar treino de força com circuitos metabólicos.",
    },
    ecto_meso: {
      somatotype: "ecto_meso",
      summary: "Você combina estrutura muscular favorável com linearidade corporal. Ideal para ganhos de qualidade muscular sem excessos de gordura.",
      primary_goal: "muscle_gain",
      training_focus: {
        type: ["Hipertrofia", "Força funcional"],
        frequency_per_week: 4,
        session_duration_min: 65,
        cardio_recommendation: "1-2x/semana",
        intensity: "moderate",
      },
      nutrition_note: "Superávit moderado com qualidade. Consulte um nutricionista.",
      highlights: ["Ganhos de qualidade", "Força funcional", "4x/semana ideal", "Superávit calórico moderado"],
      trainer_notes: "Ecto-Meso. Programar progressão linear de força com volume adequado.",
    },
  };

  return orientations[somatotype] ?? orientations["mesomorph"];
}
