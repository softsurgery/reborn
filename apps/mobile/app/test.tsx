import React, { useEffect, useState } from "react";
import { View, Button, FlatList, StyleSheet } from "react-native";
import io from "socket.io-client";
import { StableKeyboardAwareScrollView } from "~/components/shared/KeyboardAwareScrollView";
import { Loader } from "~/components/shared/Loader";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";

const CHAT_SERVER_URL = "http://192.168.1.41:5000";

type Message = {
  id: string;
  content: string;
  user: { id: string; username: string };
  createdAt: string;
};

export default function ChatPage() {
  const authPersistStore = useAuthPersistStore();
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const conversationId = 1;

  useEffect(() => {
    const s = io(CHAT_SERVER_URL, {
      extraHeaders: {
        Authorization: `Bearer ${authPersistStore.accessToken}`,
      },
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("Connected to chat server");

      // Join conversation room
      s.emit("joinConversation", { conversationId });
    });

    // Receive chat history
    s.on("conversationHistory", (history: Message[]) => {
      setMessages(history);
    });

    // Receive new messages
    s.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    s.on("error", (err: any) => {
      console.log("Socket error:", err);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    socket.emit("message", { conversationId, content: input });
    setInput("");
  };

  return (
    <StableKeyboardAwareScrollView>
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.message}>{item.content}</Text>
          )}
        />

        <View style={styles.inputContainer}>
          <Input
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message"
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
      <Loader size="small" />
    </StableKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "black" },
  message: { paddingVertical: 5 },
  inputContainer: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
});
