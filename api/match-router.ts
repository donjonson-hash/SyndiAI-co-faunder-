import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findMatchesByUser,
  findMessagesByMatch,
  createMessage,
  markMessagesAsRead,
} from "./queries/matches";
import { calculateSynergyScore } from "./lib/matching";
import { findProfileByUserId } from "./queries/profiles";
import { checkRateLimit } from "./lib/rate-limit";
import { TRPCError } from "@trpc/server";

export const matchRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    return findMatchesByUser(ctx.user.id);
  }),

  analyze: authedQuery
    .input(z.object({ targetUserId: z.number() }))
    .query(async ({ ctx, input }) => {
      const myProfile = await findProfileByUserId(ctx.user.id);
      const theirProfile = await findProfileByUserId(input.targetUserId);

      if (!myProfile || !theirProfile) {
        return null;
      }

      return calculateSynergyScore(myProfile, theirProfile);
    }),

  messages: authedQuery
    .input(z.object({ matchId: z.number() }))
    .query(async ({ ctx, input }) => {
      const msgs = await findMessagesByMatch(input.matchId);
      await markMessagesAsRead(input.matchId, ctx.user.id);
      return msgs;
    }),

  sendMessage: authedQuery
    .input(
      z.object({
        matchId: z.number(),
        content: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Rate limit: max 20 messages per minute per user
      const rateLimit = checkRateLimit(ctx.user.id, "message", 20, 60000);
      if (!rateLimit.allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetAt - Date.now()) / 1000)}s`,
        });
      }

      return createMessage({
        matchId: input.matchId,
        senderId: ctx.user.id,
        content: input.content,
        status: "sent",
      });
    }),
});
