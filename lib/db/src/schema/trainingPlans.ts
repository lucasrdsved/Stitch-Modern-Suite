import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { profilesTable } from "./profiles";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trainingPlansTable = pgTable("training_plans", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").notNull().references(() => profilesTable.id),
  studentId: integer("student_id").notNull().references(() => profilesTable.id),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const planDaysTable = pgTable("plan_days", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").notNull().references(() => trainingPlansTable.id),
  name: text("name").notNull(),
  dayOrder: integer("day_order").notNull(),
});

export const dayExercisesTable = pgTable("day_exercises", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id").notNull().references(() => planDaysTable.id),
  exerciseId: integer("exercise_id").notNull(),
  sets: integer("sets"),
  reps: text("reps"),
  restSeconds: integer("rest_seconds").default(60),
  notes: text("notes"),
  exerciseOrder: integer("exercise_order").notNull(),
});

export const insertPlanSchema = createInsertSchema(trainingPlansTable).omit({ id: true, createdAt: true });
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type TrainingPlan = typeof trainingPlansTable.$inferSelect;
export type PlanDay = typeof planDaysTable.$inferSelect;
export type DayExercise = typeof dayExercisesTable.$inferSelect;
