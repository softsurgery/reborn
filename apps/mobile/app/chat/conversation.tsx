import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { ImagePlus, Send } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import { ChatBubble } from "~/components/chat/Conversation/ChatBubble";
import { ChatHeaderLeft } from "~/components/chat/Conversation/ChatHeaderLeft";
import { ChatHeaderRight } from "~/components/chat/Conversation/ChatHeaderRight";
import { Textarea } from "~/components/ui/textarea";
import { chat } from "~/firebase/chat";
import { useUserUid } from "~/hooks/content/useUid";
import { useWholeConvo } from "~/hooks/content/useWholeConvo";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { User } from "~/types";
import { ChatMessage } from "~/types/Chat";

export default function ChatScreen1() {
  const route = useRoute();
  const navigation = useNavigation();
  const { uid, isUidPending } = useUserUid();
  const { user } = route.params as { user: User };

  const [chatUser] = useState({
    name: `${user.surname} ${user.name}`,
    profile_image: "https://randomuser.me/api/portraits/men/0.jpg",
    last_seen: "Online",
  });

  const [currentUser] = useState({
    name: "John Doe",
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { wholeConversation, isWholeConversationPending } = useWholeConvo(
    uid,
    user.uid
  );

  React.useEffect(() => {
    console.log(wholeConversation);
    setMessages(wholeConversation);
  }, [wholeConversation]);

  const [inputMessage, setInputMessage] = useState("");

  function getTime(date: Date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  async function sendMessage() {
    if (inputMessage.trim() === "") return;
    let t = getTime(new Date());
    const response = await chat.sendMessage(inputMessage, user.uid);
    if (response.success) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: currentUser.name,
          message: inputMessage,
          time: t,
        },
      ]);
      setInputMessage("");
    } else {
      console.error(response.message);
    }
  }

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <ChatHeaderLeft
          goBack={navigation.goBack}
          user={user}
          lastSeen={chatUser.last_seen}
        />
      ),
      headerRight: () => <ChatHeaderRight />,
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 px-5">
        <FlatList
          showsVerticalScrollIndicator={false}
          className="-mx-5 py-5 px-2"
          inverted={true}
          data={JSON.parse(JSON.stringify(messages)).reverse()}
          renderItem={({ item }) => (
            <View>
              <ChatBubble
                message={item.message}
                currentUserUid={user.uid}
                senderUid={item.sender}
                timestamp={item.time}
              />
            </View>
          )}
        />
        <View>
          <View className="flex flex-row justify-between items-center gap-4 pb-10 pt-2 px-2">
            <TouchableOpacity
              onPress={() => {
                sendMessage();
              }}
            >
              <IconWithTheme icon={ImagePlus} size={30} />
            </TouchableOpacity>
            <Textarea
              defaultValue={inputMessage}
              className="flex-1 h-12"
              placeholder="Aa"
              onChangeText={(text) => setInputMessage(text)}
              onSubmitEditing={() => {
                sendMessage();
              }}
            />
            <TouchableOpacity
              onPress={() => {
                sendMessage();
              }}
            >
              <IconWithTheme icon={Send} size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
