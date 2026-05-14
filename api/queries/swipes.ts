import { getDb } from "./connection";
import { swipes } from "@db/schema";
import { eq, and } from "drizzle-orm";
import type { InsertSwipe } from "@db/schema";

export async function createSwipe(data: InsertSwipe) {
  await getDb().insert(swipes).values(data);
  return data;
}

export async function findSwipesBySwiper(swiperId: number) {
  return getDb()
    .select()
    .from(swipes)
    .where(eq(swipes.swiperId, swiperId));
}

export async function checkMutualSwipe(user1Id: number, user2Id: number) {
  const swipe1 = await getDb()
    .query
    .swipes
    .findFirst({
      where: and(
        eq(swipes.swiperId, user1Id),
        eq(swipes.swipedId, user2Id),
        eq(swipes.direction, "right")
      ),
    });

  const swipe2 = await getDb()
    .query
    .swipes
    .findFirst({
      where: and(
        eq(swipes.swiperId, user2Id),
        eq(swipes.swipedId, user1Id),
        eq(swipes.direction, "right")
      ),
    });

  return !!swipe1 && !!swipe2;
}
