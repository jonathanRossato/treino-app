import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Workout sessions - represents a workout day
 */
export const workouts = mysqlTable("workouts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Treino A - Peito e Tríceps"
  date: timestamp("date").notNull(), // When the workout was performed
  notes: text("notes"), // General notes about the workout
  duration: int("duration"), // Duration in minutes
  sleepHours: int("sleepHours"), // Hours of sleep before workout
  avgHeartRate: int("avgHeartRate"), // Average heart rate during workout
  caloriesBurned: int("caloriesBurned"), // Total calories burned
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = typeof workouts.$inferInsert;

/**
 * Exercises within a workout
 */
export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  workoutId: int("workoutId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Supino Reto"
  sets: int("sets").notNull(), // Number of sets
  reps: int("reps").notNull(), // Number of reps
  weight: int("weight").notNull(), // Weight in kg (stored as integer to avoid decimal issues)
  completed: int("completed").default(0).notNull(), // 0 = false, 1 = true (MySQL doesn't have boolean)
  notes: text("notes"), // Exercise-specific notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

/**
 * Progress photos for tracking physical evolution
 */
export const progressPhotos = mysqlTable("progressPhotos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(), // S3 file key
  url: varchar("url", { length: 1024 }).notNull(), // S3 URL
  pose: mysqlEnum("pose", ["front", "back", "side"]).notNull(), // Photo angle
  week: int("week").notNull(), // Week number for tracking
  date: timestamp("date").notNull(), // When the photo was taken
  notes: text("notes"), // Optional notes about the photo
  // Body measurements (all optional, in cm except weight in kg)
  weight: int("weight"), // Weight in kg
  chest: int("chest"), // Chest circumference in cm
  waist: int("waist"), // Waist circumference in cm
  hips: int("hips"), // Hips circumference in cm
  leftArm: int("leftArm"), // Left arm circumference in cm
  rightArm: int("rightArm"), // Right arm circumference in cm
  leftThigh: int("leftThigh"), // Left thigh circumference in cm
  rightThigh: int("rightThigh"), // Right thigh circumference in cm
  leftCalf: int("leftCalf"), // Left calf circumference in cm
  rightCalf: int("rightCalf"), // Right calf circumference in cm
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProgressPhoto = typeof progressPhotos.$inferSelect;
export type InsertProgressPhoto = typeof progressPhotos.$inferInsert;

/**
 * Workout templates - reusable workout structures
 */
export const workoutTemplates = mysqlTable("workoutTemplates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Treino A - Peito e Tríceps"
  description: text("description"), // Optional description
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WorkoutTemplate = typeof workoutTemplates.$inferSelect;
export type InsertWorkoutTemplate = typeof workoutTemplates.$inferInsert;

/**
 * Template exercises - exercises within a template
 */
export const templateExercises = mysqlTable("templateExercises", {
  id: int("id").autoincrement().primaryKey(),
  templateId: int("templateId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Supino Reto"
  sets: int("sets").notNull(), // Number of sets
  reps: int("reps").notNull(), // Number of reps
  weight: int("weight").notNull(), // Default weight in kg
  notes: text("notes"), // Exercise-specific notes
  order: int("order").notNull(), // Order of exercise in template
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TemplateExercise = typeof templateExercises.$inferSelect;
export type InsertTemplateExercise = typeof templateExercises.$inferInsert;

/**
 * Cardio sessions - can be part of a workout or standalone
 */
export const cardioSessions = mysqlTable("cardioSessions", {
  id: int("id").autoincrement().primaryKey(),
  workoutId: int("workoutId"), // Optional - if part of a workout
  userId: int("userId").notNull(),
  type: varchar("type", { length: 100 }).notNull(), // e.g., "Corrida", "Bicicleta", "Esteira"
  duration: int("duration").notNull(), // Duration in minutes
  distance: int("distance"), // Distance in meters (optional)
  avgHeartRate: int("avgHeartRate"), // Average heart rate
  pace: int("pace"), // Pace in seconds per km (optional)
  caloriesBurned: int("caloriesBurned"), // Calories burned
  date: timestamp("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CardioSession = typeof cardioSessions.$inferSelect;
export type InsertCardioSession = typeof cardioSessions.$inferInsert;

/**
 * Exercise library - pre-defined exercises with media
 */
export const exerciseLibrary = mysqlTable("exerciseLibrary", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Supino Reto"
  muscleGroup: varchar("muscleGroup", { length: 100 }).notNull(), // e.g., "Peito", "Costas", "Pernas"
  equipment: varchar("equipment", { length: 100 }), // e.g., "Barra", "Halteres", "Máquina"
  difficulty: mysqlEnum("difficulty", ["iniciante", "intermediario", "avancado"]).default("intermediario"),
  mediaUrl: text("mediaUrl").notNull(), // URL to GIF/image (local or S3)
  mediaType: mysqlEnum("mediaType", ["gif", "image"]).default("gif"),
  description: text("description"), // How to perform the exercise
  isGlobal: int("isGlobal").default(1).notNull(), // 1 = pre-defined, 0 = user custom
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExerciseLibrary = typeof exerciseLibrary.$inferSelect;
export type InsertExerciseLibrary = typeof exerciseLibrary.$inferInsert;

/**
 * User custom exercises - exercises created by users
 */
export const userCustomExercises = mysqlTable("userCustomExercises", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  muscleGroup: varchar("muscleGroup", { length: 100 }).notNull(),
  equipment: varchar("equipment", { length: 100 }),
  difficulty: mysqlEnum("difficulty", ["iniciante", "intermediario", "avancado"]).default("intermediario"),
  mediaUrl: text("mediaUrl"), // Optional - user uploaded image/GIF
  mediaType: mysqlEnum("mediaType", ["gif", "image"]).default("image"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserCustomExercise = typeof userCustomExercises.$inferSelect;
export type InsertUserCustomExercise = typeof userCustomExercises.$inferInsert;
