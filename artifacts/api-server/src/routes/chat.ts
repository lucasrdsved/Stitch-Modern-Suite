import { Router } from "express";
import { db } from "@workspace/db";
import { conversationsTable, messagesTable, profilesTable } from "@workspace/db";
import { eq, and, desc, count, sql, or } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) return res.status(401).json({ error: "Não autorizado" });
  next();
}

// GET /api/conversations
router.get("/conversations", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const role = req.session.userRole;

  const convs = role === "trainer"
    ? await db.select().from(conversationsTable).where(eq(conversationsTable.trainerId, userId))
    : await db.select().from(conversationsTable).where(eq(conversationsTable.studentId, userId));

  const result = await Promise.all(convs.map(async (conv) => {
    const otherUserId = role === "trainer" ? conv.studentId : conv.trainerId;
    const [otherUser] = await db.select().from(profilesTable).where(eq(profilesTable.id, otherUserId));

    const [lastMsg] = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, conv.id))
      .orderBy(desc(messagesTable.sentAt))
      .limit(1);

    const [unreadRow] = await db
      .select({ cnt: count() })
      .from(messagesTable)
      .where(and(
        eq(messagesTable.conversationId, conv.id),
        sql`${messagesTable.readAt} IS NULL`,
        sql`${messagesTable.senderId} != ${userId}`,
      ));

    return {
      id: conv.id,
      type: conv.type,
      trainerId: conv.trainerId,
      name: null,
      otherUserName: otherUser?.fullName ?? "Usuário",
      otherUserAvatarUrl: otherUser?.avatarUrl ?? null,
      lastMessage: lastMsg?.content ?? null,
      lastMessageAt: lastMsg?.sentAt.toISOString() ?? null,
      unreadCount: Number(unreadRow?.cnt ?? 0),
      createdAt: conv.createdAt.toISOString(),
    };
  }));

  return res.json(result);
});

// POST /api/conversations
router.post("/conversations", requireAuth, async (req, res) => {
  if (req.session.userRole !== "trainer") return res.status(403).json({ error: "Apenas trainers podem criar conversas" });
  const trainerId = req.session.userId!;
  const { studentId } = req.body;
  if (!studentId) return res.status(400).json({ error: "studentId obrigatório" });

  // Find existing conversation
  const [existing] = await db
    .select()
    .from(conversationsTable)
    .where(and(eq(conversationsTable.trainerId, trainerId), eq(conversationsTable.studentId, studentId)));

  if (existing) {
    const [student] = await db.select().from(profilesTable).where(eq(profilesTable.id, studentId));
    return res.json({ id: existing.id, type: existing.type, trainerId: existing.trainerId, name: null, otherUserName: student?.fullName ?? "", otherUserAvatarUrl: null, lastMessage: null, lastMessageAt: null, unreadCount: 0, createdAt: existing.createdAt.toISOString() });
  }

  const [conv] = await db.insert(conversationsTable).values({ trainerId, studentId, type: "direct" }).returning();
  const [student] = await db.select().from(profilesTable).where(eq(profilesTable.id, studentId));

  return res.status(201).json({ id: conv.id, type: conv.type, trainerId: conv.trainerId, name: null, otherUserName: student?.fullName ?? "", otherUserAvatarUrl: null, lastMessage: null, lastMessageAt: null, unreadCount: 0, createdAt: conv.createdAt.toISOString() });
});

// GET /api/conversations/:conversationId/messages
router.get("/conversations/:conversationId/messages", requireAuth, async (req, res) => {
  const convId = parseInt(req.params.conversationId);
  const userId = req.session.userId!;

  const msgs = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, convId))
    .orderBy(desc(messagesTable.sentAt))
    .limit(100);

  // Mark messages as read
  await db
    .update(messagesTable)
    .set({ readAt: new Date() })
    .where(and(eq(messagesTable.conversationId, convId), sql`${messagesTable.senderId} != ${userId}`, sql`${messagesTable.readAt} IS NULL`));

  const result = await Promise.all(msgs.reverse().map(async (m) => {
    const [sender] = await db.select().from(profilesTable).where(eq(profilesTable.id, m.senderId));
    return { id: m.id, conversationId: m.conversationId, senderId: m.senderId, senderName: sender?.fullName ?? "", content: m.content, sentAt: m.sentAt.toISOString(), readAt: m.readAt?.toISOString() ?? null };
  }));

  return res.json(result);
});

// POST /api/conversations/:conversationId/messages
router.post("/conversations/:conversationId/messages", requireAuth, async (req, res) => {
  const convId = parseInt(req.params.conversationId);
  const senderId = req.session.userId!;
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "content obrigatório" });

  const [msg] = await db.insert(messagesTable).values({ conversationId: convId, senderId, content, sentAt: new Date() }).returning();
  const [sender] = await db.select().from(profilesTable).where(eq(profilesTable.id, senderId));

  return res.status(201).json({ id: msg.id, conversationId: msg.conversationId, senderId: msg.senderId, senderName: sender?.fullName ?? "", content: msg.content, sentAt: msg.sentAt.toISOString(), readAt: null });
});

export default router;
