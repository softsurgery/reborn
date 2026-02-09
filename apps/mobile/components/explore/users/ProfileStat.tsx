import React from "react";
import { View } from "react-native";
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
import { UserEntry } from "./UserEntry";
import { StableScrollView } from "~/components/shared/StableScrollView";

interface ProfileStatProps {
  className?: string;
  clientStore: UserStore;
}

export const ProfileStat = ({ className, clientStore }: ProfileStatProps) => {
  const [openFollowing, setOpenFollowing] = React.useState(false);
  const [openFollowers, setOpenFollowers] = React.useState(false);

  return (
    <View
      className={cn(
        "flex flex-row flex-1 w-full items-center justify-between",
        className,
      )}
    >
      {/* Services */}
      <Dialog>
        <DialogTrigger asChild>
          <StablePressable
            className="flex flex-col items-center"
            onPressClassname="opacity-70"
          >
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
      <Dialog open={openFollowing} onOpenChange={setOpenFollowing}>
        <DialogTrigger asChild disabled={clientStore.followings.length === 0}>
          <StablePressable
            className="flex flex-col items-center"
            onPressClassname="opacity-70"
          >
            <Text variant={"large"}>
              {clientStore?.responseFollowCountsDto?.following}
            </Text>
            <Text variant={"muted"}>Following</Text>
          </StablePressable>
        </DialogTrigger>
        <DialogContent className="w-[90vw] p-2">
          <StableScrollView className="flex flex-col max-h-[50vh] overflow-y-scroll pb-4">
            {clientStore.followings.map((f) => (
              <UserEntry
                key={f.id}
                user={f.following}
                userStore={clientStore}
                className="mt-4"
                closeDialog={() => setOpenFollowing(false)}
              />
            ))}
          </StableScrollView>
        </DialogContent>
      </Dialog>

      {/* Followers */}
      <Dialog open={openFollowers} onOpenChange={setOpenFollowers}>
        <DialogTrigger asChild disabled={clientStore.followers.length === 0}>
          <StablePressable
            className="flex flex-col items-center"
            onPressClassname="opacity-70"
          >
            <Text variant={"large"}>
              {clientStore?.responseFollowCountsDto?.followers}
            </Text>
            <Text variant={"muted"}>Followers</Text>
          </StablePressable>
        </DialogTrigger>
        <DialogContent className="w-[90vw] p-2">
          <StableScrollView className="flex flex-col max-h-[50vh] overflow-y-scroll pb-4">
            {clientStore.followers.map((f) => (
              <UserEntry
                key={f.id}
                user={f.follower}
                userStore={clientStore}
                className="mt-4"
                closeDialog={() => setOpenFollowers(false)}
              />
            ))}
          </StableScrollView>
        </DialogContent>
      </Dialog>
    </View>
  );
};
