import { getDb } from "./connection";
import { profiles } from "@db/schema";
import { eq, ne, and, notInArray } from "drizzle-orm";
import type { InsertProfile } from "@db/schema";

export async function findProfileByUserId(userId: number) {
  return getDb().query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });
}

export async function createProfile(data: InsertProfile) {
  const [result] = await getDb()
    .insert(profiles)
    .values(data)
    .returning();
  return result;
}

export async function updateProfile(userId: number, data: Partial<InsertProfile>) {
  const [result] = await getDb()
    .update(profiles)
    .set(data)
    .where(eq(profiles.userId, userId))
    .returning();
  return result;
}

export async function findDiscoverProfiles(
  currentUserId: number,
  excludedUserIds: number[],
  limit: number = 10
) {
  const conditions = [ne(profiles.userId, currentUserId)];

  if (excludedUserIds.length > 0) {
    conditions.push(notInArray(profiles.userId, excludedUserIds));
  }

  return getDb()
    .select()
    .from(profiles)
    .where(and(...conditions))
    .limit(limit);
}
