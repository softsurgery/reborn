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

export interface MenuTabAvatarProps {
  color?: ColorValue;
  focused: boolean;
}

export const MenuTabAvatar = ({ color, focused }: MenuTabAvatarProps) => {
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

  const size = focused ? 28 : 24;

  return (
    <Avatar
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
          <Text style={{ fontSize: focused ? 11 : 10, fontWeight: "700" }}>
            {avatarInitials}
          </Text>
        ) : (
          <Icon as={User} size={focused ? 20 : 18} color={color as string} />
        )}
      </AvatarFallback>
    </Avatar>
  );
};
