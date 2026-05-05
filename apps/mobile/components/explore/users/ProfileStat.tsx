import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { StablePressable } from "~/components/shared/StablePressable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { UserStore } from "~/hooks/stores/useUserStore";
import { cn } from "~/lib/utils";

interface ProfileStatProps {
  className?: string;
  clientStore: UserStore;
}

export const ProfileStat = ({ className, clientStore }: ProfileStatProps) => {
  return (
    <View
      className={cn(
        "flex flex-row w-full items-center justify-between",
        className,
      )}
    >
      {/* Services */}
      <Dialog>
        <DialogTrigger asChild>
          <StablePressable className="flex flex-col items-center active:opacity-70">
            <Text variant={"large"}>-</Text>
            <Text variant={"muted"}>Services</Text>
          </StablePressable>
        </DialogTrigger>
        <DialogContent className="w-[90vw]">
          <DialogHeader>
            <DialogTitle>Services</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Following */}
      <StablePressable
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
        <Text variant={"muted"}>Following</Text>
      </StablePressable>

      {/* Followers */}
      <StablePressable
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
        <Text variant={"muted"}>Followers</Text>
      </StablePressable>
    </View>
  );
};
