import React from "react";
import { useNavigation } from "expo-router";
import { View, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import { NavigationProps } from "~/types/app.routes";
import { ChatHeaderRight } from "./conversation/ChatHeaderRight";
import { api } from "~/api";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { ChatHeaderLeft } from "./conversation/ChatHeaderLeft";
import { useServerImage } from "~/hooks/content/useServerImage";
import { ImageBackground } from "expo-image";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import { ResponseMessageDto } from "~/types";
import { io } from "socket.io-client";
import { ChatBubble } from "./conversation/ChatBubble";
import { Text } from "../ui/text";
import Icon from "~/lib/Icon";
import { Plus, SendHorizonal, SendHorizontal } from "lucide-react-native";
import { StablePressable } from "../shared/StablePressable";

interface ConversationProps {
  className?: string;
  id: number;
}

const CHAT_SERVER_URL = "http://192.168.2.164:5000";

export const Conversation = ({ className, id }: ConversationProps) => {
  const authPersistStore = useAuthPersistStore();
  const [socket, setSocket] = React.useState<any>(null);
  const [messages, setMessages] = React.useState<ResponseMessageDto[]>([]);
  const [input, setInput] = React.useState("");

  const preferencePersistStore = usePreferencePersistStore();
  const { currentUser } = useCurrentUser();
  const navigation = useNavigation<NavigationProps>();

  const { data: conversationresp } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => api.chat.conversation.findById(id),
  });

  const conversation = React.useMemo(
    () => conversationresp ?? null,
    [conversationresp]
  );

  const user = React.useMemo(() => {
    if (!conversation) return null;
    return conversation.participants.find(
      (participant) => participant.id !== currentUser?.id
    );
  }, [conversation, currentUser]);

  const { jsx: profilePicture } = useServerImage({
    id: user?.profile?.pictureId,
    fallback: identifyUserAvatar(user),
    size: { width: 40, height: 40 },
    enabled: !!user?.profile?.pictureId,
  });

  React.useEffect(() => {
    const s = io(CHAT_SERVER_URL, {
      extraHeaders: {
        Authorization: `Bearer ${authPersistStore.accessToken}`,
      },
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("Connected to chat server");
      s.emit("joinConversation", { conversationId: id });
    });

    s.on("conversationHistory", (history: ResponseMessageDto[]) => {
      // Reverse messages so FlatList inverted renders correctly
      setMessages(history.reverse());
    });

    s.on("message", (message: ResponseMessageDto) => {
      setMessages((prev) => [message, ...prev]);
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
    socket.emit("message", { conversationId: id, content: input });
    setInput("");
  };

  return (
    <StableSafeAreaView className="flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ImageBackground
          source={
            preferencePersistStore.theme === "dark"
              ? require("~/assets/images/message-cover-dark.png")
              : require("~/assets/images/message-cover.png")
          }
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          {/* header */}
          <View className="flex flex-row bg-background justify-between border-b-2 border-primary items-center p-4">
            <ChatHeaderLeft
              profilePicture={profilePicture}
              identifier={identifyUser(user)}
              lastSeen={format(new Date(), "hh:mm a")}
            />
            <ChatHeaderRight />
          </View>

          {/* messages */}
          <FlatList
            className="flex-1"
            inverted={true}
            keyboardShouldPersistTaps="handled"
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ChatBubble
                message={item.content}
                timestamp={item.createdAt}
                right={item.userId === currentUser?.id}
              />
            )}
            contentContainerStyle={{ paddingVertical: 12 }}
          />

          {/* controls */}
          <View className="flex flex-row items-end justify-between bg-background border-t-2 border-primary w-screen py-4 px-2">
            <StablePressable
              className="w-10 h-10 flex items-center justify-center"
              onPress={sendMessage}
            >
              <Icon name={Plus} size={20} />
            </StablePressable>

            <Textarea
              value={input}
              onChangeText={setInput}
              placeholder="Aa"
              multiline
              style={{ minHeight: 42 }}
              className="flex-1 mx-1 rounded-lg"
            />

            <StablePressable
              className="w-10 h-10 flex items-center justify-center"
              onPress={sendMessage}
            >
              <Icon name={SendHorizonal} size={20} />
            </StablePressable>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </StableSafeAreaView>
  );
};
