import { describe, it, expect } from "vitest";
import {
  generateCompatibilityProfile,
  calculateSynergyScore,
  type ReasoningNode,
} from "./matching";

describe("AI Matching Engine", () => {
  describe("generateCompatibilityProfile", () => {
    it("should return stored profile if it exists", () => {
      const profile = {
        compatibilityProfile: {
          vision: 80,
          skills: 90,
          values: 70,
          commitment: 85,
          communication: 75,
        },
      };

      const result = generateCompatibilityProfile(profile);

      expect(result).toEqual(profile.compatibilityProfile);
    });

    it("should generate profile from skills and experience", () => {
      const profile = {
        skills: ["React", "Node.js", "Python"],
        startupIdea: "A platform for connecting remote teams with AI-powered collaboration tools",
        experienceLevel: "expert",
        availability: "full-time",
      };

      const result = generateCompatibilityProfile(profile);

      expect(result.vision).toBeGreaterThanOrEqual(60);
      expect(result.skills).toBeGreaterThanOrEqual(50);
      expect(result.values).toBe(90); // expert level
      expect(result.commitment).toBe(90); // full-time
      expect(result.communication).toBeGreaterThanOrEqual(50);
    });

    it("should handle profile with no skills", () => {
      const profile = {
        experienceLevel: "beginner",
        availability: "part-time",
      };

      const result = generateCompatibilityProfile(profile);

      expect(result.values).toBe(50); // beginner
      expect(result.commitment).toBe(65); // part-time
    });
  });

  describe("calculateSynergyScore", () => {
    it("should calculate overall score between 0 and 100", () => {
      const profileA = {
        skills: ["React", "Node.js"],
        startupIdea: "AI productivity app",
        experienceLevel: "expert",
        availability: "full-time",
      };

      const profileB = {
        skills: ["Python", "Machine Learning"],
        startupIdea: "Automation platform",
        experienceLevel: "expert",
        availability: "full-time",
      };

      const result = calculateSynergyScore(profileA, profileB);

      expect(result.overall).toBeGreaterThanOrEqual(0);
      expect(result.overall).toBeLessThanOrEqual(100);
    });

    it("should return breakdown with all 5 axes", () => {
      const profileA = {
        skills: ["React", "Node.js"],
        experienceLevel: "expert",
        availability: "full-time",
      };

      const profileB = {
        skills: ["Python", "Machine Learning"],
        experienceLevel: "intermediate",
        availability: "part-time",
      };

      const result = calculateSynergyScore(profileA, profileB);

      expect(result.breakdown).toHaveProperty("vision");
      expect(result.breakdown).toHaveProperty("skills");
      expect(result.breakdown).toHaveProperty("values");
      expect(result.breakdown).toHaveProperty("commitment");
      expect(result.breakdown).toHaveProperty("communication");
    });

    it("should return reasoning array with 5 nodes", () => {
      const profileA = {
        skills: ["React", "Node.js"],
        startupIdea: "AI app",
        experienceLevel: "expert",
        availability: "full-time",
      };

      const profileB = {
        skills: ["Python", "ML"],
        startupIdea: "ML platform",
        experienceLevel: "expert",
        availability: "full-time",
      };

      const result = calculateSynergyScore(profileA, profileB);

      expect(result.reasoning).toHaveLength(5);
      result.reasoning.forEach((node: ReasoningNode) => {
        expect(node).toHaveProperty("axis");
        expect(node).toHaveProperty("axisColor");
        expect(node).toHaveProperty("title");
        expect(node).toHaveProperty("explanation");
        expect(node).toHaveProperty("confidence");
        expect(typeof node.confidence).toBe("number");
      });
    });

    it("should favor complementary skills (low overlap)", () => {
      const profileA = {
        skills: ["React", "Node.js", "TypeScript"],
        experienceLevel: "expert",
        availability: "full-time",
      };

      const profileB = {
        skills: ["Python", "Machine Learning", "Data Science"],
        experienceLevel: "expert",
        availability: "full-time",
      };

      const resultDifferent = calculateSynergyScore(profileA, profileB);

      const profileC = {
        skills: ["React", "Node.js", "TypeScript"],
        experienceLevel: "expert",
        availability: "full-time",
      };

      const profileD = {
        skills: ["React", "Node.js", "TypeScript"],
        experienceLevel: "expert",
        availability: "full-time",
      };

      const resultSame = calculateSynergyScore(profileC, profileD);

      // Different skills should generally score higher on skills axis
      expect(resultDifferent.breakdown.skills).toBeGreaterThanOrEqual(
        resultSame.breakdown.skills
      );
    });

    it("should handle empty profiles gracefully", () => {
      const profileA = {};
      const profileB = {};

      const result = calculateSynergyScore(profileA, profileB);

      expect(result.overall).toBeGreaterThanOrEqual(0);
      expect(result.overall).toBeLessThanOrEqual(100);
      expect(result.reasoning).toHaveLength(5);
    });

    it("should weight axes correctly for overall score", () => {
      const profileA = {
        compatibilityProfile: {
          vision: 100,
          skills: 100,
          values: 100,
          commitment: 100,
          communication: 100,
        },
      };

      const profileB = {
        compatibilityProfile: {
          vision: 100,
          skills: 100,
          values: 100,
          commitment: 100,
          communication: 100,
        },
      };

      const result = calculateSynergyScore(profileA, profileB);

      // With identical perfect profiles, overall should be very high
      expect(result.overall).toBeGreaterThan(80);
    });
  });
});
