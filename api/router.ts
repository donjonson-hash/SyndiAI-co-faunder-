import { authRouter } from "./auth-router";
import { profileRouter } from "./profile-router";
import { swipeRouter } from "./swipe-router";
import { matchRouter } from "./match-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  profile: profileRouter,
  swipe: swipeRouter,
  match: matchRouter,
});

export type AppRouter = typeof appRouter;
