import { z } from "zod";

const submissionSchema = z.object({
  gameId: z.coerce.number().int().positive().lte(2147483647),
  author: z.string().max(255),
  title: z.string().trim().max(255),
  url: z.string().url().trim().max(255),
  description: z.string().trim().max(255),
  section: z.string().max(255),
});

const voteSchema = z.object({
  rssId: z.coerce.number().int().positive().lte(2147483647),
  voterId: z.string().max(255),
  voteType: z.boolean(),
});
