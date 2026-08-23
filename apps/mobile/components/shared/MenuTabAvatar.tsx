import React from "react";
import { ColorValue, Image, View } from "react-native";
import { User } from "lucide-react-native";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useServerImage } from "~/hooks/content/useServerImage";
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
  const { currentUser } = useCurrentUser();
  const avatarInitials = React.useMemo(
    () => identifyUserAvatar(currentUser),
    [currentUser],
  );

  const { upload } = useServerImage({
    id: currentUser?.pictureId,
    enabled: !!currentUser?.pictureId,
  });

  const size = focused ? 28 : 24;

  if (upload) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 9999,
          borderWidth: focused ? 2 : 1,
          borderColor: focused ? palette.primary : palette.border,
          overflow: "hidden",
        }}
        className="items-center justify-center bg-muted"
      >
        <Image
          source={{ uri: upload }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
    );
  }

  if (avatarInitials) {
    return (
      <Avatar
        style={{
          width: size,
          height: size,
          borderWidth: focused ? 2 : 1,
          borderColor: focused ? palette.primary : palette.border,
        }}
      >
        <AvatarImage />
        <AvatarFallback>
          <Text style={{ fontSize: focused ? 11 : 10, fontWeight: "700" }}>
            {avatarInitials}
          </Text>
        </AvatarFallback>
      </Avatar>
    );
  }

  return <Icon as={User} size={focused ? 28 : 24} color={color as string} />;
};
