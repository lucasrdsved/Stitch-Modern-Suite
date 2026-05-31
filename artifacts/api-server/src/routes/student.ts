import { Router } from "express";
import { db } from "@workspace/db";
import {
  profilesTable,
  physicalAssessmentsTable,
  trainingPlansTable,
  planDaysTable,
  workoutSessionsTable,
  sessionSetsTable,
  dayExercisesTable,
  exercisesTable,
} from "@workspace/db";
import { eq, and, desc, asc } from "drizzle-orm";
import { getPlanFull } from "./plans";

const router = Router();

function requireStudent(req: any, res: any, next: any) {
  if (!req.session.userId || req.session.userRole !== "student") return res.status(401).json({ error: "Não autorizado" });
  next();
}

function formatAssessment(a: any) {
  if (!a) return null;
  return {
    id: a.id, studentId: a.studentId, trainerId: a.trainerId,
    assessedAt: a.assessedAt.toISOString(),
    age: a.age, sex: a.sex,
    weightKg: parseFloat(String(a.weightKg)), heightCm: parseFloat(String(a.heightCm)),
    bmi: a.bmi ? parseFloat(String(a.bmi)) : null,
    bodyFatPct: a.bodyFatPct ? parseFloat(String(a.bodyFatPct)) : null,
    fatMassKg: a.fatMassKg ? parseFloat(String(a.fatMassKg)) : null,
    leanMassKg: a.leanMassKg ? parseFloat(String(a.leanMassKg)) : null,
    waistHipRatio: a.waistHipRatio ? parseFloat(String(a.waistHipRatio)) : null,
    somatotype: a.somatotype ?? null,
    trainingOrientation: a.trainingOrientation ? JSON.parse(a.trainingOrientation) : null,
    skinfoldChest: a.skinfoldChest ? parseFloat(String(a.skinfoldChest)) : null,
    skinfoldAbdomen: a.skinfoldAbdomen ? parseFloat(String(a.skinfoldAbdomen)) : null,
    skinfoldThigh: a.skinfoldThigh ? parseFloat(String(a.skinfoldThigh)) : null,
    skinfoldTriceps: a.skinfoldTriceps ? parseFloat(String(a.skinfoldTriceps)) : null,
    skinfoldSubscapular: a.skinfoldSubscapular ? parseFloat(String(a.skinfoldSubscapular)) : null,
    skinfoldSuprailiac: a.skinfoldSuprailiac ? parseFloat(String(a.skinfoldSuprailiac)) : null,
    skinfoldMidaxillary: a.skinfoldMidaxillary ? parseFloat(String(a.skinfoldMidaxillary)) : null,
    circWaist: a.circWaist ? parseFloat(String(a.circWaist)) : null,
    circHip: a.circHip ? parseFloat(String(a.circHip)) : null,
    notes: a.notes ?? null,
  };
}

async function formatSession(s: any) {
  const sets = await db.select().from(sessionSetsTable).where(eq(sessionSetsTable.sessionId, s.id));
  const totalVolume = sets.reduce((acc, set) => acc + (parseFloat(String(set.weightKg ?? 0)) * (set.repsDone ?? 0)), 0);
  return {
    id: s.id, studentId: s.studentId, planDayId: s.planDayId ?? null, planDayName: null,
    startedAt: s.startedAt.toISOString(),
    finishedAt: s.finishedAt?.toISOString() ?? null,
    totalSets: sets.length,
    totalVolumeKg: Math.round(totalVolume),
    durationMinutes: s.finishedAt ? Math.round((s.finishedAt.getTime() - s.startedAt.getTime()) / 60000) : null,
  };
}

// GET /api/student/today
router.get("/student/today", requireStudent, async (req, res) => {
  const studentId = req.session.userId!;
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.id, studentId));

  const [activePlan] = await db
    .select()
    .from(trainingPlansTable)
    .where(and(eq(trainingPlansTable.studentId, studentId), eq(trainingPlansTable.isActive, true)))
    .limit(1);

  let todayWorkout = null;
  if (activePlan) {
    const days = await db.select().from(planDaysTable).where(eq(planDaysTable.planId, activePlan.id)).orderBy(asc(planDaysTable.dayOrder));
    if (days.length > 0) {
      const sessionCount = await db.select().from(workoutSessionsTable).where(eq(workoutSessionsTable.studentId, studentId));
      const dayIndex = sessionCount.length % days.length;
      const day = days[dayIndex];
      const exs = await db.select().from(dayExercisesTable).where(eq(dayExercisesTable.dayId, day.id)).orderBy(asc(dayExercisesTable.exerciseOrder));
      const exercisesWithDetails = await Promise.all(
        exs.map(async (de) => {
          const [ex] = await db.select().from(exercisesTable).where(eq(exercisesTable.id, de.exerciseId));
          return { id: de.id, dayId: de.dayId, exerciseId: de.exerciseId, exerciseName: ex?.name ?? "", exerciseGifUrl: ex?.gifUrl ?? null, muscleGroup: ex?.muscleGroup ?? null, sets: de.sets ?? null, reps: de.reps ?? null, restSeconds: de.restSeconds ?? 60, notes: de.notes ?? null, exerciseOrder: de.exerciseOrder };
        }),
      );
      todayWorkout = { id: day.id, planId: day.planId, name: day.name, dayOrder: day.dayOrder, exercises: exercisesWithDetails };
    }
  }

  const recentSessionsRaw = await db
    .select()
    .from(workoutSessionsTable)
    .where(eq(workoutSessionsTable.studentId, studentId))
    .orderBy(desc(workoutSessionsTable.startedAt))
    .limit(3);
  const recentSessions = await Promise.all(recentSessionsRaw.map(formatSession));

  const [latestAssessment] = await db
    .select()
    .from(physicalAssessmentsTable)
    .where(eq(physicalAssessmentsTable.studentId, studentId))
    .orderBy(desc(physicalAssessmentsTable.assessedAt))
    .limit(1);

  return res.json({
    studentName: profile?.fullName ?? "",
    todayWorkout,
    recentSessions,
    unreadMessages: 0,
    latestAssessment: formatAssessment(latestAssessment),
  });
});

// GET /api/student/assessments/latest
router.get("/student/assessments/latest", requireStudent, async (req, res) => {
  const studentId = req.session.userId!;
  const [a] = await db
    .select()
    .from(physicalAssessmentsTable)
    .where(eq(physicalAssessmentsTable.studentId, studentId))
    .orderBy(desc(physicalAssessmentsTable.assessedAt))
    .limit(1);
  if (!a) return res.status(404).json({ error: "Nenhuma avaliação encontrada" });
  return res.json(formatAssessment(a));
});

// GET /api/student/assessments
router.get("/student/assessments", requireStudent, async (req, res) => {
  const studentId = req.session.userId!;
  const assessments = await db
    .select()
    .from(physicalAssessmentsTable)
    .where(eq(physicalAssessmentsTable.studentId, studentId))
    .orderBy(desc(physicalAssessmentsTable.assessedAt));
  return res.json(assessments.map(formatAssessment));
});

// GET /api/student/workout/active-plan
router.get("/student/workout/active-plan", requireStudent, async (req, res) => {
  const studentId = req.session.userId!;
  const [activePlan] = await db
    .select()
    .from(trainingPlansTable)
    .where(and(eq(trainingPlansTable.studentId, studentId), eq(trainingPlansTable.isActive, true)))
    .limit(1);
  if (!activePlan) return res.status(404).json({ error: "Nenhum plano ativo" });
  const full = await getPlanFull(activePlan.id);
  return res.json(full);
});

// GET /api/student/sessions
router.get("/student/sessions", requireStudent, async (req, res) => {
  const studentId = req.session.userId!;
  const sessions = await db
    .select()
    .from(workoutSessionsTable)
    .where(eq(workoutSessionsTable.studentId, studentId))
    .orderBy(desc(workoutSessionsTable.startedAt));
  const result = await Promise.all(sessions.map(formatSession));
  return res.json(result);
});

// POST /api/student/sessions
router.post("/student/sessions", requireStudent, async (req, res) => {
  const studentId = req.session.userId!;
  const { planDayId } = req.body;
  const [session] = await db
    .insert(workoutSessionsTable)
    .values({ studentId, planDayId: planDayId ?? null, startedAt: new Date() })
    .returning();
  return res.status(201).json(await formatSession(session));
});

// GET /api/student/sessions/:sessionId
router.get("/student/sessions/:sessionId", requireStudent, async (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const [session] = await db.select().from(workoutSessionsTable).where(eq(workoutSessionsTable.id, sessionId));
  if (!session) return res.status(404).json({ error: "Sessão não encontrada" });
  const sets = await db.select().from(sessionSetsTable).where(eq(sessionSetsTable.sessionId, sessionId)).orderBy(asc(sessionSetsTable.recordedAt));
  const setsWithName = await Promise.all(sets.map(async (s) => {
    let exerciseName = "";
    if (s.dayExerciseId) {
      const [de] = await db.select().from(dayExercisesTable).where(eq(dayExercisesTable.id, s.dayExerciseId));
      if (de) {
        const [ex] = await db.select().from(exercisesTable).where(eq(exercisesTable.id, de.exerciseId));
        exerciseName = ex?.name ?? "";
      }
    }
    return { id: s.id, sessionId: s.sessionId, dayExerciseId: s.dayExerciseId ?? 0, exerciseName, setNumber: s.setNumber, repsDone: s.repsDone ?? 0, weightKg: parseFloat(String(s.weightKg ?? 0)), recordedAt: s.recordedAt.toISOString() };
  }));
  return res.json({ id: session.id, studentId: session.studentId, planDayId: session.planDayId ?? null, planDayName: null, startedAt: session.startedAt.toISOString(), finishedAt: session.finishedAt?.toISOString() ?? null, sets: setsWithName });
});

// PATCH /api/student/sessions/:sessionId
router.patch("/student/sessions/:sessionId", requireStudent, async (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const { finishedAt } = req.body;
  const [session] = await db.update(workoutSessionsTable).set({ finishedAt: new Date(finishedAt) }).where(eq(workoutSessionsTable.id, sessionId)).returning();
  if (!session) return res.status(404).json({ error: "Sessão não encontrada" });
  return res.json(await formatSession(session));
});

// POST /api/student/sessions/:sessionId/sets
router.post("/student/sessions/:sessionId/sets", requireStudent, async (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const { dayExerciseId, setNumber, repsDone, weightKg } = req.body;
  const [set] = await db
    .insert(sessionSetsTable)
    .values({ sessionId, dayExerciseId, setNumber, repsDone, weightKg: String(weightKg), recordedAt: new Date() })
    .returning();
  return res.status(201).json({
    id: set.id, sessionId: set.sessionId, dayExerciseId: set.dayExerciseId ?? 0, exerciseName: "",
    setNumber: set.setNumber, repsDone: set.repsDone ?? 0, weightKg: parseFloat(String(set.weightKg ?? 0)), recordedAt: set.recordedAt.toISOString(),
  });
});

export default router;
