import { pgTable, serial, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { profilesTable } from "./profiles";

export const workoutSessionsTable = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => profilesTable.id),
  planDayId: integer("plan_day_id"),
  startedAt: timestamp("started_at").notNull(),
  finishedAt: timestamp("finished_at"),
  syncedAt: timestamp("synced_at").defaultNow(),
});

export const sessionSetsTable = pgTable("session_sets", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => workoutSessionsTable.id),
  dayExerciseId: integer("day_exercise_id"),
  setNumber: integer("set_number").notNull(),
  repsDone: integer("reps_done"),
  weightKg: numeric("weight_kg", { precision: 6, scale: 2 }),
  recordedAt: timestamp("recorded_at").notNull(),
});

export type WorkoutSession = typeof workoutSessionsTable.$inferSelect;
export type SessionSet = typeof sessionSetsTable.$inferSelect;
