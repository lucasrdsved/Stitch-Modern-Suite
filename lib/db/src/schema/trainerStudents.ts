import { pgTable, serial, integer, text, timestamp, unique } from "drizzle-orm/pg-core";
import { profilesTable } from "./profiles";

export const trainerStudentsTable = pgTable("trainer_students", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").notNull().references(() => profilesTable.id),
  studentId: integer("student_id").references(() => profilesTable.id),
  email: text("email").notNull(),
  status: text("status").notNull().default("invited"), // invited | active | inactive
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
}, (t) => [unique().on(t.trainerId, t.email)]);

export type TrainerStudent = typeof trainerStudentsTable.$inferSelect;
