import { describe, it, expect, vi } from "vitest";
import { swipeRouter } from "./swipe-router";

// Mock dependencies
vi.mock("./queries/swipes", () => ({
  createSwipe: vi.fn().mockResolvedValue({}),
  checkMutualSwipe: vi.fn(),
}));

vi.mock("./queries/matches", () => ({
  createMatch: vi.fn().mockResolvedValue({
    id: 1,
    user1Id: 1,
    user2Id: 2,
    synergyScore: 75,
    isNew: "true",
    createdAt: new Date(),
  }),
  findMatchBetweenUsers: vi.fn().mockResolvedValue(null),
}));

vi.mock("./queries/profiles", () => ({
  findProfileByUserId: vi.fn().mockResolvedValue({
    id: 1,
    userId: 1,
    displayName: "Test User",
    skills: ["React"],
  }),
}));

vi.mock("./lib/matching", () => ({
  calculateSynergyScore: vi.fn().mockReturnValue({
    overall: 75,
    breakdown: {
      vision: 80,
      skills: 70,
      values: 75,
      commitment: 80,
      communication: 70,
    },
    reasoning: [],
  }),
}));

vi.mock("./lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockReturnValue({ allowed: true, remaining: 29, resetAt: Date.now() + 60000 }),
}));

describe("Swipe Router", () => {
  it("should be defined with create procedure", () => {
    expect(swipeRouter).toBeDefined();
    expect(swipeRouter._def.procedures).toHaveProperty("create");
  });
});
