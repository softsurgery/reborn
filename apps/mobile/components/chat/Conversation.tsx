import React from "react";
import { useNavigation } from "expo-router";
import { FlatList, View } from "react-native";
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
import { StableKeyboardAwareScrollView } from "../shared/KeyboardAwareScrollView";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import Icon from "~/lib/Icon";
import { SendHorizonal } from "lucide-react-native";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import { ResponseMessageDto } from "~/types";
import { io } from "socket.io-client";
import { Text } from "../ui/text";
import { ChatBubble } from "./conversation/ChatBubble";
import { StableScrollView } from "../shared/StableScrollView";
import { StableScrollIntoView } from "../shared/StableScrollIntoView";

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

  const { data: conversationresp, isPending: isConversationsPending } =
    useQuery({
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
    size: { width: 50, height: 50 },
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

      // Join conversation room
      s.emit("joinConversation", { conversationId: id });
    });

    // Receive chat history
    s.on("conversationHistory", (history: ResponseMessageDto[]) => {
      setMessages(history);
    });

    // Receive new messages
    s.on("message", (message: ResponseMessageDto) => {
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

    socket.emit("message", { conversationId: id, content: input });
    setInput("");
  };

  return (
    <StableKeyboardAwareScrollView bounces={false} className="flex-1">
      <StableSafeAreaView className="flex-1">
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
          <View className="flex flex-row bg-background/75 justify-between items-center py-4 px-2">
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
            scrollEnabled={true}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ChatBubble
                message={item.content}
                timestamp={item.createdAt}
                right={item.userId === currentUser?.id}
              />
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
          {/* controls */}
          <View className="flex flex-row justify-center items-end w-full gap-2 pb-6 pt-5 bg-background">
            <Textarea
              placeholder="Aa"
              className="w-4/5 h-full"
              value={input}
              onChangeText={setInput}
            />
            <Button
              variant={"secondary"}
              size={"sm"}
              className="rounded-lg h-12 w-12"
              onPress={sendMessage}
            >
              <Icon name={SendHorizonal} size={24} className="p-2" />
            </Button>
          </View>
        </ImageBackground>
      </StableSafeAreaView>
    </StableKeyboardAwareScrollView>
  );
};
