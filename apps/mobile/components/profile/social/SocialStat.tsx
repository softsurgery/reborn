import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import { useUserStore } from "~/hooks/stores/useUserStore";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";

interface SocialStatProps {
  className?: string;
}

export const SocialStat = ({ className }: SocialStatProps) => {
  const { t } = useTranslation("menu");
  const clientStore = useUserStore();
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
        disabled={
          !clientStore?.response?.id || clientStore.followings.length === 0
        }
        onPress={() =>
          router.push({
            pathname: "/main/connections",
            params: { id: clientStore?.response?.id, tab: "following" },
          })
        }
      >
        <Text variant={"large"}>
          {clientStore?.responseFollowCountsDto?.following}
        </Text>
        <Text variant={"muted"}>{t("menu.social.following")}</Text>
      </Pressable>

      {/* Followers */}
      <Pressable
        className="flex flex-col items-center active:opacity-70"
        disabled={
          !clientStore?.response?.id || clientStore.followers.length === 0
        }
        onPress={() =>
          router.push({
            pathname: "/main/connections",
            params: { id: clientStore?.response?.id, tab: "followers" },
          })
        }
      >
        <Text variant={"large"}>
          {clientStore?.responseFollowCountsDto?.followers}
        </Text>
        <Text variant={"muted"}>{t("menu.social.followers")}</Text>
      </Pressable>
    </View>
  );
};
