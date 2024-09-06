import { sectionEnums, reportStatusEnums, reportReasonEnums } from "@/utils/enums";

export interface GamedataResponseTypes {
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

export interface InitialRssTypes {
  rssId: number;
  title: string;
  url: string;
  description: string;
  section: (typeof sectionEnums)[number];
  score: number;
  currentUserVote?: boolean | null;
}
export type InitialRssResponseTypes = InitialRssTypes[] | { error: string };

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
  gameId: number;
  authorId: string;
  title: string;
  url: string;
  description: string;
  score: number;
}
export type PendingReportsResponse = { data: ReportTypes[]; message: string } | { error: boolean; message: string };

interface NameCoverTypes {
  id: number;
  cover?: { id: number; image_id: string };
  name: string;
}
export type NameCoverResponse = NameCoverTypes | { error: boolean; message: string };
