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
