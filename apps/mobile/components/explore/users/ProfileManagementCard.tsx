import React from "react";
import { Text } from "~/components/ui/text";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shared/StableAvatar";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { Button } from "~/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { UserStore } from "~/hooks/stores/useUserStore";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { Mail, UserPlus } from "lucide-react-native";
import { ServerErrorResponse } from "~/types";
import { ProfileStat } from "./ProfileStat";
import { useFollowSystem } from "~/hooks/content/useFollowSystem";
import { Icon } from "~/components/ui/icon";
import { toast } from "sonner-native";

interface ProfileManagmentCardProps {
  className?: string;
  clientStore: UserStore;
}

export const ProfileManagmentCard = ({
  className,
  clientStore,
}: ProfileManagmentCardProps) => {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();
  const {
    isFollowing,
    refetchIsFollowing,
    followers,
    followings,
    refetchFollowers,
    refetchFollowing,
    followUser,
    isFollowPending,
    unfollowUser,
    isUnfollowPending,
  } = useFollowSystem({
    id: clientStore?.response?.id!,
    use: ["is-following", "followers", "followings"],
    follow: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["follow-data-count", clientStore?.response?.id],
        });
        refetchFollowers();
        refetchFollowing();
        refetchIsFollowing();
      },
      onError: (err: ServerErrorResponse) => {
        toast.error(err.response?.data.message || "Failed to follow user");
      },
    },
    unfollow: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["follow-data-count", clientStore?.response?.id],
        });
        refetchFollowers();
        refetchFollowing();
        refetchIsFollowing();
      },
      onError: (err: ServerErrorResponse) => {
        toast.error(err.response?.data.message || "Failed to unfollow user");
      },
    },
  });

  React.useEffect(() => {
    clientStore.set("followers", followers);
    clientStore.set("followings", followings);
  }, [followers, followings]);

  const isCurrentUser = React.useMemo(() => {
    return clientStore?.response?.id === currentUser?.id;
  }, [clientStore?.response, currentUser]);

  const identity = React.useMemo(
    () => identifyUser(clientStore?.response),
    [clientStore?.response],
  );

  const fallback = React.useMemo(
    () => identifyUserAvatar(clientStore?.response),
    [clientStore?.response],
  );

  return (
    <Card className={cn("w-full items-center justify-center", className)}>
      <CardHeader className="w-full">
        <View className="flex flex-row justify-between items-center">
          {/* avatar */}
          <View className="w-[30%] ">
            <Avatar alt={fallback} className="border border-border">
              <AvatarImage source={{ uri: clientStore.picture }} />
              <AvatarFallback>
                <Text>{fallback}</Text>
              </AvatarFallback>
            </Avatar>
          </View>
          {/* info block */}
          <View className="flex flex-col justify-between w-[60%] items-start">
            {/* identity */}
            <Text variant={"large"}>{identity}</Text>
            {/* stats */}
            <ProfileStat clientStore={clientStore} />
          </View>
        </View>
      </CardHeader>
      <CardContent className="w-full">
        <Text variant={"small"}>{clientStore?.response?.bio}</Text>
      </CardContent>
      {!isCurrentUser && (
        <CardFooter>
          <View className="flex flex-row w-full justify-between gap-2">
            <Button
              size="sm"
              onPress={() => (isFollowing ? unfollowUser() : followUser())}
              variant={isFollowing ? "outline" : "default"}
              className="flex flex-row flex-1 gap-2 "
              disabled={isFollowPending || isUnfollowPending}
            >
              {!isFollowing && <Icon as={UserPlus} size={20} />}
              <Text>{isFollowing ? "Following" : "Follow"}</Text>
            </Button>
            <Button
              size="sm"
              className="flex flex-row flex-1 gap-2"
              variant="outline"
            >
              <Icon as={Mail} size={20} />
              <Text>Send Message</Text>
            </Button>
          </View>
        </CardFooter>
      )}
    </Card>
  );
};
