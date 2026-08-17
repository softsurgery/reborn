import React from "react";
import { cn } from "~/lib/utils";
import { Pressable, View } from "react-native";
import { Mail, Pencil } from "lucide-react-native";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { router } from "expo-router";
import { ResponseUserDto } from "@/types";

interface ProfileStatProps {
  className?: string;
  user?: ResponseUserDto;
  currentUser?: ResponseUserDto | null;
  sendVerifyEmail?: () => void;
  isSendVerifyEmailPending?: boolean;
}

export const ProfileStat = ({
  className,
  user,
  currentUser,
  sendVerifyEmail,
  isSendVerifyEmailPending,
}: ProfileStatProps) => {
  return (
    <View className={cn("flex flex-col gap-2", className)}>
      <Pressable
        onPress={() => router.push("/main/account/update-profile")}
        className="flex-row items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 active:opacity-80"
      >
        <Icon as={Pencil} size={16} />
        <Text className="text-md font-semibold">Edit profile</Text>
      </Pressable>
      {currentUser?.id === user?.id && user?.email && !user.emailVerified && (
        <Pressable
          onPress={() => sendVerifyEmail?.()}
          disabled={isSendVerifyEmailPending}
          className="flex-row items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 active:opacity-80 bg-yellow-700"
        >
          <Icon as={Mail} size={16} color={"white"} />
          <Text className="text-md font-semibold text-white">Verify email</Text>
        </Pressable>
      )}
    </View>
  );
};
