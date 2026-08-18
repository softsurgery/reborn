import React from "react";
import { cn } from "~/lib/utils";
import { View } from "react-native";
import { Mail, Pencil } from "lucide-react-native";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { router } from "expo-router";
import { ResponseUserDto } from "@/types";
import { useTranslation } from "react-i18next";
import { useColorPalette } from "@/hooks/useColorPalette";
import { Button } from "../ui/button";

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
  const { palette } = useColorPalette();
  const { t } = useTranslation("menu");
  return (
    <View className={cn("flex flex-col gap-2", className)}>
      <Button
        size={"sm"}
        variant={"outline"}
        onPress={() => router.push("/main/account/update-profile")}
        className="flex-row items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 active:opacity-80"
      >
        <Icon as={Pencil} size={16} color={palette.foreground} />
        <Text className="text-sm font-semibold text-foreground">
          {t("menu.actions.editProfile")}
        </Text>
      </Button>
      {currentUser?.id === user?.id && user?.email && !user.emailVerified && (
        <Button
          size={"sm"}
          onPress={() => sendVerifyEmail?.()}
          disabled={isSendVerifyEmailPending}
          className="flex-row items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 active:opacity-80"
        >
          <Icon as={Mail} size={16} color={palette.primaryForeground} />
          <Text className="text-sm font-semibold text-primary-foreground">
            {t("menu.actions.verifyEmail")}
          </Text>
        </Button>
      )}
    </View>
  );
};
