import { Router } from "express";
import { db } from "@workspace/db";
import { profilesTable, magicTokensTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { hashPassword, verifyPassword, generateMagicToken } from "../lib/auth";

const router = Router();

declare module "express-session" {
  interface SessionData {
    userId?: number;
    userRole?: string;
  }
}

// POST /api/auth/trainer/login
router.post("/auth/trainer/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  const [trainer] = await db
    .select()
    .from(profilesTable)
    .where(and(eq(profilesTable.email, email.toLowerCase()), eq(profilesTable.role, "trainer")));

  if (!trainer || !trainer.passwordHash) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const valid = await verifyPassword(password, trainer.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  req.session.userId = trainer.id;
  req.session.userRole = "trainer";

  return res.json({
    user: { id: trainer.id, role: trainer.role, fullName: trainer.fullName, email: trainer.email, avatarUrl: trainer.avatarUrl, createdAt: trainer.createdAt },
    role: "trainer",
    isFirstLogin: false,
  });
});

// POST /api/auth/trainer/register
router.post("/auth/trainer/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const existing = await db.select().from(profilesTable).where(eq(profilesTable.email, email.toLowerCase()));
  if (existing.length > 0) {
    return res.status(409).json({ error: "Email já cadastrado" });
  }

  const passwordHash = await hashPassword(password);
  const [trainer] = await db
    .insert(profilesTable)
    .values({ fullName, email: email.toLowerCase(), role: "trainer", passwordHash })
    .returning();

  req.session.userId = trainer.id;
  req.session.userRole = "trainer";

  return res.status(201).json({
    user: { id: trainer.id, role: trainer.role, fullName: trainer.fullName, email: trainer.email, avatarUrl: trainer.avatarUrl, createdAt: trainer.createdAt },
    role: "trainer",
    isFirstLogin: true,
  });
});

// POST /api/auth/student/magic
router.post("/auth/student/magic", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token obrigatório" });

  const now = new Date();
  const [magicToken] = await db
    .select()
    .from(magicTokensTable)
    .where(and(eq(magicTokensTable.token, token), gt(magicTokensTable.expiresAt, now)));

  if (!magicToken || magicToken.usedAt) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }

  const [user] = await db.select().from(profilesTable).where(eq(profilesTable.id, magicToken.userId));
  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

  // Mark token as used
  await db.update(magicTokensTable).set({ usedAt: now }).where(eq(magicTokensTable.id, magicToken.id));

  req.session.userId = user.id;
  req.session.userRole = "student";

  const isFirst = user.createdAt && (now.getTime() - new Date(user.createdAt).getTime()) < 60 * 60 * 1000 * 24;

  return res.json({
    user: { id: user.id, role: user.role, fullName: user.fullName, email: user.email, avatarUrl: user.avatarUrl, createdAt: user.createdAt },
    role: "student",
    isFirstLogin: Boolean(isFirst),
  });
});

// GET /api/auth/me
router.get("/auth/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  const [user] = await db.select().from(profilesTable).where(eq(profilesTable.id, req.session.userId));
  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

  return res.json({ id: user.id, role: user.role, fullName: user.fullName, email: user.email, avatarUrl: user.avatarUrl, createdAt: user.createdAt });
});

// POST /api/auth/logout
router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.log.error({ err }, "session destroy failed");
    }
    res.clearCookie("connect.sid");
    return res.json({ ok: true });
  });
});

export default router;
