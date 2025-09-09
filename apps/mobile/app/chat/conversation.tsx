import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Conversation } from "~/components/chat/Conversation";

export default function Screen() {
  const { id } = useLocalSearchParams();
  return <Conversation id={Number(id)} />;
}
