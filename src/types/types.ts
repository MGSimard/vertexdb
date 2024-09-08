import type { sectionEnums, reportStatusEnums, reportReasonEnums } from "@/utils/enums";

export interface GamedataTypes {
  id: number;
  name: string;
  cover?: {
    id: number;
    image_id: string;
  };
  first_release_date?: number;
  involved_companies?: { company: { id: number; name: string }; developer: boolean; id: number; publisher: boolean }[];
  summary?: string;
  websites?: { id: number; category: number; url: string }[];
}
export type GamedataResponseTypes = { success: boolean; data?: GamedataTypes; message: string };

export interface InitialRssTypes {
  rssId: number;
  title: string;
  url: string;
  description: string;
  section: (typeof sectionEnums)[number];
  score: number;
  currentUserVote?: boolean | null;
}

export interface SearchResponseTypes {
  id: number;
  name: string;
  slug: string;
  cover?: {
    id: number;
    image_id: string;
  };
}

export interface SubmissionTypes {
  rssId: number;
  author: string;
  title: string;
  url: string;
  description: string;
  section: string;
  score: number;
  currentUserVote?: boolean | null;
}

export interface ReportTypes {
  rptId: number;
  rssId: number;
  reportBy: string;
  status: (typeof reportStatusEnums)[number];
  reportReason: (typeof reportReasonEnums)[number];
  optionalComment: string;
  createdAt: Date;
  updatedAt: Date | null;
  // Below are leftJoin - technically FK ensures this
  // never happens but don't want to take chances, so I still handle possibility.
  gameId: number | null;
  authorId: string | null;
  title: string | null;
  url: string | null;
  description: string | null;
  score: number | null;
}

interface NameCoverTypes {
  id: number;
  cover?: { id: number; image_id: string };
  name: string;
}
