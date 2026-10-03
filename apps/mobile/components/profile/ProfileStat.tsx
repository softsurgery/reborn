import React from "react";
import { cn } from "@reborn/lib";
import { View } from "react-native";
import { Mail, Pencil, UserPlus } from "lucide-react-native";
import { Icon } from "@reborn/mobile-ui";
import { Text } from "@reborn/mobile-ui";
import { router } from "expo-router";
import { ResponseUserDto } from "@/types";
import { useTranslation } from "@reborn/i18n";
import { useColorPalette } from "@reborn/mobile-components";
import { Button } from "@reborn/mobile-ui";
import { useRTL } from "@reborn/mobile-components";

interface ProfileStatProps {
  className?: string;
  user?: ResponseUserDto;
  currentUser?: ResponseUserDto | null;
  sendVerifyEmail?: () => void;
  isSendVerifyEmailPending?: boolean;
  isFollowing?: boolean;
  onFollowPress?: () => void;
  onSendMessagePress?: () => void;
}

export const ProfileStat = ({
  className,
  user,
  currentUser,
  sendVerifyEmail,
  isSendVerifyEmailPending,
  isFollowing,
  onFollowPress,
  onSendMessagePress,
}: ProfileStatProps) => {
  const { palette } = useColorPalette();
  const { t } = useTranslation("menu");
  const isRTL = useRTL();
  const isCurrentUser = currentUser?.id === user?.id;

  const buttonFlexClass = isRTL ? "flex-row-reverse" : "flex-row";

  return (
    <View className={cn("flex flex-col gap-2", className)}>
      {isCurrentUser ? (
        <>
          <Button
            size={"sm"}
            variant={"outline"}
            onPress={() => router.push("/main/account/update-profile")}
            className={cn("items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 active:opacity-80", buttonFlexClass)}
          >
            <Icon as={Pencil} size={16} color={palette.foreground} />
            <Text className="text-sm font-semibold text-foreground">
              {t("menu.actions.editProfile")}
            </Text>
          </Button>
          {user?.email && !user.emailVerified && (
            <Button
              size={"sm"}
              onPress={() => sendVerifyEmail?.()}
              disabled={isSendVerifyEmailPending}
              className={cn("items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 active:opacity-80", buttonFlexClass)}
            >
              <Icon as={Mail} size={16} color={palette.primaryForeground} />
              <Text className="text-sm font-semibold text-primary-foreground">
                {t("menu.actions.verifyEmail")}
              </Text>
            </Button>
          )}
        </>
      ) : (
        <>
          <Button
            size={"sm"}
            variant={isFollowing ? "outline" : "default"}
            onPress={onFollowPress}
            className={cn("items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 active:opacity-80", buttonFlexClass)}
          >
            {!isFollowing && (
              <Icon
                as={UserPlus}
                size={16}
                color={palette.primaryForeground}
              />
            )}
            <Text
              className={cn(
                "text-sm font-semibold",
                isFollowing ? "text-foreground" : "text-primary-foreground",
              )}
            >
              {isFollowing
                ? t("menu.actions.following")
                : t("menu.actions.follow")}
            </Text>
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            onPress={onSendMessagePress}
            className={cn("items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 active:opacity-80", buttonFlexClass)}
          >
            <Icon as={Mail} size={16} color={palette.foreground} />
            <Text className="text-sm font-semibold text-foreground">
              {t("menu.actions.sendMessage")}
            </Text>
          </Button>
        </>
      )}
    </View>
  );
};
