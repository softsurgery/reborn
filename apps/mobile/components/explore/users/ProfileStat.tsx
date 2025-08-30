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
import { ClientStore } from "~/hooks/stores/useClientStore";
import { cn } from "~/lib/utils";
import { UserEntry } from "./UserEntry";
import { StableScrollView } from "~/components/shared/StableScrollView";

interface ProfileStatProps {
  className?: string;
  clientStore: ClientStore;
}

export const ProfileStat = ({ className, clientStore }: ProfileStatProps) => {
  const [openFollowing, setOpenFollowing] = React.useState(false);
  const [openFollowers, setOpenFollowers] = React.useState(false);

  return (
    <View
      className={cn(
        "flex flex-row w-full items-center justify-between",
        className
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
        <DialogTrigger asChild disabled={clientStore.following.length === 0}>
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
        <DialogContent className="w-[90vw] min-h-[50vh] py-0">
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          <StableScrollView className="flex flex-col">
            {clientStore.following.map((f) => (
              <UserEntry
                key={f.id}
                user={f.following}
                clientStore={clientStore}
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
        <DialogContent className="w-[90vw] min-h-[50vh] py-0">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          <StableScrollView className="flex flex-col">
            {clientStore.followers.map((f) => (
              <UserEntry
                key={f.id}
                user={f.follower}
                clientStore={clientStore}
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
