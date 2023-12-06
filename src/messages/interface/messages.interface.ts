export interface Message {
  id?: string;
  sender_id: string;
  receiver_room_id: string;
  content: string;
  create_at?: string;
  upated_at?: string;
  reaction?: string;
  sender_name: string;
  sender_phone?: string;
  is_read: boolean;
  timestamp?: Date;
}
