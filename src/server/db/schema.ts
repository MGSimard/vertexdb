// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  boolean,
  index,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { reportReasonEnums, reportStatusEnums, sectionEnums } from "@/utils/enums";

/**
 * Multi-project schema (vertexdb_)
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `vertexdb_${name}`);

export const sectionEnum = pgEnum("section", sectionEnums);
export const gameRssEntries = createTable(
  "gameRssEntries",
  {
    rssId: serial("rss_id").primaryKey(),
    gameId: integer("game_id").notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    title: varchar("title", { length: 60 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),
    description: varchar("description", { length: 120 }).notNull(),
    section: sectionEnum("section").notNull(),
    score: integer("score").default(1).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    gameIdIdx: index("idx_gameRssEntries_gameId_deletedAt_score").on(
      table.gameId,
      table.deletedAt.nullsFirst(),
      table.score.desc()
    ),
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

export const reportStatusEnum = pgEnum("status", reportStatusEnums);
export const reportReasonEnum = pgEnum("reason", reportReasonEnums);
export const rssReports = createTable(
  "rssReports",
  {
    rptId: serial("report_id").primaryKey(),
    rssId: integer("rss_id")
      .notNull()
      .references(() => gameRssEntries.rssId),
    reportBy: varchar("report_by", { length: 255 }).notNull(),
    reportReason: reportReasonEnum("report_reason").default("Other").notNull(),
    optionalComment: varchar("optional_comment", { length: 120 }),
    status: reportStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => ({
    statusIdx: index("idx_rssReports_status").on(table.status),
    unq: unique().on(table.rssId, table.reportBy),
  })
);
