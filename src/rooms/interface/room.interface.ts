export interface Room {
  id?: string;
  name: string;
  image: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  isGroup: boolean;
  my_id: string;
  original_dm_roomID: string;
}
