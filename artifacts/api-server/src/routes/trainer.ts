import { Router } from "express";
import { db } from "@workspace/db";
import {
  profilesTable,
  trainerStudentsTable,
  physicalAssessmentsTable,
  trainingPlansTable,
  workoutSessionsTable,
  sessionSetsTable,
  messagesTable,
  conversationsTable,
  magicTokensTable,
} from "@workspace/db";
import { eq, and, desc, sql, count, gte, lt, or } from "drizzle-orm";
import { calcBodyComposition, generateOrientation } from "../lib/calculations";
import { generateMagicToken } from "../lib/auth";
import { hashPassword } from "../lib/auth";

const router = Router();

function requireTrainer(req: any, res: any, next: any) {
  if (!req.session.userId || req.session.userRole !== "trainer") {
    return res.status(401).json({ error: "Não autorizado" });
  }
  next();
}

// GET /api/trainer/dashboard
router.get("/trainer/dashboard", requireTrainer, async (req, res) => {
  const trainerId = req.session.userId!;

  const students = await db
    .select()
    .from(trainerStudentsTable)
    .where(eq(trainerStudentsTable.trainerId, trainerId));

  const activeStudents = students.filter((s) => s.status === "active");
  const studentIds = activeStudents.map((s) => s.studentId).filter(Boolean) as number[];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let sessionsToday = 0;
  if (studentIds.length > 0) {
    const sessions = await db
      .select()
      .from(workoutSessionsTable)
      .where(
        and(
          gte(workoutSessionsTable.startedAt, today),
          lt(workoutSessionsTable.startedAt, tomorrow),
        ),
      );
    sessionsToday = sessions.length;
  }

  // Unread messages in conversations with this trainer
  const convs = await db.select().from(conversationsTable).where(eq(conversationsTable.trainerId, trainerId));
  let unreadMessages = 0;
  for (const conv of convs) {
    const unread = await db
      .select({ cnt: count() })
      .from(messagesTable)
      .where(and(eq(messagesTable.conversationId, conv.id), sql`${messagesTable.readAt} IS NULL`, sql`${messagesTable.senderId} != ${trainerId}`));
    unreadMessages += Number(unread[0]?.cnt ?? 0);
  }

  // Recent activity
  const recentActivity: any[] = [];

  return res.json({
    totalStudents: students.length,
    activeStudents: activeStudents.length,
    sessionsToday,
    unreadMessages,
    recentActivity,
  });
});

// GET /api/trainer/students
router.get("/trainer/students", requireTrainer, async (req, res) => {
  const trainerId = req.session.userId!;
  const { search, status } = req.query as { search?: string; status?: string };

  const links = await db
    .select()
    .from(trainerStudentsTable)
    .where(eq(trainerStudentsTable.trainerId, trainerId))
    .orderBy(desc(trainerStudentsTable.invitedAt));

  const result = [];
  for (const link of links) {
    if (status && link.status !== status) continue;

    let profile: any = null;
    if (link.studentId) {
      const [p] = await db.select().from(profilesTable).where(eq(profilesTable.id, link.studentId));
      profile = p;
    }

    const fullName = profile?.fullName ?? link.email;
    if (search && !fullName.toLowerCase().includes(search.toLowerCase()) && !link.email.toLowerCase().includes(search.toLowerCase())) continue;

    let lastSessionAt: string | null = null;
    let somatotype: string | null = null;
    let bodyFatPct: number | null = null;

    if (link.studentId) {
      const [lastSession] = await db
        .select()
        .from(workoutSessionsTable)
        .where(eq(workoutSessionsTable.studentId, link.studentId))
        .orderBy(desc(workoutSessionsTable.startedAt))
        .limit(1);
      lastSessionAt = lastSession?.startedAt?.toISOString() ?? null;

      const [latestAssessment] = await db
        .select()
        .from(physicalAssessmentsTable)
        .where(eq(physicalAssessmentsTable.studentId, link.studentId))
        .orderBy(desc(physicalAssessmentsTable.assessedAt))
        .limit(1);
      somatotype = latestAssessment?.somatotype ?? null;
      bodyFatPct = latestAssessment?.bodyFatPct ? parseFloat(String(latestAssessment.bodyFatPct)) : null;
    }

    result.push({
      id: link.studentId ?? 0,
      fullName,
      email: link.email,
      avatarUrl: profile?.avatarUrl ?? null,
      status: link.status,
      lastSessionAt,
      somatotype,
      bodyFatPct,
    });
  }

  return res.json(result);
});

// GET /api/trainer/students/:studentId
router.get("/trainer/students/:studentId", requireTrainer, async (req, res) => {
  const trainerId = req.session.userId!;
  const studentId = parseInt(req.params.studentId);

  const [link] = await db
    .select()
    .from(trainerStudentsTable)
    .where(and(eq(trainerStudentsTable.trainerId, trainerId), eq(trainerStudentsTable.studentId, studentId)));
  if (!link) return res.status(404).json({ error: "Aluno não encontrado" });

  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.id, studentId));
  if (!profile) return res.status(404).json({ error: "Perfil não encontrado" });

  const [latestAssessment] = await db
    .select()
    .from(physicalAssessmentsTable)
    .where(eq(physicalAssessmentsTable.studentId, studentId))
    .orderBy(desc(physicalAssessmentsTable.assessedAt))
    .limit(1);

  const [activePlan] = await db
    .select()
    .from(trainingPlansTable)
    .where(and(eq(trainingPlansTable.studentId, studentId), eq(trainingPlansTable.isActive, true)))
    .limit(1);

  const recentSessions = await db
    .select()
    .from(workoutSessionsTable)
    .where(eq(workoutSessionsTable.studentId, studentId))
    .orderBy(desc(workoutSessionsTable.startedAt))
    .limit(5);

  const allSessions = await db.select({ cnt: count() }).from(workoutSessionsTable).where(eq(workoutSessionsTable.studentId, studentId));

  const formatSession = (s: any) => ({
    id: s.id,
    studentId: s.studentId,
    planDayId: s.planDayId ?? null,
    planDayName: null,
    startedAt: s.startedAt.toISOString(),
    finishedAt: s.finishedAt?.toISOString() ?? null,
    totalSets: 0,
    totalVolumeKg: 0,
    durationMinutes: s.finishedAt ? Math.round((s.finishedAt.getTime() - s.startedAt.getTime()) / 60000) : null,
  });

  const formatAssessment = (a: any) => a ? {
    id: a.id, studentId: a.studentId, trainerId: a.trainerId,
    assessedAt: a.assessedAt.toISOString(),
    age: a.age, sex: a.sex,
    weightKg: parseFloat(a.weightKg), heightCm: parseFloat(a.heightCm),
    bmi: a.bmi ? parseFloat(a.bmi) : null,
    bodyFatPct: a.bodyFatPct ? parseFloat(a.bodyFatPct) : null,
    fatMassKg: a.fatMassKg ? parseFloat(a.fatMassKg) : null,
    leanMassKg: a.leanMassKg ? parseFloat(a.leanMassKg) : null,
    waistHipRatio: a.waistHipRatio ? parseFloat(a.waistHipRatio) : null,
    somatotype: a.somatotype ?? null,
    trainingOrientation: a.trainingOrientation ? JSON.parse(a.trainingOrientation) : null,
    skinfoldChest: a.skinfoldChest ? parseFloat(a.skinfoldChest) : null,
    skinfoldAbdomen: a.skinfoldAbdomen ? parseFloat(a.skinfoldAbdomen) : null,
    skinfoldThigh: a.skinfoldThigh ? parseFloat(a.skinfoldThigh) : null,
    skinfoldTriceps: a.skinfoldTriceps ? parseFloat(a.skinfoldTriceps) : null,
    skinfoldSubscapular: a.skinfoldSubscapular ? parseFloat(a.skinfoldSubscapular) : null,
    skinfoldSuprailiac: a.skinfoldSuprailiac ? parseFloat(a.skinfoldSuprailiac) : null,
    skinfoldMidaxillary: a.skinfoldMidaxillary ? parseFloat(a.skinfoldMidaxillary) : null,
    circWaist: a.circWaist ? parseFloat(a.circWaist) : null,
    circHip: a.circHip ? parseFloat(a.circHip) : null,
    notes: a.notes ?? null,
  } : null;

  return res.json({
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    avatarUrl: profile.avatarUrl,
    status: link.status,
    activePlan: activePlan ? { id: activePlan.id, trainerId: activePlan.trainerId, studentId: activePlan.studentId, name: activePlan.name, isActive: activePlan.isActive, createdAt: activePlan.createdAt.toISOString(), studentName: profile.fullName } : null,
    latestAssessment: formatAssessment(latestAssessment),
    recentSessions: recentSessions.map(formatSession),
    totalSessions: Number(allSessions[0]?.cnt ?? 0),
  });
});

// POST /api/trainer/assessments
router.post("/trainer/assessments", requireTrainer, async (req, res) => {
  const trainerId = req.session.userId!;
  const body = req.body;

  const { fullName, email, sex, birthDate, weightKg, heightCm, notes, ...skinfolds } = body;

  if (!fullName || !email || !sex || !birthDate || !weightKg || !heightCm) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  // Calculate age from birthDate
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
    age--;
  }

  // Find or create student
  let [student] = await db.select().from(profilesTable).where(eq(profilesTable.email, email.toLowerCase()));
  let isNewStudent = false;

  if (!student) {
    isNewStudent = true;
    const [newStudent] = await db
      .insert(profilesTable)
      .values({ fullName, email: email.toLowerCase(), role: "student" })
      .returning();
    student = newStudent;

    // Create magic token for first login
    const token = generateMagicToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await db.insert(magicTokensTable).values({ userId: student.id, token, expiresAt });

    // Link trainer-student
    await db.insert(trainerStudentsTable).values({ trainerId, studentId: student.id, email: email.toLowerCase(), status: "invited" }).onConflictDoUpdate({
      target: [trainerStudentsTable.trainerId, trainerStudentsTable.email],
      set: { studentId: student.id, status: "invited" },
    });
  } else {
    // Update link if student exists
    const existing = await db.select().from(trainerStudentsTable).where(and(eq(trainerStudentsTable.trainerId, trainerId), eq(trainerStudentsTable.email, email.toLowerCase())));
    if (existing.length === 0) {
      await db.insert(trainerStudentsTable).values({ trainerId, studentId: student.id, email: email.toLowerCase(), status: "active" });
    }
  }

  // Calculate body composition
  const comp = calcBodyComposition({
    age, sex, weightKg: parseFloat(weightKg), heightCm: parseFloat(heightCm),
    skinfoldChest: skinfolds.skinfoldChest ? parseFloat(skinfolds.skinfoldChest) : null,
    skinfoldAbdomen: skinfolds.skinfoldAbdomen ? parseFloat(skinfolds.skinfoldAbdomen) : null,
    skinfoldThigh: skinfolds.skinfoldThigh ? parseFloat(skinfolds.skinfoldThigh) : null,
    skinfoldTriceps: skinfolds.skinfoldTriceps ? parseFloat(skinfolds.skinfoldTriceps) : null,
    skinfoldSubscapular: skinfolds.skinfoldSubscapular ? parseFloat(skinfolds.skinfoldSubscapular) : null,
    skinfoldSuprailiac: skinfolds.skinfoldSuprailiac ? parseFloat(skinfolds.skinfoldSuprailiac) : null,
    skinfoldMidaxillary: skinfolds.skinfoldMidaxillary ? parseFloat(skinfolds.skinfoldMidaxillary) : null,
    circWaist: skinfolds.circWaist ? parseFloat(skinfolds.circWaist) : null,
    circHip: skinfolds.circHip ? parseFloat(skinfolds.circHip) : null,
  });

  const orientation = generateOrientation(comp.somatotype, sex);

  const [assessment] = await db
    .insert(physicalAssessmentsTable)
    .values({
      studentId: student.id,
      trainerId,
      age,
      sex,
      weightKg: String(weightKg),
      heightCm: String(heightCm),
      skinfoldChest: skinfolds.skinfoldChest ? String(skinfolds.skinfoldChest) : null,
      skinfoldAbdomen: skinfolds.skinfoldAbdomen ? String(skinfolds.skinfoldAbdomen) : null,
      skinfoldThigh: skinfolds.skinfoldThigh ? String(skinfolds.skinfoldThigh) : null,
      skinfoldTriceps: skinfolds.skinfoldTriceps ? String(skinfolds.skinfoldTriceps) : null,
      skinfoldSubscapular: skinfolds.skinfoldSubscapular ? String(skinfolds.skinfoldSubscapular) : null,
      skinfoldSuprailiac: skinfolds.skinfoldSuprailiac ? String(skinfolds.skinfoldSuprailiac) : null,
      skinfoldMidaxillary: skinfolds.skinfoldMidaxillary ? String(skinfolds.skinfoldMidaxillary) : null,
      circWaist: skinfolds.circWaist ? String(skinfolds.circWaist) : null,
      circHip: skinfolds.circHip ? String(skinfolds.circHip) : null,
      circChest: skinfolds.circChest ? String(skinfolds.circChest) : null,
      circArmRelaxed: skinfolds.circArmRelaxed ? String(skinfolds.circArmRelaxed) : null,
      circArmContracted: skinfolds.circArmContracted ? String(skinfolds.circArmContracted) : null,
      circThigh: skinfolds.circThigh ? String(skinfolds.circThigh) : null,
      circCalf: skinfolds.circCalf ? String(skinfolds.circCalf) : null,
      bodyDensity: String(comp.bodyDensity),
      bodyFatPct: String(comp.bodyFatPct),
      fatMassKg: String(comp.fatMassKg),
      leanMassKg: String(comp.leanMassKg),
      bmi: String(comp.bmi),
      waistHipRatio: comp.waistHipRatio ? String(comp.waistHipRatio) : null,
      somatotype: comp.somatotype,
      trainingOrientation: JSON.stringify(orientation),
      notes: notes ?? null,
    })
    .returning();

  return res.status(201).json({
    assessment: {
      id: assessment.id,
      studentId: assessment.studentId,
      trainerId: assessment.trainerId,
      assessedAt: assessment.assessedAt.toISOString(),
      age: assessment.age,
      sex: assessment.sex,
      weightKg: parseFloat(String(assessment.weightKg)),
      heightCm: parseFloat(String(assessment.heightCm)),
      bmi: parseFloat(String(assessment.bmi)),
      bodyFatPct: parseFloat(String(assessment.bodyFatPct)),
      fatMassKg: parseFloat(String(assessment.fatMassKg)),
      leanMassKg: parseFloat(String(assessment.leanMassKg)),
      waistHipRatio: assessment.waistHipRatio ? parseFloat(String(assessment.waistHipRatio)) : null,
      somatotype: assessment.somatotype,
      trainingOrientation: orientation,
      notes: assessment.notes,
    },
    studentId: student.id,
    isNewStudent,
  });
});

// GET /api/trainer/students/:studentId/assessments
router.get("/trainer/students/:studentId/assessments", requireTrainer, async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const assessments = await db
    .select()
    .from(physicalAssessmentsTable)
    .where(eq(physicalAssessmentsTable.studentId, studentId))
    .orderBy(desc(physicalAssessmentsTable.assessedAt));

  return res.json(assessments.map((a) => ({
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
  })));
});

export default router;
