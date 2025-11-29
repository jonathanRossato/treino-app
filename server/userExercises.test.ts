import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("userExercises router", () => {
  it("should list user custom exercises", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const exercises = await caller.userExercises.list();
    expect(Array.isArray(exercises)).toBe(true);
  });

  it("should create a new custom exercise without image", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.userExercises.create({
      name: "Supino Inclinado 45°",
      muscleGroup: "Peito",
      equipment: "Barra",
      difficulty: "intermediario",
      description: "Exercício focado na parte superior do peitoral",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeTypeOf("number");
  });

  it("should create a new custom exercise with image", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a simple base64 test image (1x1 transparent PNG)
    const testImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    const result = await caller.userExercises.create({
      name: "Rosca Direta com Barra W",
      muscleGroup: "Bíceps",
      equipment: "Barra W",
      difficulty: "intermediario",
      imageData: testImageBase64,
      description: "Exercício para bíceps com pegada neutra",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeTypeOf("number");
  });

  it("should update an existing custom exercise", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create an exercise
    const createResult = await caller.userExercises.create({
      name: "Exercício Teste",
      muscleGroup: "Peito",
      equipment: "Halteres",
      difficulty: "iniciante",
    });

    expect(createResult.success).toBe(true);
    const exerciseId = createResult.id;

    // Now update it
    const updateResult = await caller.userExercises.update({
      id: exerciseId,
      name: "Exercício Teste Atualizado",
      muscleGroup: "Costas",
      equipment: "Barra",
      difficulty: "avancado",
      description: "Descrição atualizada",
    });

    expect(updateResult.success).toBe(true);
  });

  it("should update exercise with new image", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create an exercise
    const createResult = await caller.userExercises.create({
      name: "Exercício para Atualizar Imagem",
      muscleGroup: "Ombros",
      equipment: "Halteres",
      difficulty: "intermediario",
    });

    expect(createResult.success).toBe(true);
    const exerciseId = createResult.id;

    // Update with new image
    const testImageBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

    const updateResult = await caller.userExercises.update({
      id: exerciseId,
      name: "Exercício para Atualizar Imagem",
      muscleGroup: "Ombros",
      equipment: "Halteres",
      difficulty: "intermediario",
      imageData: testImageBase64,
    });

    expect(updateResult.success).toBe(true);
  });

  it("should delete a custom exercise", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create an exercise to delete
    const createResult = await caller.userExercises.create({
      name: "Exercício para Deletar",
      muscleGroup: "Tríceps",
      equipment: "Cabo",
      difficulty: "intermediario",
    });

    expect(createResult.success).toBe(true);
    const exerciseId = createResult.id;

    // Now delete it
    const deleteResult = await caller.userExercises.delete({
      id: exerciseId,
    });

    expect(deleteResult.success).toBe(true);
  });

  it("should handle exercise creation with minimal fields", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.userExercises.create({
      name: "Exercício Mínimo",
      muscleGroup: "Abdômen",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeTypeOf("number");
  });
});
