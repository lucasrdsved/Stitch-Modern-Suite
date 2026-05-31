import { db } from "@workspace/db";
import {
  profilesTable,
  trainerStudentsTable,
  physicalAssessmentsTable,
  exercisesTable,
  trainingPlansTable,
  planDaysTable,
  dayExercisesTable,
  workoutSessionsTable,
  sessionSetsTable,
  conversationsTable,
  messagesTable,
  magicTokensTable,
} from "@workspace/db";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(sessionSetsTable);
  await db.delete(workoutSessionsTable);
  await db.delete(dayExercisesTable);
  await db.delete(planDaysTable);
  await db.delete(trainingPlansTable);
  await db.delete(messagesTable);
  await db.delete(conversationsTable);
  await db.delete(physicalAssessmentsTable);
  await db.delete(magicTokensTable);
  await db.delete(trainerStudentsTable);
  await db.delete(exercisesTable);
  await db.delete(profilesTable);

  // Create trainer
  const passwordHash = await hashPassword("trainer123");
  const [trainer] = await db.insert(profilesTable).values({
    role: "trainer",
    fullName: "Carlos Mendes",
    email: "trainer@trainflow.app",
    passwordHash,
  }).returning();
  console.log("Trainer created:", trainer.email);

  // Create students
  const [student1] = await db.insert(profilesTable).values({
    role: "student",
    fullName: "Ana Lima",
    email: "ana@trainflow.app",
  }).returning();

  const [student2] = await db.insert(profilesTable).values({
    role: "student",
    fullName: "Pedro Santos",
    email: "pedro@trainflow.app",
  }).returning();

  const [student3] = await db.insert(profilesTable).values({
    role: "student",
    fullName: "Julia Costa",
    email: "julia@trainflow.app",
  }).returning();

  console.log("Students created");

  // Magic tokens for students
  const token1 = randomBytes(32).toString("hex");
  await db.insert(magicTokensTable).values({
    userId: student1.id,
    token: token1,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const token2 = randomBytes(32).toString("hex");
  await db.insert(magicTokensTable).values({
    userId: student2.id,
    token: token2,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const token3 = randomBytes(32).toString("hex");
  await db.insert(magicTokensTable).values({
    userId: student3.id,
    token: token3,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  console.log("Magic tokens created");
  console.log("Student 1 (Ana) token:", token1);
  console.log("Student 2 (Pedro) token:", token2);
  console.log("Student 3 (Julia) token:", token3);

  // Trainer-student links
  await db.insert(trainerStudentsTable).values([
    { trainerId: trainer.id, studentId: student1.id, email: student1.email, status: "active" },
    { trainerId: trainer.id, studentId: student2.id, email: student2.email, status: "active" },
    { trainerId: trainer.id, studentId: student3.id, email: student3.email, status: "invited" },
  ]);

  // Create exercises
  const exercises = await db.insert(exercisesTable).values([
    { name: "Supino Reto", muscleGroup: "Peito", equipment: "Barra", isGlobal: true, description: "Exercício básico para peitoral" },
    { name: "Agachamento Livre", muscleGroup: "Quadríceps", equipment: "Barra", isGlobal: true, description: "Exercício composto para membros inferiores" },
    { name: "Levantamento Terra", muscleGroup: "Costas", equipment: "Barra", isGlobal: true, description: "Exercício de força total" },
    { name: "Rosca Direta", muscleGroup: "Bíceps", equipment: "Barra", isGlobal: true, description: "Exercício isolado para bíceps" },
    { name: "Tríceps Testa", muscleGroup: "Tríceps", equipment: "Barra", isGlobal: true, description: "Exercício isolado para tríceps" },
    { name: "Leg Press 45", muscleGroup: "Quadríceps", equipment: "Máquina", isGlobal: true, description: "Exercício guiado para membros inferiores" },
    { name: "Pulldown", muscleGroup: "Costas", equipment: "Cabo", isGlobal: true, description: "Puxada para costas" },
    { name: "Desenvolvimento Militar", muscleGroup: "Ombros", equipment: "Barra", isGlobal: true, description: "Exercício composto para ombros" },
    { name: "Stiff", muscleGroup: "Posterior de Coxa", equipment: "Barra", isGlobal: true, description: "Exercício para posterior de coxa e glúteos" },
    { name: "Remada Curvada", muscleGroup: "Costas", equipment: "Barra", isGlobal: true, description: "Exercício composto para costas" },
    { name: "Crucifixo", muscleGroup: "Peito", equipment: "Halter", isGlobal: true, description: "Exercício isolado para peitoral" },
    { name: "Abdução de Quadril", muscleGroup: "Glúteos", equipment: "Máquina", isGlobal: true, description: "Exercício para glúteos" },
  ]).returning();

  console.log("Exercises created:", exercises.length);

  // Physical assessments for student1
  const orientationAna = {
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
  };

  await db.insert(physicalAssessmentsTable).values({
    studentId: student1.id,
    trainerId: trainer.id,
    age: 28,
    sex: "F",
    weightKg: "62.5",
    heightCm: "168.0",
    skinfoldChest: "8.5",
    skinfoldAbdomen: "12.0",
    skinfoldThigh: "15.0",
    skinfoldTriceps: "10.0",
    skinfoldSubscapular: "9.0",
    skinfoldSuprailiac: "11.0",
    skinfoldMidaxillary: "8.0",
    circWaist: "68.0",
    circHip: "92.0",
    bodyDensity: "1.056800",
    bodyFatPct: "18.50",
    fatMassKg: "11.56",
    leanMassKg: "50.94",
    bmi: "22.15",
    waistHipRatio: "0.739",
    somatotype: "ecto_meso",
    trainingOrientation: JSON.stringify(orientationAna),
  });

  // Physical assessments for student2
  const orientationPedro = {
    somatotype: "mesomorph",
    summary: "Você tem a estrutura muscular mais favorável para o treinamento. Responde rapidamente a qualquer estímulo.",
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
    trainer_notes: "Mesomorfo dominante. Excelente resposta ao treino.",
  };

  await db.insert(physicalAssessmentsTable).values({
    studentId: student2.id,
    trainerId: trainer.id,
    age: 32,
    sex: "M",
    weightKg: "82.0",
    heightCm: "178.0",
    skinfoldChest: "12.0",
    skinfoldAbdomen: "16.0",
    skinfoldThigh: "14.0",
    skinfoldTriceps: "10.0",
    skinfoldSubscapular: "11.0",
    skinfoldSuprailiac: "13.0",
    skinfoldMidaxillary: "10.0",
    circWaist: "82.0",
    circHip: "98.0",
    bodyDensity: "1.051200",
    bodyFatPct: "21.30",
    fatMassKg: "17.47",
    leanMassKg: "64.53",
    bmi: "25.87",
    waistHipRatio: "0.837",
    somatotype: "mesomorph",
    trainingOrientation: JSON.stringify(orientationPedro),
  });

  console.log("Assessments created");

  // Training plan for student1 (Ana)
  const [planAna] = await db.insert(trainingPlansTable).values({
    trainerId: trainer.id,
    studentId: student1.id,
    name: "Plano Hipertrofia A",
    isActive: true,
  }).returning();

  const [dayA] = await db.insert(planDaysTable).values({ planId: planAna.id, name: "DIA A - Peito e Tríceps", dayOrder: 0 }).returning();
  const [dayB] = await db.insert(planDaysTable).values({ planId: planAna.id, name: "DIA B - Costas e Bíceps", dayOrder: 1 }).returning();
  const [dayC] = await db.insert(planDaysTable).values({ planId: planAna.id, name: "DIA C - Pernas", dayOrder: 2 }).returning();

  const supino = exercises.find(e => e.name === "Supino Reto")!;
  const crucifixo = exercises.find(e => e.name === "Crucifixo")!;
  const tricepsTesta = exercises.find(e => e.name === "Tríceps Testa")!;
  const pulldown = exercises.find(e => e.name === "Pulldown")!;
  const remada = exercises.find(e => e.name === "Remada Curvada")!;
  const rosca = exercises.find(e => e.name === "Rosca Direta")!;
  const agachamento = exercises.find(e => e.name === "Agachamento Livre")!;
  const legPress = exercises.find(e => e.name === "Leg Press 45")!;
  const stiff = exercises.find(e => e.name === "Stiff")!;

  await db.insert(dayExercisesTable).values([
    { dayId: dayA.id, exerciseId: supino.id, sets: 4, reps: "8-12", restSeconds: 90, exerciseOrder: 0 },
    { dayId: dayA.id, exerciseId: crucifixo.id, sets: 3, reps: "10-15", restSeconds: 60, exerciseOrder: 1 },
    { dayId: dayA.id, exerciseId: tricepsTesta.id, sets: 3, reps: "10-12", restSeconds: 60, exerciseOrder: 2 },
    { dayId: dayB.id, exerciseId: pulldown.id, sets: 4, reps: "8-12", restSeconds: 90, exerciseOrder: 0 },
    { dayId: dayB.id, exerciseId: remada.id, sets: 3, reps: "8-10", restSeconds: 90, exerciseOrder: 1 },
    { dayId: dayB.id, exerciseId: rosca.id, sets: 3, reps: "10-12", restSeconds: 60, exerciseOrder: 2 },
    { dayId: dayC.id, exerciseId: agachamento.id, sets: 4, reps: "8-12", restSeconds: 120, exerciseOrder: 0 },
    { dayId: dayC.id, exerciseId: legPress.id, sets: 3, reps: "12-15", restSeconds: 90, exerciseOrder: 1 },
    { dayId: dayC.id, exerciseId: stiff.id, sets: 3, reps: "10-12", restSeconds: 90, exerciseOrder: 2 },
  ]);

  console.log("Training plan for Ana created");

  // Training plan for student2 (Pedro)
  const [planPedro] = await db.insert(trainingPlansTable).values({
    trainerId: trainer.id,
    studentId: student2.id,
    name: "Plano Full Body",
    isActive: true,
  }).returning();

  const [dayFull] = await db.insert(planDaysTable).values({ planId: planPedro.id, name: "FULL BODY", dayOrder: 0 }).returning();
  const levTerra = exercises.find(e => e.name === "Levantamento Terra")!;
  const devMilitar = exercises.find(e => e.name === "Desenvolvimento Militar")!;

  await db.insert(dayExercisesTable).values([
    { dayId: dayFull.id, exerciseId: agachamento.id, sets: 4, reps: "6-8", restSeconds: 120, exerciseOrder: 0 },
    { dayId: dayFull.id, exerciseId: supino.id, sets: 4, reps: "6-8", restSeconds: 120, exerciseOrder: 1 },
    { dayId: dayFull.id, exerciseId: levTerra.id, sets: 3, reps: "5", restSeconds: 180, exerciseOrder: 2 },
    { dayId: dayFull.id, exerciseId: devMilitar.id, sets: 3, reps: "8-10", restSeconds: 90, exerciseOrder: 3 },
  ]);

  // Workout sessions for Ana
  const now = new Date();
  const session1Start = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const session1End = new Date(session1Start.getTime() + 52 * 60 * 1000);
  const [session1] = await db.insert(workoutSessionsTable).values({
    studentId: student1.id,
    planDayId: dayA.id,
    startedAt: session1Start,
    finishedAt: session1End,
  }).returning();

  await db.insert(sessionSetsTable).values([
    { sessionId: session1.id, dayExerciseId: 1, setNumber: 1, repsDone: 10, weightKg: "35.0", recordedAt: new Date(session1Start.getTime() + 5 * 60 * 1000) },
    { sessionId: session1.id, dayExerciseId: 1, setNumber: 2, repsDone: 10, weightKg: "35.0", recordedAt: new Date(session1Start.getTime() + 8 * 60 * 1000) },
    { sessionId: session1.id, dayExerciseId: 1, setNumber: 3, repsDone: 9, weightKg: "35.0", recordedAt: new Date(session1Start.getTime() + 11 * 60 * 1000) },
    { sessionId: session1.id, dayExerciseId: 1, setNumber: 4, repsDone: 8, weightKg: "35.0", recordedAt: new Date(session1Start.getTime() + 14 * 60 * 1000) },
  ]);

  const session2Start = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const session2End = new Date(session2Start.getTime() + 48 * 60 * 1000);
  const [session2] = await db.insert(workoutSessionsTable).values({
    studentId: student1.id,
    planDayId: dayB.id,
    startedAt: session2Start,
    finishedAt: session2End,
  }).returning();

  // Conversation between trainer and student1
  const [conv1] = await db.insert(conversationsTable).values({
    trainerId: trainer.id,
    studentId: student1.id,
    type: "direct",
  }).returning();

  const baseTime = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  await db.insert(messagesTable).values([
    { conversationId: conv1.id, senderId: trainer.id, content: "Oi Ana! Como foi o treino de ontem?", sentAt: new Date(baseTime.getTime() + 0) },
    { conversationId: conv1.id, senderId: student1.id, content: "Oi Carlos! Foi ótimo! Consegui aumentar o peso no supino", sentAt: new Date(baseTime.getTime() + 2 * 60 * 1000) },
    { conversationId: conv1.id, senderId: trainer.id, content: "Excelente! Continue assim. Para amanhã, foque na técnica do agachamento", sentAt: new Date(baseTime.getTime() + 5 * 60 * 1000) },
    { conversationId: conv1.id, senderId: student1.id, content: "Combinado! Vou prestar atenção na postura", sentAt: new Date(baseTime.getTime() + 7 * 60 * 1000) },
  ]);

  const [conv2] = await db.insert(conversationsTable).values({
    trainerId: trainer.id,
    studentId: student2.id,
    type: "direct",
  }).returning();

  await db.insert(messagesTable).values([
    { conversationId: conv2.id, senderId: trainer.id, content: "Pedro, bom treino hoje!", sentAt: new Date(now.getTime() - 30 * 60 * 1000) },
    { conversationId: conv2.id, senderId: student2.id, content: "Valeu Carlos! Deadlift foi pesado haha", sentAt: new Date(now.getTime() - 25 * 60 * 1000) },
  ]);

  console.log("Conversations and messages created");
  console.log("\n=== SEED COMPLETE ===");
  console.log("Trainer login: trainer@trainflow.app / trainer123");
  console.log("Student Ana magic token:", token1);
  console.log("Student Pedro magic token:", token2);
  console.log("Student Julia magic token:", token3);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
