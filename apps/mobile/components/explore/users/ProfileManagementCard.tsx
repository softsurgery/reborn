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
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { Button } from "~/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/api";
import { useClientStore } from "~/hooks/stores/useClientStore";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { showToastable } from "react-native-toastable";
import Icon from "~/lib/Icon";
import { Mail, UserPlus } from "lucide-react-native";
import { ServerErrorResponse } from "~/types";
import { ProfileStat } from "./ProfileStat";
import { useFollowSystem } from "~/hooks/useFollowSystem";

interface ProfileManagmentCardProps {
  className?: string;
}

export const ProfileManagmentCard = ({
  className,
}: ProfileManagmentCardProps) => {
  const queryClient = useQueryClient();
  const clientStore = useClientStore();
  const { currentUser } = useCurrentUser();
  const { isFollowing, refetchIsFollowing, followers, following } =
    useFollowSystem({
      id: clientStore.response?.id!,
      fetch: ["is-following", "followers", "following"],
    });

  React.useEffect(() => {
    clientStore.set("followers", followers);
    clientStore.set("following", following);
  }, [followers, following]);

  const isCurrentUser = React.useMemo(() => {
    return clientStore.response?.id === currentUser?.id;
  }, [clientStore.response, currentUser]);

  const { mutate: followUser } = useMutation({
    mutationFn: () => api.follow.followUser(clientStore.response?.id!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["follow-data-count", clientStore.response?.id],
      });
      refetchIsFollowing();
    },
    onError: () => {
      showToastable({ message: "Failed to follow user" });
    },
  });

  const { mutate: unfollowUser } = useMutation({
    mutationFn: () => api.follow.unfollowUser(clientStore.response?.id!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["follow-data-count", clientStore.response?.id],
      });
      refetchIsFollowing();
    },
    onError: (err: ServerErrorResponse) => {
      console.log(err.response?.data.message);
      showToastable({ message: "Failed to unfollow user" });
    },
  });

  const identity = React.useMemo(
    () => identifyUser(clientStore.response),
    [clientStore.response]
  );

  const fallback = React.useMemo(
    () => identifyUserAvatar(clientStore.response),
    [clientStore.response]
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
          <View className="flex flex-col justify-between gap-6 w-[60%] items-start">
            {/* identity */}
            <Text variant={"h4"}>{identity}</Text>
            {/* stats */}
            <ProfileStat />
          </View>
        </View>
      </CardHeader>
      <CardContent className="w-full">
        <Text variant={"small"}>{clientStore.response?.profile?.bio}</Text>
      </CardContent>
      {!isCurrentUser && (
        <CardFooter>
          <View className="flex flex-row w-full justify-between gap-2">
            <Button
              size="sm"
              onPress={() => (isFollowing ? unfollowUser() : followUser())}
              variant={isFollowing ? "outline" : "default"}
              className="flex flex-row gap-2 w-1/2"
            >
              {!isFollowing && <Icon name={UserPlus} size={20} />}
              <Text>{isFollowing ? "Following" : "Follow"}</Text>
            </Button>
            <Button
              size="sm"
              className="flex flex-row gap-2 w-1/2"
              variant="outline"
            >
              <Icon name={Mail} size={20} />
              <Text>Send Message</Text>
            </Button>
          </View>
        </CardFooter>
      )}
    </Card>
  );
};
