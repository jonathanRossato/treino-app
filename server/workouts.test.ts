import { describe, expect, it, beforeEach } from "vitest";
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

describe("workouts router", () => {
  it("should list workouts for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const workouts = await caller.workouts.list();
    expect(Array.isArray(workouts)).toBe(true);
  });

  it("should create a new workout with exercises", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.workouts.create({
      name: "Treino A - Peito",
      date: new Date(),
      notes: "Treino focado em peito",
      exercises: [
        {
          name: "Supino Reto",
          sets: 4,
          reps: 10,
          weight: 80,
          notes: "Boa execução",
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeTypeOf("number");
  });
});

describe("photos router", () => {
  it("should list photos for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const photos = await caller.photos.list();
    expect(Array.isArray(photos)).toBe(true);
  });

  it("should upload a new progress photo", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a simple base64 test image (1x1 transparent PNG)
    const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    const result = await caller.photos.upload({
      fileData: testImageBase64,
      fileName: "test-photo.png",
      contentType: "image/png",
      pose: "front",
      week: 1,
      date: new Date(),
      notes: "Primeira foto",
    });

    expect(result.success).toBe(true);
    expect(result.url).toBeDefined();
  });
});
