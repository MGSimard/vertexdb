export interface StateTypes {
  isPending: boolean;
  error: string | null;
  data: ResponseTypes | null;
}

interface ResponseTypes {
  id: number;
  cover?: {
    id: number;
    image_id: string;
  };
  first_release_date: number;
  involved_companies: { company: { id: number; name: string }; developer: boolean; id: number; publisher: boolean }[];
  name: string;
  summary: string;
  websites: { id: number; category: number; url: string }[];
}
