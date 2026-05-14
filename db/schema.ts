import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  integer,
  json,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ─── Enums ─────────────────────────────────────────────────────
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const directionEnum = pgEnum("direction", ["left", "right"]);
export const isNewEnum = pgEnum("is_new", ["true", "false"]);
export const statusEnum = pgEnum("status", ["sent", "delivered", "read"]);
export const experienceLevelEnum = pgEnum("experience_level", [
  "beginner",
  "intermediate",
  "expert",
]);
export const availabilityEnum = pgEnum("availability", [
  "full-time",
  "part-time",
  "advisory",
]);

// ─── Users ──────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("union_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Profiles ───────────────────────────────────────────────────
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull().unique(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  bio: text("bio"),
  avatar: text("avatar"),
  location: varchar("location", { length: 255 }),
  skills: json("skills").$type<string[]>(),
  lookingFor: varchar("looking_for", { length: 255 }),
  startupIdea: text("startup_idea"),
  experienceLevel: experienceLevelEnum("experience_level").default("intermediate"),
  availability: availabilityEnum("availability").default("full-time"),
  compatibilityProfile: json("compatibility_profile").$type<{
    vision: number;
    skills: number;
    values: number;
    commitment: number;
    communication: number;
  }>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("profiles_user_id_idx").on(table.userId),
}));

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

// ─── Swipes ─────────────────────────────────────────────────────
export const swipes = pgTable("swipes", {
  id: serial("id").primaryKey(),
  swiperId: bigint("swiper_id", { mode: "number" }).notNull(),
  swipedId: bigint("swiped_id", { mode: "number" }).notNull(),
  direction: directionEnum("direction").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueSwipe: uniqueIndex("swipes_unique_idx").on(table.swiperId, table.swipedId),
  swiperIdx: index("swipes_swiper_id_idx").on(table.swiperId),
}));

export type Swipe = typeof swipes.$inferSelect;
export type InsertSwipe = typeof swipes.$inferInsert;

// ─── Matches ────────────────────────────────────────────────────
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  user1Id: bigint("user1_id", { mode: "number" }).notNull(),
  user2Id: bigint("user2_id", { mode: "number" }).notNull(),
  synergyScore: integer("synergy_score").default(0),
  isNew: isNewEnum("is_new").default("true").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueMatch: uniqueIndex("matches_unique_idx").on(table.user1Id, table.user2Id),
  user1Idx: index("matches_user1_id_idx").on(table.user1Id),
  user2Idx: index("matches_user2_id_idx").on(table.user2Id),
}));

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

// ─── Messages ───────────────────────────────────────────────────
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  matchId: bigint("match_id", { mode: "number" }).notNull(),
  senderId: bigint("sender_id", { mode: "number" }).notNull(),
  content: text("content").notNull(),
  status: statusEnum("status").default("sent").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  matchIdIdx: index("messages_match_id_idx").on(table.matchId),
  senderIdx: index("messages_sender_id_idx").on(table.senderId),
}));

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
