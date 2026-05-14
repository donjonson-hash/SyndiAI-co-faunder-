import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findProfileByUserId,
  createProfile,
  updateProfile,
  findDiscoverProfiles,
} from "./queries/profiles";
import { TRPCError } from "@trpc/server";

export const profileRouter = createRouter({
  me: authedQuery.query(async ({ ctx }) => {
    const profile = await findProfileByUserId(ctx.user.id);
    return profile ?? null;
  }),

  create: authedQuery
    .input(
      z.object({
        displayName: z.string().min(1, "Name is required"),
        title: z.string().optional(),
        bio: z.string().optional(),
        avatar: z.string().optional(),
        location: z.string().optional(),
        skills: z.array(z.string()).optional(),
        lookingFor: z.string().optional(),
        startupIdea: z.string().optional(),
        experienceLevel: z.enum(["beginner", "intermediate", "expert"]).optional(),
        availability: z.enum(["full-time", "part-time", "advisory"]).optional(),
        compatibilityProfile: z
          .object({
            vision: z.number().min(0).max(100),
            skills: z.number().min(0).max(100),
            values: z.number().min(0).max(100),
            commitment: z.number().min(0).max(100),
            communication: z.number().min(0).max(100),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await findProfileByUserId(ctx.user.id);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Profile already exists. Use update instead.",
        });
      }

      return createProfile({
        ...input,
        userId: ctx.user.id,
      });
    }),

  update: authedQuery
    .input(
      z.object({
        displayName: z.string().min(1).optional(),
        title: z.string().optional(),
        bio: z.string().optional(),
        avatar: z.string().optional(),
        location: z.string().optional(),
        skills: z.array(z.string()).optional(),
        lookingFor: z.string().optional(),
        startupIdea: z.string().optional(),
        experienceLevel: z.enum(["beginner", "intermediate", "expert"]).optional(),
        availability: z.enum(["full-time", "part-time", "advisory"]).optional(),
        compatibilityProfile: z
          .object({
            vision: z.number().min(0).max(100),
            skills: z.number().min(0).max(100),
            values: z.number().min(0).max(100),
            commitment: z.number().min(0).max(100),
            communication: z.number().min(0).max(100),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return updateProfile(ctx.user.id, input);
    }),

  discover: authedQuery
    .input(
      z.object({
        excludedUserIds: z.array(z.number()).default([]),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      return findDiscoverProfiles(
        ctx.user.id,
        input.excludedUserIds,
        input.limit
      );
    }),
});
