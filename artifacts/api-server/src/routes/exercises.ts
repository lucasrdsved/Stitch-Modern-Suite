import { Router } from "express";
import { db } from "@workspace/db";
import { exercisesTable } from "@workspace/db";
import { eq, and, or, ilike, sql } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) return res.status(401).json({ error: "Não autorizado" });
  next();
}

// GET /api/exercises
router.get("/exercises", requireAuth, async (req, res) => {
  const { search, muscleGroup, scope } = req.query as { search?: string; muscleGroup?: string; scope?: string };
  const userId = req.session.userId!;
  const isTrainer = req.session.userRole === "trainer";

  let query = db.select().from(exercisesTable);

  const conditions = [];

  if (scope === "global") {
    conditions.push(eq(exercisesTable.isGlobal, true));
  } else if (scope === "mine" && isTrainer) {
    conditions.push(and(eq(exercisesTable.isGlobal, false), eq(exercisesTable.trainerId, userId)));
  } else {
    // All: global + trainer's own
    if (isTrainer) {
      conditions.push(or(eq(exercisesTable.isGlobal, true), eq(exercisesTable.trainerId, userId)));
    } else {
      conditions.push(eq(exercisesTable.isGlobal, true));
    }
  }

  if (muscleGroup) {
    conditions.push(ilike(exercisesTable.muscleGroup, `%${muscleGroup}%`));
  }

  if (search) {
    conditions.push(ilike(exercisesTable.name, `%${search}%`));
  }

  const result = conditions.length > 0
    ? await db.select().from(exercisesTable).where(and(...conditions))
    : await db.select().from(exercisesTable);

  return res.json(result.map((e) => ({
    id: e.id,
    name: e.name,
    description: e.description ?? null,
    muscleGroup: e.muscleGroup ?? null,
    equipment: e.equipment ?? null,
    gifUrl: e.gifUrl ?? null,
    isGlobal: e.isGlobal,
    trainerId: e.trainerId ?? null,
  })));
});

// POST /api/exercises
router.post("/exercises", requireAuth, async (req, res) => {
  if (req.session.userRole !== "trainer") return res.status(403).json({ error: "Apenas trainers podem criar exercícios" });
  const { name, description, muscleGroup, equipment, gifUrl } = req.body;
  if (!name) return res.status(400).json({ error: "Nome obrigatório" });

  const [exercise] = await db
    .insert(exercisesTable)
    .values({ name, description, muscleGroup, equipment, gifUrl, trainerId: req.session.userId, isGlobal: false })
    .returning();

  return res.status(201).json({
    id: exercise.id, name: exercise.name, description: exercise.description ?? null,
    muscleGroup: exercise.muscleGroup ?? null, equipment: exercise.equipment ?? null,
    gifUrl: exercise.gifUrl ?? null, isGlobal: exercise.isGlobal, trainerId: exercise.trainerId ?? null,
  });
});

// GET /api/exercises/:id
router.get("/exercises/:exerciseId", requireAuth, async (req, res) => {
  const [exercise] = await db.select().from(exercisesTable).where(eq(exercisesTable.id, parseInt(req.params.exerciseId)));
  if (!exercise) return res.status(404).json({ error: "Exercício não encontrado" });
  return res.json({
    id: exercise.id, name: exercise.name, description: exercise.description ?? null,
    muscleGroup: exercise.muscleGroup ?? null, equipment: exercise.equipment ?? null,
    gifUrl: exercise.gifUrl ?? null, isGlobal: exercise.isGlobal, trainerId: exercise.trainerId ?? null,
  });
});

export default router;
