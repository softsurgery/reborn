import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ConversationDetails } from "~/components/chat/ConversationDetails";

export default function Screen() {
  const { id } = useLocalSearchParams();
  return <ConversationDetails id={id as string} />;
}
