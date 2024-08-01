// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { sql } from "drizzle-orm";
import { pgTableCreator, serial, timestamp, varchar, integer, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * Multi-project schema (vertexdb_)
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `vertexdb_${name}`);

export const gameRssEntries = createTable(
  "gameRssEntries",
  {
    rssId: serial("rss_id").primaryKey(),
    gameId: integer("game_id").notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    url: varchar("url", { length: 255 }).notNull().unique(),
    description: varchar("description", { length: 255 }).notNull(),
    section: varchar("section", { length: 255 }).notNull(),
    score: integer("score").default(1).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => ({
    gameIdIdx: index("idx_gameRssEntries_gameId").on(table.gameId),
  })
);

export const gameRssVotes = createTable(
  "gameRssVotes",
  {
    voteId: serial("vote_id").primaryKey(),
    rssId: integer("rss_id")
      .notNull()
      .references(() => gameRssEntries.rssId),
    voterId: varchar("voter_id", { length: 255 }).notNull(),
    voteType: boolean("vote_type").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => ({
    rssIdx: index("idx_gameRssVotes_rssId").on(table.rssId),
    voterIdx: index("idx_gameRssVotes_voterId").on(table.voterId),
  })
);
