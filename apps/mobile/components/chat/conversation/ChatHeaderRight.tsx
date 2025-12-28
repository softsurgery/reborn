import { Info } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, View, ScrollView, TouchableOpacity, Text } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Icon } from "~/components/ui/icon";
import { cn } from "~/lib/utils";
import { ChatDetailsScreen } from "./ChatDetailsScreen"; 

interface ChatHeaderRightProps {
  className?: string;
  user: any;
}

export const ChatHeaderRight = ({ className, user }: ChatHeaderRightProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StablePressable
        className={cn("mx-2", className)}
        onPress={() => setOpen(true)}
      >
        <Icon as={Info} size={20} />
      </StablePressable>

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-end bg-background/50">
          <View className="max-h-[80%] bg-background rounded-t-3xl overflow-hidden">
            <ScrollView>
              <ChatDetailsScreen user={user} />
            </ScrollView>

            <TouchableOpacity
              className="bg-red-500 p-4 m-4 rounded-full"
              onPress={() => setOpen(false)}
            >
              <Text className="text-white text-center">Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
