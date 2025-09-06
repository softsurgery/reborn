import React from "react";
import { Pressable } from "react-native";
import { ResponseClientDto } from "~/types";
import { identifyUserAvatar } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { useServerImage } from "~/hooks/content/useServerImage";

interface UserBubbleProps {
  className?: string;
  user: ResponseClientDto;
}

export const UserBubble = ({ className, user }: UserBubbleProps) => {
  const { jsx: profilePicture } = useServerImage({
    id: user?.profile?.pictureId,
    fallback: identifyUserAvatar(user),
    size: { width: 100, height: 100 },
  });

  return (
    <Pressable
      className={cn(
        "flex flex-col items-center justify-center gap-1",
        className
      )}
    >
      {profilePicture}
    </Pressable>
  );
};
