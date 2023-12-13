export interface Room {
  id?: string;
  name: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  user_id: string;
  isGroup: boolean;
  my_id: string;
  original_dm_roomID: string;
  unread_count?: number;
  last_message?: string;
  role?: string;
}
