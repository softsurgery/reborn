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
import { useIsFollowing } from "~/hooks/useIsFollowing";
import { ServerErrorResponse } from "~/types";

interface ProfileManagmentCardProps {
  className?: string;
}

export const ProfileManagmentCard = ({
  className,
}: ProfileManagmentCardProps) => {
  const queryClient = useQueryClient();
  const clientStore = useClientStore();
  const { currentUser } = useCurrentUser();
  const { isFollowing, refetchIsFollowing } = useIsFollowing({
    id: clientStore.response?.id!,
  });

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
      showToastable({ message: "Followed successfully" });
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
      showToastable({ message: "Unfollowed successfully" });
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
          <View className="w-[30%]">
            <Avatar alt={fallback} className="mx-auto border border-border">
              <AvatarImage source={{ uri: clientStore.picture }} />
              <AvatarFallback>
                <Text>{fallback}</Text>
              </AvatarFallback>
            </Avatar>
          </View>
          {/* info block */}
          <View className="flex flex-col justify-between gap-6 w-[60%]">
            {/* identity */}
            <Text className="text-xl">{identity}</Text>
            <View className="flex flex-row w-full gap-2">
              <View className="flex items-center w-1/3 border-r-2 border-border">
                <Text className="text-xl">-</Text>
                <Text className="font-light">Services</Text>
              </View>
              <View className="flex items-center w-1/3 border-r-2 border-border">
                <Text className="text-xl">
                  {clientStore.responseFollowCountsDto?.following}
                </Text>
                <Text className="font-light">Following</Text>
              </View>
              <View className="flex items-center w-1/3">
                <Text className="text-xl">
                  {clientStore.responseFollowCountsDto?.followers}
                </Text>
                <Text className="font-light">Followers</Text>
              </View>
            </View>
          </View>
        </View>
      </CardHeader>
      <CardContent>
        <View className="flex flex-col items-start">
          <Text className="text-xs">{clientStore.response?.profile?.bio}</Text>
        </View>
      </CardContent>
      <CardFooter>
        {!isCurrentUser && (
          <View className="flex flex-row w-full justify-between gap-2">
            <Button
              size="sm"
              onPress={() => (isFollowing ? unfollowUser() : followUser())}
              className="flex flex-row gap-2 w-1/2"
            >
              <Icon name={UserPlus} size={20} />
              <Text>{isFollowing ? "Unfollow" : "Follow"}</Text>
            </Button>
            <Button size="sm" className="flex flex-row gap-2 w-1/2">
              <Icon name={Mail} size={20} />
              <Text>Send Message</Text>
            </Button>
          </View>
        )}
      </CardFooter>
    </Card>
  );
};
