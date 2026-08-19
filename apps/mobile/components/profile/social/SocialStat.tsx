import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { useUserStore } from "~/hooks/stores/useUserStore";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";

interface SocialStatProps {
  className?: string;
  userId?: string;
}

export const SocialStat = ({ className, userId }: SocialStatProps) => {
  const { t } = useTranslation("menu");
  const clientStore = useUserStore();
  const targetId = userId || clientStore?.response?.id;

  const followingCount = clientStore?.responseFollowCountsDto?.following ?? 0;
  const followersCount = clientStore?.responseFollowCountsDto?.followers ?? 0;

  return (
    <View
      className={cn(
        "flex flex-row w-full items-center justify-between",
        className,
      )}
    >
      {/* Services */}

      <Pressable className="flex flex-col items-center active:opacity-70">
        <Text variant={"large"}>-</Text>
        <Text variant={"muted"}>{t("menu.social.services")}</Text>
      </Pressable>

      {/* Following */}
      <Pressable
        className="flex flex-col items-center active:opacity-70"
        disabled={!targetId}
        onPress={() => {
          if (targetId) {
            router.push({
              pathname: "/main/connections",
              params: { id: targetId, tab: "following" },
            });
          }
        }}
      >
        <Text variant={"large"}>{followingCount}</Text>
        <Text variant={"muted"}>{t("menu.social.following")}</Text>
      </Pressable>

      {/* Followers */}
      <Pressable
        className="flex flex-col items-center active:opacity-70"
        disabled={!targetId}
        onPress={() => {
          if (targetId) {
            router.push({
              pathname: "/main/connections",
              params: { id: targetId, tab: "followers" },
            });
          }
        }}
      >
        <Text variant={"large"}>{followersCount}</Text>
        <Text variant={"muted"}>{t("menu.social.followers")}</Text>
      </Pressable>
    </View>
  );
};
