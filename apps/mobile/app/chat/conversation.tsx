// import { useRoute, useNavigation } from "@react-navigation/native";
// import { Send } from "lucide-react-native";
// import { useLayoutEffect, useState } from "react";
// import {
//   View,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import ChatBubble from "~/components/chat/ChatBubble";
// import { User } from "~/types";

// export default function Screen() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { user } = route.params as { user: User };

//   const [message, setMessage] = useState("");

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       title: `${user.surname} ${user.name}`,
//     });
//   }, [navigation, user]);

//   return (

//       <View className="flex-1 justify-between px-5">
//         {/* Messages List */}
//         <ScrollView className="flex-1 p-4">
//           <ChatBubble
//             message="Hey there!"
//             sender="John"
//             timestamp="10:30 AM"
//             isOutgoing={false}
//           />
//           <ChatBubble
//             message="Hello! How's it going?"
//             timestamp="10:31 AM"
//             isOutgoing={true}
//           />
//           <ChatBubble
//             message="Pretty good! What about you?"
//             timestamp="10:32 AM"
//             isOutgoing={false}
//           />
//         </ScrollView>

//         {/* Input Field */}
//         <View className="flex-row items-center p-4 border-t">
//           <TextInput
//             value={message}
//             onChangeText={setMessage}
//             placeholder="Type a message..."
//             className="flex-1 h-12 px-4 rounded-lg"
//           />
//           <TouchableOpacity
//             className="ml-4 p-2"
//             onPress={() => console.log("Send:", message)}
//           >
//             <Send color="blue" size={24} />
//           </TouchableOpacity>
//         </View>
//       </View>

//   );
// }

import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronLeftCircleIcon,
  Info,
  MoveLeftIcon,
  Send,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { ChatHeaderLeft } from "~/components/chat/ChatHeaderLeft";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { cn } from "~/lib/utils";
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
  ]);

  const [inputMessage, setInputMessage] = useState("");

  function getTime(date: any) {
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
      headerRight: () => (
        <TouchableOpacity
          className="mx-2"
          onPress={() => {
            Alert.alert("This is supposed to be informative");
          }}
        >
          <IconWithTheme icon={Info} size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 px-5 my-10">
        <FlatList
          inverted={true}
          data={JSON.parse(JSON.stringify(messages)).reverse()}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback>
              <View className="mt-2">
                <View
                  className={cn(
                    "bg-purple-600 max-w-[80%] mx-2 p-2 rounded-lg ",
                    item.sender === currentUser.name
                      ? "self-end rounded-bl-xl rounded-br-none"
                      : "self-start rounded-br-xl rounded-bl-none"
                  )}
                >
                  <Text className="text-white font-semibold pb-0.5">
                    {item.message}
                  </Text>
                  <Text className="text-xs text-white text-right">
                    {item.time}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        />

        <View style={{ paddingVertical: 10 }}>
          <View style={styles.messageInputView}>
            <TextInput
              className="flex-1 h-10 px-2 text-black dark:text-white"
              defaultValue={inputMessage}
              style={styles.messageInput}
              placeholder="Message"
              onChangeText={(text) => setInputMessage(text)}
              onSubmitEditing={() => {
                sendMessage();
              }}
            />
            <TouchableOpacity
              style={styles.messageSendView}
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

const styles = StyleSheet.create({
  messageInputView: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 14,
    borderRadius: 10,
    borderColor: "#776464",
    borderWidth: 1,
    paddingLeft: 10,
  },
  messageInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});
