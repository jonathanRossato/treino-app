import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, workouts, exercises, progressPhotos, workoutTemplates, templateExercises, cardioSessions, exerciseLibrary, userCustomExercises, InsertWorkout, InsertExercise, InsertProgressPhoto, InsertWorkoutTemplate, InsertTemplateExercise, InsertCardioSession, InsertExerciseLibrary, InsertUserCustomExercise } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Workout helpers
export async function createWorkout(workout: InsertWorkout) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(workouts).values(workout);
  return result;
}

export async function getWorkoutsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(workouts).where(eq(workouts.userId, userId)).orderBy(desc(workouts.date));
}

export async function getWorkoutById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(workouts).where(eq(workouts.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateWorkout(id: number, data: Partial<InsertWorkout>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(workouts).set(data).where(eq(workouts.id, id));
}

export async function deleteWorkout(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete exercises first (cascade)
  await db.delete(exercises).where(eq(exercises.workoutId, id));
  // Then delete workout
  return await db.delete(workouts).where(eq(workouts.id, id));
}

// Exercise helpers
export async function createExercise(exercise: InsertExercise) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(exercises).values(exercise);
}

export async function getExercisesByWorkoutId(workoutId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(exercises).where(eq(exercises.workoutId, workoutId));
}

export async function updateExercise(id: number, data: Partial<InsertExercise>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(exercises).set(data).where(eq(exercises.id, id));
}

export async function deleteExercise(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(exercises).where(eq(exercises.id, id));
}

// Progress Photos helpers
export async function createProgressPhoto(photo: InsertProgressPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(progressPhotos).values(photo);
}

export async function getProgressPhotosByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(progressPhotos).where(eq(progressPhotos.userId, userId)).orderBy(desc(progressPhotos.date));
}

export async function deleteProgressPhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(progressPhotos).where(eq(progressPhotos.id, id));
}

// Workout Templates helpers
export async function createWorkoutTemplate(template: InsertWorkoutTemplate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(workoutTemplates).values(template);
}

export async function getWorkoutTemplatesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(workoutTemplates).where(eq(workoutTemplates.userId, userId)).orderBy(desc(workoutTemplates.createdAt));
}

export async function getWorkoutTemplateById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(workoutTemplates).where(eq(workoutTemplates.id, id));
  return result[0] || null;
}

export async function updateWorkoutTemplate(id: number, data: Partial<InsertWorkoutTemplate>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(workoutTemplates).set(data).where(eq(workoutTemplates.id, id));
}

export async function deleteWorkoutTemplate(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete associated exercises first
  await db.delete(templateExercises).where(eq(templateExercises.templateId, id));
  
  return await db.delete(workoutTemplates).where(eq(workoutTemplates.id, id));
}

// Template Exercises helpers
export async function createTemplateExercise(exercise: InsertTemplateExercise) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(templateExercises).values(exercise);
}

export async function getTemplateExercisesByTemplateId(templateId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(templateExercises).where(eq(templateExercises.templateId, templateId)).orderBy(templateExercises.order);
}

export async function updateTemplateExercise(id: number, data: Partial<InsertTemplateExercise>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(templateExercises).set(data).where(eq(templateExercises.id, id));
}

export async function deleteTemplateExercise(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(templateExercises).where(eq(templateExercises.id, id));
}

// Cardio Sessions helpers
export async function createCardioSession(session: InsertCardioSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(cardioSessions).values(session);
}

export async function getCardioSessionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(cardioSessions).where(eq(cardioSessions.userId, userId)).orderBy(desc(cardioSessions.date));
}

export async function getCardioSessionsByWorkoutId(workoutId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(cardioSessions).where(eq(cardioSessions.workoutId, workoutId));
}

export async function deleteCardioSession(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(cardioSessions).where(eq(cardioSessions.id, id));
}

// Exercise Library helpers
export async function getAllExercisesFromLibrary() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(exerciseLibrary).where(eq(exerciseLibrary.isGlobal, 1));
}

export async function getExercisesByMuscleGroup(muscleGroup: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(exerciseLibrary).where(
    and(
      eq(exerciseLibrary.isGlobal, 1),
      eq(exerciseLibrary.muscleGroup, muscleGroup)
    )
  );
}

// User Custom Exercises helpers
export async function createUserCustomExercise(exercise: InsertUserCustomExercise) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(userCustomExercises).values(exercise);
}

export async function getUserCustomExercises(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userCustomExercises).where(eq(userCustomExercises.userId, userId));
}

export async function updateUserCustomExercise(exercise: Partial<InsertUserCustomExercise> & { id: number; userId: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { id, userId, ...updateData } = exercise;
  
  // Only update fields that are provided
  const fieldsToUpdate: any = {};
  if (updateData.name !== undefined) fieldsToUpdate.name = updateData.name;
  if (updateData.muscleGroup !== undefined) fieldsToUpdate.muscleGroup = updateData.muscleGroup;
  if (updateData.equipment !== undefined) fieldsToUpdate.equipment = updateData.equipment;
  if (updateData.difficulty !== undefined) fieldsToUpdate.difficulty = updateData.difficulty;
  if (updateData.mediaUrl !== undefined) fieldsToUpdate.mediaUrl = updateData.mediaUrl;
  if (updateData.mediaType !== undefined) fieldsToUpdate.mediaType = updateData.mediaType;
  if (updateData.description !== undefined) fieldsToUpdate.description = updateData.description;
  
  return await db.update(userCustomExercises)
    .set(fieldsToUpdate)
    .where(
      and(
        eq(userCustomExercises.id, id),
        eq(userCustomExercises.userId, userId)
      )
    );
}

export async function deleteUserCustomExercise(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(userCustomExercises).where(
    and(
      eq(userCustomExercises.id, id),
      eq(userCustomExercises.userId, userId)
    )
  );
}
