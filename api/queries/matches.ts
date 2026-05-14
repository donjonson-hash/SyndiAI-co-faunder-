import { getDb } from "./connection";
import { matches, profiles, users, messages } from "@db/schema";
import { eq, or, and, desc, count } from "drizzle-orm";
import type { InsertMatch, InsertMessage } from "@db/schema";

export async function createMatch(data: InsertMatch) {
  const [result] = await getDb()
    .insert(matches)
    .values(data)
    .returning();
  return result;
}

export async function findMatchBetweenUsers(user1Id: number, user2Id: number) {
  return getDb()
    .query
    .matches
    .findFirst({
      where: or(
        and(eq(matches.user1Id, user1Id), eq(matches.user2Id, user2Id)),
        and(eq(matches.user1Id, user2Id), eq(matches.user2Id, user1Id))
      ),
    });
}

export async function findMatchesByUser(userId: number) {
  const userMatches = await getDb()
    .select()
    .from(matches)
    .where(
      or(eq(matches.user1Id, userId), eq(matches.user2Id, userId))
    )
    .orderBy(desc(matches.createdAt));

  const enriched = await Promise.all(
    userMatches.map(async (match) => {
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
      const profile = await getDb()
        .query
        .profiles
        .findFirst({
          where: eq(profiles.userId, otherUserId),
        });
      const user = await getDb()
        .query
        .users
        .findFirst({
          where: eq(users.id, otherUserId),
        });

      const [unreadCount] = await getDb()
        .select({ count: count() })
        .from(messages)
        .where(
          and(
            eq(messages.matchId, match.id),
            eq(messages.senderId, otherUserId),
            eq(messages.status, "sent")
          )
        );

      const [lastMessage] = await getDb()
        .select()
        .from(messages)
        .where(eq(messages.matchId, match.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      return {
        ...match,
        otherProfile: profile,
        otherUser: user,
        unreadCount: unreadCount?.count ?? 0,
        lastMessage,
      };
    })
  );

  return enriched;
}

// ─── Messages ────────────────────────────────────────────────────

export async function createMessage(data: InsertMessage) {
  const [result] = await getDb()
    .insert(messages)
    .values(data)
    .returning();
  return result;
}

export async function findMessagesByMatch(matchId: number) {
  return getDb()
    .select()
    .from(messages)
    .where(eq(messages.matchId, matchId))
    .orderBy(messages.createdAt);
}

export async function markMessagesAsRead(matchId: number, _userId: number) {
  await getDb()
    .update(messages)
    .set({ status: "read" })
    .where(
      and(
        eq(messages.matchId, matchId),
        eq(messages.status, "sent")
      )
    );
}
