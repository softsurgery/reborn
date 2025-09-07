export interface Conversation {
  uid1: string;
  uid2: string;
  messages: ChatMessage[];
}
export interface ChatMessage {
  userUid: string;
  message: string;
  timestamp: number;
}
