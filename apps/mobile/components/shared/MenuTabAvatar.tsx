import React from "react";
import { ColorValue } from "react-native";
import { User } from "lucide-react-native";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useServerImages } from "@/hooks/content/useServerImages";
import { identifyUserAvatar } from "~/lib/user.utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/stables/StableAvatar";
import { Text } from "~/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface MenuTabAvatarProps {
  className?: string;
  size?: number;
  color?: ColorValue;
  focused: boolean;
}

export const MenuTabAvatar = ({
  className,
  size = 28,
  color,
  focused,
}: MenuTabAvatarProps) => {
  const { palette } = useColorPalette();
  const { currentUser } = useCurrentUser({ join: ["picture"] });

  const avatarInitials = React.useMemo(
    () => identifyUserAvatar(currentUser),
    [currentUser],
  );

  const pictureId = currentUser?.pictureId ?? currentUser?.picture?.id;

  const { uploads } = useServerImages({
    ids: [pictureId],
    enabled: !!pictureId,
  });

  const upload = uploads?.[0];

  // Scale fallback content relative to avatar size.
  const initialsFontSize = Math.max(8, Math.round(size * 0.38));
  const iconSize = Math.max(12, Math.round(size * 0.65));

  return (
    <Avatar
      className={cn(className)}
      style={{
        width: size,
        height: size,
        borderWidth: focused ? 2 : 1,
        borderColor: focused ? palette.primary : palette.border,
      }}
    >
      <AvatarImage source={upload} />

      <AvatarFallback>
        {avatarInitials && avatarInitials !== "?" ? (
          <Text
            style={{
              fontSize: initialsFontSize,
              fontWeight: "700",
            }}
          >
            {avatarInitials}
          </Text>
        ) : (
          <Icon as={User} size={iconSize} color={color as string} />
        )}
      </AvatarFallback>
    </Avatar>
  );
};
