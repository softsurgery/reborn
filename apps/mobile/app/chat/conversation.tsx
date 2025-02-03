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
import ChatBubble from "~/components/chat/Conversation/ChatBubble";
import { ChatHeaderLeft } from "~/components/chat/Conversation/ChatHeaderLeft";
import { ChatHeaderRight } from "~/components/chat/Conversation/ChatHeaderRight";
import { Textarea } from "~/components/ui/textarea";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { User } from "~/types";

export default function ChatScreen1() {
  const route = useRoute();
  const navigation = useNavigation();

  const { user } = route.params as { user: User };

  const [chatUser] = useState({
    name: `${user.surname} ${user.name}`,
    profile_image: "https://randomuser.me/api/portraits/men/0.jpg",
    last_seen: "Online",
  });

  const [currentUser] = useState({
    name: "John Doe",
  });

  const [messages, setMessages] = useState([
    { sender: "John Doe", message: "Hey there!", time: "6:01 PM" },
    {
      sender: "Robert Henry",
      message: "Hello, how are you doing?",
      time: "6:02 PM",
    },
    {
      sender: "John Doe",
      message: "I am good, how about you?",
      time: "6:02 PM",
    },
    {
      sender: "John Doe",
      message: `😊😇`,
      time: "6:02 PM",
    },
    {
      sender: "Robert Henry",
      message: `Can't wait to meet you.`,
      time: "6:03 PM",
    },
    {
      sender: "John Doe",
      message: `That's great, when are you coming?`,
      time: "6:03 PM",
    },
    {
      sender: "Robert Henry",
      message: `This weekend.`,
      time: "6:03 PM",
    },
    {
      sender: "Robert Henry",
      message: `Around 4 to 6 PM.`,
      time: "6:04 PM",
    },
    {
      sender: "John Doe",
      message: `Great, don't forgeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaat to bring me some mangoes.`,
      time: "6:05 PM",
    },
    {
      sender: "Robert Henry",
      message: `Sure!`,
      time: "6:05 PM",
    },
    {
      sender: "John Doe",
      message: `Great, don't forgeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaat to bring me some mangoes.`,
      time: "6:05 PM",
    },
    {
      sender: "Robert Henry",
      message: `Sure!`,
      time: "6:05 PM",
    },
    {
      sender: "John Doe",
      message: `Great, don't forgeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaat to bring me some mangoes.`,
      time: "6:05 PM",
    },
    {
      sender: "Robert Henry",
      message: `Sure!`,
      time: "6:05 PM",
    },
    {
      sender: "John Doe",
      message: `Great, don't forgeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaat to bring me some mangoes.`,
      time: "6:05 PM",
    },
    {
      sender: "Robert Henry",
      message: `Sure!`,
      time: "6:05 PM",
    },
  ]);

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

  function sendMessage() {
    if (inputMessage === "") {
      return setInputMessage("");
    }
    let t = getTime(new Date());
    setMessages([
      ...messages,
      {
        sender: currentUser.name,
        message: inputMessage,
        time: t,
      },
    ]);
    setInputMessage("");
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