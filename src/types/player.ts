export type Player = {
  id: number;
  xq_id: string;
  ranking: number | null;
  name_en: string;
  name_zh: string;
  rating: string;
  state: string;
  gender: string | null;
  ic_number: string | null;
  address: string;
  email: string;
  contact: string;
  is_active: boolean;
  is_new: boolean;
  remarks: string;
  registered_datetime: string;
  last_updated_datetime: string;
};
