import {
  MOCK_ASSESSMENT,
  MOCK_CONVERSATIONS,
  MOCK_EXERCISES,
  MOCK_MESSAGES,
  MOCK_PLAN,
  MOCK_SESSIONS,
  MOCK_STUDENT_DETAIL,
  MOCK_STUDENT_TODAY,
  MOCK_STUDENTS,
  MOCK_TRAINER_DASHBOARD,
} from "@/lib/mock-data";

type StorageKey =
  | "auth"
  | "studentOnboarded"
  | "studentToday"
  | "sessions"
  | "assessment"
  | "students"
  | "studentDetail"
  | "trainerDashboard"
  | "exercises"
  | "plans"
  | "conversations"
  | "messagesByConversation";

const STORAGE_VERSION = "v1";

function key(k: StorageKey) {
  return `trainflow:${STORAGE_VERSION}:${k}`;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function read<T>(k: StorageKey): T | null {
  return safeParse<T>(localStorage.getItem(key(k)));
}

function write<T>(k: StorageKey, value: T) {
  localStorage.setItem(key(k), JSON.stringify(value));
}

function initIfMissing<T>(k: StorageKey, seed: T): T {
  const existing = read<T>(k);
  if (existing) return existing;
  const cloned = structuredClone(seed);
  write(k, cloned);
  return cloned;
}

export function resetMockStore() {
  write("studentToday", structuredClone(MOCK_STUDENT_TODAY));
  write("sessions", structuredClone(MOCK_SESSIONS));
  write("assessment", structuredClone(MOCK_ASSESSMENT));
  write("students", structuredClone(MOCK_STUDENTS));
  write("studentDetail", structuredClone(MOCK_STUDENT_DETAIL));
  write("trainerDashboard", structuredClone(MOCK_TRAINER_DASHBOARD));
  write("exercises", structuredClone(MOCK_EXERCISES));
  write("plans", structuredClone([MOCK_PLAN]));
  write("conversations", structuredClone(MOCK_CONVERSATIONS));
  write("messagesByConversation", structuredClone({ 1: MOCK_MESSAGES }));
}

export function ensureMockStore() {
  initIfMissing("studentToday", MOCK_STUDENT_TODAY);
  initIfMissing("sessions", MOCK_SESSIONS);
  initIfMissing("assessment", MOCK_ASSESSMENT);
  initIfMissing("students", MOCK_STUDENTS);
  initIfMissing("studentDetail", MOCK_STUDENT_DETAIL);
  initIfMissing("trainerDashboard", MOCK_TRAINER_DASHBOARD);
  initIfMissing("exercises", MOCK_EXERCISES);
  initIfMissing("plans", [MOCK_PLAN]);
  initIfMissing("conversations", MOCK_CONVERSATIONS);
  initIfMissing("messagesByConversation", { 1: MOCK_MESSAGES });
}

export type AuthUser = {
  id: number;
  role: "trainer" | "student";
  fullName: string;
  email: string;
  avatarUrl?: string | null;
};

export function getAuthUser(): AuthUser | null {
  return read<AuthUser>("auth");
}

export function setAuthUser(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(key("auth"));
    return;
  }
  write("auth", user);
}

export function isStudentOnboarded() {
  return localStorage.getItem(key("studentOnboarded")) === "1";
}

export function setStudentOnboarded() {
  localStorage.setItem(key("studentOnboarded"), "1");
}

export function getStudentToday() {
  return initIfMissing("studentToday", MOCK_STUDENT_TODAY);
}

export function getSessions() {
  return initIfMissing("sessions", MOCK_SESSIONS);
}

export function addSession(session: any) {
  const sessions = getSessions();
  const next = [session, ...sessions];
  write("sessions", next);
  return next;
}

export function getLatestAssessment() {
  return initIfMissing("assessment", MOCK_ASSESSMENT);
}

export function setLatestAssessment(assessment: any) {
  write("assessment", assessment);
}

export function listStudents() {
  return initIfMissing("students", MOCK_STUDENTS);
}

export function getStudentById(id: number) {
  const list = listStudents();
  const found = list.find((s: any) => s.id === id);
  return found || initIfMissing("studentDetail", MOCK_STUDENT_DETAIL);
}

export function getTrainerDashboard() {
  return initIfMissing("trainerDashboard", MOCK_TRAINER_DASHBOARD);
}

export function listExercises() {
  return initIfMissing("exercises", MOCK_EXERCISES);
}

export function listPlans() {
  return initIfMissing("plans", [MOCK_PLAN]);
}

export function createPlan(plan: any) {
  const plans = listPlans();
  const id = Math.max(0, ...plans.map((p: any) => p.id || 0)) + 1;
  const next = [{ ...plan, id }, ...plans];
  write("plans", next);
  return next[0];
}

export function updatePlan(planId: number, updater: (plan: any) => any) {
  const plans = listPlans();
  const idx = plans.findIndex((p: any) => p.id === planId);
  if (idx === -1) return null;
  const updated = updater(plans[idx]);
  const next = [...plans];
  next[idx] = updated;
  write("plans", next);
  return updated;
}

export function getPlanById(id: number) {
  return listPlans().find((p: any) => p.id === id) || null;
}

export function listConversations() {
  return initIfMissing("conversations", MOCK_CONVERSATIONS);
}

export function listMessages(conversationId: number) {
  const map = initIfMissing<Record<string, any[]>>("messagesByConversation", { 1: MOCK_MESSAGES });
  return map[String(conversationId)] || [];
}

export function appendMessage(conversationId: number, message: any) {
  const map = initIfMissing<Record<string, any[]>>("messagesByConversation", { 1: MOCK_MESSAGES });
  const existing = map[String(conversationId)] || [];
  const nextMessages = [...existing, message];
  const nextMap = { ...map, [String(conversationId)]: nextMessages };
  write("messagesByConversation", nextMap);

  const conversations = listConversations();
  const nextConversations = conversations
    .map((c: any) =>
      c.id === conversationId
        ? {
            ...c,
            lastMessage: message.content,
            updatedAt: message.sentAt,
            lastMessageTime: new Date(message.sentAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          }
        : c
    )
    .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  write("conversations", nextConversations);

  return nextMessages;
}
