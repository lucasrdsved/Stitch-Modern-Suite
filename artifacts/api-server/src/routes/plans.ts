import { Router } from "express";
import { db } from "@workspace/db";
import { trainingPlansTable, planDaysTable, dayExercisesTable, exercisesTable, profilesTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";

const router = Router();

function requireTrainer(req: any, res: any, next: any) {
  if (!req.session.userId || req.session.userRole !== "trainer") return res.status(401).json({ error: "Não autorizado" });
  next();
}

async function getPlanFull(planId: number, trainerName?: string) {
  const [plan] = await db.select().from(trainingPlansTable).where(eq(trainingPlansTable.id, planId));
  if (!plan) return null;

  const [student] = await db.select().from(profilesTable).where(eq(profilesTable.id, plan.studentId));

  const days = await db.select().from(planDaysTable).where(eq(planDaysTable.planId, planId)).orderBy(asc(planDaysTable.dayOrder));

  const daysWithExercises = await Promise.all(
    days.map(async (day) => {
      const exs = await db.select().from(dayExercisesTable).where(eq(dayExercisesTable.dayId, day.id)).orderBy(asc(dayExercisesTable.exerciseOrder));
      const exercisesWithDetails = await Promise.all(
        exs.map(async (de) => {
          const [ex] = await db.select().from(exercisesTable).where(eq(exercisesTable.id, de.exerciseId));
          return {
            id: de.id, dayId: de.dayId, exerciseId: de.exerciseId,
            exerciseName: ex?.name ?? "Exercício",
            exerciseGifUrl: ex?.gifUrl ?? null,
            muscleGroup: ex?.muscleGroup ?? null,
            sets: de.sets ?? null, reps: de.reps ?? null,
            restSeconds: de.restSeconds ?? 60, notes: de.notes ?? null,
            exerciseOrder: de.exerciseOrder,
          };
        }),
      );
      return { id: day.id, planId: day.planId, name: day.name, dayOrder: day.dayOrder, exercises: exercisesWithDetails };
    }),
  );

  return {
    id: plan.id, trainerId: plan.trainerId, studentId: plan.studentId,
    studentName: student?.fullName ?? "",
    name: plan.name, isActive: plan.isActive,
    createdAt: plan.createdAt.toISOString(),
    days: daysWithExercises,
  };
}

// GET /api/trainer/plans
router.get("/trainer/plans", requireTrainer, async (req, res) => {
  const trainerId = req.session.userId!;
  const plans = await db.select().from(trainingPlansTable).where(eq(trainingPlansTable.trainerId, trainerId));
  const result = await Promise.all(
    plans.map(async (p) => {
      const [student] = await db.select().from(profilesTable).where(eq(profilesTable.id, p.studentId));
      return { id: p.id, trainerId: p.trainerId, studentId: p.studentId, studentName: student?.fullName ?? "", name: p.name, isActive: p.isActive, createdAt: p.createdAt.toISOString() };
    }),
  );
  return res.json(result);
});

// POST /api/trainer/plans
router.post("/trainer/plans", requireTrainer, async (req, res) => {
  const trainerId = req.session.userId!;
  const { name, studentId } = req.body;
  if (!name || !studentId) return res.status(400).json({ error: "name e studentId obrigatórios" });

  const [plan] = await db.insert(trainingPlansTable).values({ trainerId, studentId, name, isActive: true }).returning();
  const [student] = await db.select().from(profilesTable).where(eq(profilesTable.id, studentId));

  return res.status(201).json({ id: plan.id, trainerId: plan.trainerId, studentId: plan.studentId, studentName: student?.fullName ?? "", name: plan.name, isActive: plan.isActive, createdAt: plan.createdAt.toISOString() });
});

// GET /api/trainer/plans/:planId
router.get("/trainer/plans/:planId", requireTrainer, async (req, res) => {
  const full = await getPlanFull(parseInt(req.params.planId));
  if (!full) return res.status(404).json({ error: "Plano não encontrado" });
  return res.json(full);
});

// PATCH /api/trainer/plans/:planId
router.patch("/trainer/plans/:planId", requireTrainer, async (req, res) => {
  const planId = parseInt(req.params.planId);
  const { name, isActive } = req.body;
  const update: any = {};
  if (name !== undefined) update.name = name;
  if (isActive !== undefined) update.isActive = isActive;

  const [plan] = await db.update(trainingPlansTable).set(update).where(eq(trainingPlansTable.id, planId)).returning();
  if (!plan) return res.status(404).json({ error: "Plano não encontrado" });
  const [student] = await db.select().from(profilesTable).where(eq(profilesTable.id, plan.studentId));
  return res.json({ id: plan.id, trainerId: plan.trainerId, studentId: plan.studentId, studentName: student?.fullName ?? "", name: plan.name, isActive: plan.isActive, createdAt: plan.createdAt.toISOString() });
});

// POST /api/trainer/plans/:planId/days
router.post("/trainer/plans/:planId/days", requireTrainer, async (req, res) => {
  const planId = parseInt(req.params.planId);
  const { name, dayOrder } = req.body;
  if (!name || dayOrder === undefined) return res.status(400).json({ error: "name e dayOrder obrigatórios" });

  const [day] = await db.insert(planDaysTable).values({ planId, name, dayOrder }).returning();
  return res.status(201).json({ id: day.id, planId: day.planId, name: day.name, dayOrder: day.dayOrder });
});

// POST /api/trainer/plans/:planId/days/:dayId/exercises
router.post("/trainer/plans/:planId/days/:dayId/exercises", requireTrainer, async (req, res) => {
  const dayId = parseInt(req.params.dayId);
  const { exerciseId, sets, reps, restSeconds, notes, exerciseOrder } = req.body;
  if (!exerciseId || exerciseOrder === undefined) return res.status(400).json({ error: "exerciseId e exerciseOrder obrigatórios" });

  const [de] = await db.insert(dayExercisesTable).values({ dayId, exerciseId, sets: sets ?? null, reps: reps ?? null, restSeconds: restSeconds ?? 60, notes: notes ?? null, exerciseOrder }).returning();
  const [ex] = await db.select().from(exercisesTable).where(eq(exercisesTable.id, exerciseId));

  return res.status(201).json({
    id: de.id, dayId: de.dayId, exerciseId: de.exerciseId,
    exerciseName: ex?.name ?? "Exercício", exerciseGifUrl: ex?.gifUrl ?? null, muscleGroup: ex?.muscleGroup ?? null,
    sets: de.sets ?? null, reps: de.reps ?? null, restSeconds: de.restSeconds ?? 60, notes: de.notes ?? null, exerciseOrder: de.exerciseOrder,
  });
});

export { getPlanFull };
export default router;
