import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  workouts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const workouts = await db.getWorkoutsByUserId(ctx.user.id);
      // Include exercises for each workout
      const workoutsWithExercises = await Promise.all(
        workouts.map(async (workout) => {
          const exercises = await db.getExercisesByWorkoutId(workout.id);
          return { ...workout, exercises };
        })
      );
      return workoutsWithExercises;
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const workout = await db.getWorkoutById(input.id);
        if (!workout) throw new Error("Workout not found");
        
        const exercises = await db.getExercisesByWorkoutId(input.id);
        return { ...workout, exercises };
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        date: z.date(),
        notes: z.string().optional(),
        duration: z.number().optional(),
        sleepHours: z.number().optional(),
        avgHeartRate: z.number().optional(),
        caloriesBurned: z.number().optional(),
        exercises: z.array(z.object({
          name: z.string(),
          sets: z.number(),
          reps: z.number(),
          weight: z.number(),
          notes: z.string().optional(),
        })),
        cardio: z.object({
          type: z.string(),
          duration: z.number(),
          distance: z.number().optional(),
          avgHeartRate: z.number().optional(),
          pace: z.number().optional(),
          caloriesBurned: z.number().optional(),
          notes: z.string().optional(),
        }).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const workoutResult = await db.createWorkout({
          userId: ctx.user.id,
          name: input.name,
          date: input.date,
          notes: input.notes || null,
          duration: input.duration || null,
          sleepHours: input.sleepHours || null,
          avgHeartRate: input.avgHeartRate || null,
          caloriesBurned: input.caloriesBurned || null,
        });
        
        // Get the insertId from the result
        const insertId = (workoutResult as any)[0]?.insertId || (workoutResult as any).insertId;
        const workoutId = insertId ? Number(insertId) : 0;
        
        if (!workoutId) {
          throw new Error("Failed to get workout ID");
        }
        
        // Create exercises
        for (const exercise of input.exercises) {
          await db.createExercise({
            workoutId,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            completed: 1,
            notes: exercise.notes || null,
          });
        }
        
        // Create cardio session if provided
        if (input.cardio) {
          await db.createCardioSession({
            workoutId,
            userId: ctx.user.id,
            type: input.cardio.type,
            duration: input.cardio.duration,
            distance: input.cardio.distance || null,
            avgHeartRate: input.cardio.avgHeartRate || null,
            pace: input.cardio.pace || null,
            caloriesBurned: input.cardio.caloriesBurned || null,
            date: input.date,
            notes: input.cardio.notes || null,
          });
        }
        
        return { id: workoutId, success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        date: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateWorkout(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteWorkout(input.id);
        return { success: true };
      }),
  }),

  exercises: router({
    getByWorkoutId: protectedProcedure
      .input(z.object({ workoutId: z.number() }))
      .query(async ({ input }) => {
        return await db.getExercisesByWorkoutId(input.workoutId);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        completed: z.number().optional(),
        weight: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateExercise(id, data);
        return { success: true };
      }),
  }),

  photos: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getProgressPhotosByUserId(ctx.user.id);
    }),
    
    upload: protectedProcedure
      .input(z.object({
        fileData: z.string(), // base64 encoded file
        fileName: z.string(),
        contentType: z.string(),
        pose: z.enum(["front", "back", "side"]),
        week: z.number(),
        date: z.date(),
        notes: z.string().optional(),
        // Body measurements
        weight: z.number().optional(),
        chest: z.number().optional(),
        waist: z.number().optional(),
        hips: z.number().optional(),
        leftArm: z.number().optional(),
        rightArm: z.number().optional(),
        leftThigh: z.number().optional(),
        rightThigh: z.number().optional(),
        leftCalf: z.number().optional(),
        rightCalf: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { storagePut } = await import("./storage");
        
        // Decode base64 and upload to S3
        const buffer = Buffer.from(input.fileData, "base64");
        const fileKey = `photos/${ctx.user.id}/${Date.now()}-${input.fileName}`;
        
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        
        await db.createProgressPhoto({
          userId: ctx.user.id,
          fileKey,
          url,
          pose: input.pose,
          week: input.week,
          date: input.date,
          notes: input.notes || null,
          weight: input.weight || null,
          chest: input.chest || null,
          waist: input.waist || null,
          hips: input.hips || null,
          leftArm: input.leftArm || null,
          rightArm: input.rightArm || null,
          leftThigh: input.leftThigh || null,
          rightThigh: input.rightThigh || null,
          leftCalf: input.leftCalf || null,
          rightCalf: input.rightCalf || null,
        });
        
        return { success: true, url };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProgressPhoto(input.id);
        return { success: true };
      }),
  }),

  templates: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const templates = await db.getWorkoutTemplatesByUserId(ctx.user.id);
      // Include exercises for each template
      const templatesWithExercises = await Promise.all(
        templates.map(async (template) => {
          const exercises = await db.getTemplateExercisesByTemplateId(template.id);
          return { ...template, exercises };
        })
      );
      return templatesWithExercises;
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const template = await db.getWorkoutTemplateById(input.id);
        if (!template) throw new Error("Template not found");
        
        const exercises = await db.getTemplateExercisesByTemplateId(input.id);
        return { ...template, exercises };
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        exercises: z.array(z.object({
          name: z.string(),
          sets: z.number(),
          reps: z.number(),
          weight: z.number(),
          notes: z.string().optional(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.createWorkoutTemplate({
          userId: ctx.user.id,
          name: input.name,
          description: input.description || null,
        });
        
        const templateId = Number((result as any).insertId || result[0]?.insertId);
        
        // Create exercises
        for (let i = 0; i < input.exercises.length; i++) {
          const exercise = input.exercises[i];
          await db.createTemplateExercise({
            templateId,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            notes: exercise.notes || null,
            order: i,
          });
        }
        
        return { success: true, id: templateId };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateWorkoutTemplate(input.id, {
          name: input.name,
          description: input.description,
        });
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteWorkoutTemplate(input.id);
        return { success: true };
      }),
  }),

  cardio: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCardioSessionsByUserId(ctx.user.id);
    }),
    
    getByWorkoutId: protectedProcedure
      .input(z.object({ workoutId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCardioSessionsByWorkoutId(input.workoutId);
      }),
  }),

  userExercises: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserCustomExercises(ctx.user.id);
    }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        muscleGroup: z.string(),
        equipment: z.string().optional(),
        difficulty: z.enum(["iniciante", "intermediario", "avancado"]).optional(),
        imageData: z.string().optional(), // Base64 image data
        description: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        let mediaUrl: string | undefined;
        let mediaType: "gif" | "image" | undefined;
        
        // Upload image to S3 if provided
        if (input.imageData) {
          const matches = input.imageData.match(/^data:image\/(\w+);base64,(.+)$/);
          if (matches) {
            const extension = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            
            const key = `exercises/${ctx.user.id}/${Date.now()}.${extension}`;
            const contentType = `image/${extension}`;
            
            const uploadResult = await storagePut(key, buffer, contentType);
            mediaUrl = uploadResult.url;
            mediaType = extension === 'gif' ? 'gif' : 'image';
          }
        }
        
        const result = await db.createUserCustomExercise({
          name: input.name,
          muscleGroup: input.muscleGroup,
          equipment: input.equipment,
          difficulty: input.difficulty,
          mediaUrl,
          mediaType,
          description: input.description,
          userId: ctx.user.id,
        });
        const insertId = (result as any).insertId || 0;
        return { success: true, id: Number(insertId) };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string(),
        muscleGroup: z.string(),
        equipment: z.string().optional(),
        difficulty: z.enum(["iniciante", "intermediario", "avancado"]).optional(),
        imageData: z.string().optional(), // Base64 image data
        description: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        let mediaUrl: string | undefined;
        let mediaType: "gif" | "image" | undefined;
        
        // Upload new image to S3 if provided
        if (input.imageData) {
          const matches = input.imageData.match(/^data:image\/(\w+);base64,(.+)$/);
          if (matches) {
            const extension = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            
            const key = `exercises/${ctx.user.id}/${Date.now()}.${extension}`;
            const contentType = `image/${extension}`;
            
            const uploadResult = await storagePut(key, buffer, contentType);
            mediaUrl = uploadResult.url;
            mediaType = extension === 'gif' ? 'gif' : 'image';
          }
        }
        
        await db.updateUserCustomExercise({
          id: input.id,
          name: input.name,
          muscleGroup: input.muscleGroup,
          equipment: input.equipment,
          difficulty: input.difficulty,
          mediaUrl,
          mediaType,
          description: input.description,
          userId: ctx.user.id,
        });
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteUserCustomExercise(input.id, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
