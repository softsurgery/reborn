import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getDatabase,
  ref,
  push,
  query,
  orderByKey,
  limitToLast,
  endBefore,
  get,
  orderByChild,
} from "firebase/database";
import { ChatMessage } from "~/types/Chat";

const uidComparator = (uid1: string, uid2: string) =>
  uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;

async function sendMessage(message: string, receiverUid: string) {
  const uid = await AsyncStorage.getItem("uid");
  if (!uid) {
    return { message: "User not authenticated", success: false };
  }

  try {
    const db = getDatabase();
    const conversationId =
      uid < receiverUid ? `${uid}_${receiverUid}` : `${receiverUid}_${uid}`;
    const messageRef = ref(db, `conversations/${conversationId}/messages`);

    const newMessage: ChatMessage = {
      userUid: uid,
      message,
      timestamp: Date.now(),
    };

    await push(messageRef, newMessage);

    return { message: "Message sent successfully", success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    return { message: "Failed to send message", success: false };
  }
}
async function fetchMessagesByPage(
  conversationId: string,
  lastMessageTimestamp: number | null,
  pageSize: number = 10
) {
  try {
    const db = getDatabase();
    let messagesQuery = query(
      ref(db, `conversations/${conversationId}/messages`),
      orderByChild("timestamp"),
      limitToLast(pageSize)
    );

    // If there is a lastMessageTimestamp (for pagination), fetch older messages
    if (lastMessageTimestamp) {
      messagesQuery = query(messagesQuery, endBefore(lastMessageTimestamp));
    }

    const snapshot = await get(messagesQuery);

    if (!snapshot.exists()) {
      return { messages: [], lastTimestamp: null }; // No messages found
    }

    // Convert snapshot to an array
    const messagesArray = Object.entries(snapshot.val()).map(([key, value]) => ({
      key,
      ...(value as any),
    }));

    // Sort messages in chronological order (oldest to newest)
    messagesArray.sort((a, b) => a.timestamp - b.timestamp);

    // Get the last message's timestamp for pagination
    const newLastTimestamp =
      messagesArray.length > 0
        ? messagesArray[0].timestamp // First item is the oldest
        : null;

    return { messages: messagesArray, lastTimestamp: newLastTimestamp };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { messages: [], lastTimestamp: null };
  }
}


export async function fetchConversation(uid1: string, uid2: string) {
  try {
    const db = getDatabase();

    const messagesRef = query(
      ref(db, `conversations/${uidComparator(uid1, uid2)}/messages`),
      orderByChild("timestamp")
    );

    const snapshot = await get(messagesRef);

    if (!snapshot.exists()) {
      return { success: true, messages: [] };
    }

    const messages = Object.entries(snapshot.val()).map(([key, value]) => ({
      key,
      ...(value as any),
    }));
    console.log(messages);
    return { success: true, messages };
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return { success: false, message: "Failed to fetch conversation" };
  }
}

async function getLatestMessages(uid1: string, uid2: string, limit: number = 1) {
  try {
    const db = getDatabase();
    const messagesQuery = query(
      ref(db, `conversations/${uidComparator(uid1, uid2)}/messages`),
      orderByChild("timestamp"),
      limitToLast(limit)
    );

    const snapshot = await get(messagesQuery);

    if (!snapshot.exists()) {
      return { messages: [] };
    }

    const messagesArray = Object.entries(snapshot.val()).map(
      ([key, value]) => ({
        key,
        ...(value as any),
      })
    );

    messagesArray.reverse();

    return { messages: messagesArray };
  } catch (error) {
    console.error("Error fetching latest messages:", error);
    return { messages: [] };
  }
}

export const chat = {
  sendMessage,
  getLatestMessages,
  fetchMessagesByPage,
  fetchConversation,
};
