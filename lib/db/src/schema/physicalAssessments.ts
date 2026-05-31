import { pgTable, serial, integer, text, timestamp, numeric } from "drizzle-orm/pg-core";
import { profilesTable } from "./profiles";

export const physicalAssessmentsTable = pgTable("physical_assessments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => profilesTable.id),
  trainerId: integer("trainer_id").notNull().references(() => profilesTable.id),
  assessedAt: timestamp("assessed_at").defaultNow().notNull(),
  age: integer("age").notNull(),
  sex: text("sex").notNull(), // 'M' | 'F'
  weightKg: numeric("weight_kg", { precision: 5, scale: 2 }).notNull(),
  heightCm: numeric("height_cm", { precision: 5, scale: 1 }).notNull(),
  // Skinfolds (mm)
  skinfoldChest: numeric("skinfold_chest", { precision: 5, scale: 2 }),
  skinfoldAbdomen: numeric("skinfold_abdomen", { precision: 5, scale: 2 }),
  skinfoldThigh: numeric("skinfold_thigh", { precision: 5, scale: 2 }),
  skinfoldTriceps: numeric("skinfold_triceps", { precision: 5, scale: 2 }),
  skinfoldSubscapular: numeric("skinfold_subscapular", { precision: 5, scale: 2 }),
  skinfoldSuprailiac: numeric("skinfold_suprailiac", { precision: 5, scale: 2 }),
  skinfoldMidaxillary: numeric("skinfold_midaxillary", { precision: 5, scale: 2 }),
  // Circumferences (cm)
  circWaist: numeric("circ_waist", { precision: 5, scale: 1 }),
  circHip: numeric("circ_hip", { precision: 5, scale: 1 }),
  circChest: numeric("circ_chest", { precision: 5, scale: 1 }),
  circArmRelaxed: numeric("circ_arm_relaxed", { precision: 5, scale: 1 }),
  circArmContracted: numeric("circ_arm_contracted", { precision: 5, scale: 1 }),
  circThigh: numeric("circ_thigh", { precision: 5, scale: 1 }),
  circCalf: numeric("circ_calf", { precision: 5, scale: 1 }),
  // Calculated results
  bodyDensity: numeric("body_density", { precision: 7, scale: 6 }),
  bodyFatPct: numeric("body_fat_pct", { precision: 5, scale: 2 }),
  fatMassKg: numeric("fat_mass_kg", { precision: 5, scale: 2 }),
  leanMassKg: numeric("lean_mass_kg", { precision: 5, scale: 2 }),
  bmi: numeric("bmi", { precision: 5, scale: 2 }),
  waistHipRatio: numeric("waist_hip_ratio", { precision: 4, scale: 3 }),
  somatotype: text("somatotype"),
  trainingOrientation: text("training_orientation"), // JSON string
  notes: text("notes"),
});

export type PhysicalAssessment = typeof physicalAssessmentsTable.$inferSelect;
