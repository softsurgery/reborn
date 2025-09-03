import { Pressable } from "react-native";
import { Text } from "../ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "../shared/StableAvatar";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { ResponseClientDto } from "~/types";
import React from "react";
import { identifyUserAvatar } from "~/lib/user.utils";
import { cn } from "~/lib/utils";

interface UserBubbleProps {
  className?: string;
  user: ResponseClientDto;
}

export const UserBubble = ({ className, user }: UserBubbleProps) => {
  const { data: profilePicture } = useQuery({
    queryKey: ["profile-picture", user?.profile?.pictureId],
    queryFn: () => api.upload.getUploadById(user?.profile?.pictureId!),
    enabled: !!user?.profile?.pictureId,
    staleTime: Infinity,
  });

  const fallback = React.useMemo(() => identifyUserAvatar(user), [user]);

  return (
    <Pressable
      className={cn(
        "flex flex-col items-center justify-center gap-1",
        className
      )}
    >
      <Avatar
        alt={fallback}
        className="border border-border"
        style={{ width: 50, height: 50, borderRadius: 25 }}
      >
        <AvatarImage source={profilePicture} />
        <AvatarFallback>
          <Text>{fallback}</Text>
        </AvatarFallback>
      </Avatar>
    </Pressable>
  );
};
