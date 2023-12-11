export interface UnreadMessage {
  id?: string;
  receiver_room_id?: string;
  sender_id?: string;
  last_message: string;
  createdAt?: string;
  updatedAt?: string;
  unread_count: number;
}
