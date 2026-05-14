import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { createSwipe, checkMutualSwipe } from "./queries/swipes";
import { createMatch, findMatchBetweenUsers } from "./queries/matches";
import { calculateSynergyScore } from "./lib/matching";
import { findProfileByUserId } from "./queries/profiles";
import { checkRateLimit } from "./lib/rate-limit";
import { TRPCError } from "@trpc/server";

export const swipeRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        swipedId: z.number().min(1),
        direction: z.enum(["left", "right"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const swiperId = ctx.user.id;

      // Rate limit: max 30 swipes per minute per user
      const rateLimit = checkRateLimit(swiperId, "swipe", 30, 60000);
      if (!rateLimit.allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetAt - Date.now()) / 1000)}s`,
        });
      }

      // Prevent self-swiping
      if (swiperId === input.swipedId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot swipe on yourself",
        });
      }

      // Record the swipe (unique constraint prevents duplicates)
      try {
        await createSwipe({
          swiperId,
          swipedId: input.swipedId,
          direction: input.direction,
        });
      } catch (err: unknown) {
        // Handle duplicate swipe gracefully (PostgreSQL unique constraint violation)
        const error = err as { code?: string };
        if (error?.code === "23505") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You already swiped on this profile",
          });
        }
        throw err;
      }

      // If right swipe, check for mutual match
      if (input.direction === "right") {
        const isMutual = await checkMutualSwipe(swiperId, input.swipedId);

        if (isMutual) {
          // Check if match already exists (defense in depth)
          const existingMatch = await findMatchBetweenUsers(
            swiperId,
            input.swipedId
          );

          if (existingMatch) {
            return { isMatch: true, match: existingMatch };
          }

          // Calculate synergy score
          const profileA = await findProfileByUserId(swiperId);
          const profileB = await findProfileByUserId(input.swipedId);

          let synergyScore = 50;
          if (profileA && profileB) {
            const result = calculateSynergyScore(profileA, profileB);
            synergyScore = result.overall;
          }

          // Create match with unique constraint
          try {
            const match = await createMatch({
              user1Id: Math.min(swiperId, input.swipedId),
              user2Id: Math.max(swiperId, input.swipedId),
              synergyScore,
              isNew: "true",
            });
            return { isMatch: true, match };
          } catch (err: unknown) {
            const error = err as { code?: string };
            if (error?.code === "23505") {
              // Race condition: match was created by another request
              const raceMatch = await findMatchBetweenUsers(swiperId, input.swipedId);
              return { isMatch: true, match: raceMatch };
            }
            throw err;
          }
        }
      }

      return { isMatch: false, match: null };
    }),
});
