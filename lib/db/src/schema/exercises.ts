import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { profilesTable } from "./profiles";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const exercisesTable = pgTable("exercises", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").references(() => profilesTable.id),
  name: text("name").notNull(),
  description: text("description"),
  muscleGroup: text("muscle_group"),
  equipment: text("equipment"),
  gifUrl: text("gif_url"),
  isGlobal: boolean("is_global").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertExerciseSchema = createInsertSchema(exercisesTable).omit({ id: true, createdAt: true });
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercisesTable.$inferSelect;
