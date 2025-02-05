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
  lastMessageKey: string | null,
  pageSize: number = 10
) {
  try {
    const db = getDatabase();
    let messagesQuery = query(
      ref(db, `conversations/${conversationId}/messages`),
      orderByKey(),
      limitToLast(pageSize)
    );

    // If there is a lastMessageKey (for pagination), fetch older messages
    if (lastMessageKey) {
      messagesQuery = query(messagesQuery, endBefore(lastMessageKey));
    }

    const snapshot = await get(messagesQuery);

    if (!snapshot.exists()) {
      return { messages: [], lastKey: null }; // No messages found
    }

    // Convert snapshot to an array
    const messagesArray = Object.entries(snapshot.val()).map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return { key, ...value };
      } else {
        return { key, value };
      }
    });

    // Reverse to get newest messages first
    messagesArray.reverse();

    // Get the last message's key for pagination
    const newLastKey =
      messagesArray.length > 0
        ? messagesArray[messagesArray.length - 1].key
        : null;

    return { messages: messagesArray, lastKey: newLastKey };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { messages: [], lastKey: null };
  }
}

export async function fetchConversation(uid1: string, uid2: string) {
  try {
    const db = getDatabase();
    const conversationId = uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
    const messagesRef = query(
      ref(db, `conversations/${conversationId}/messages`),
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

export const chat = {
  sendMessage,
  fetchMessagesByPage,
  fetchConversation,
};
