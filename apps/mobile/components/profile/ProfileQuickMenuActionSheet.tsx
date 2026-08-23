import React, { forwardRef, useImperativeHandle, useRef } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { View, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  User,
  Settings,
  Bell,
  Pencil,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react-native";
import { Text } from "~/components/ui/text";
import { Icon } from "~/components/ui/icon";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useServerImage } from "~/hooks/content/useServerImage";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { useColorPalette } from "@/hooks/useColorPalette";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/stables/StableAvatar";

interface ProfileQuickMenuActionSheetProps {
  onClose?: () => void;
}

export const ProfileQuickMenuActionSheet = forwardRef<
  ActionSheetRef,
  ProfileQuickMenuActionSheetProps
>(({ onClose }, ref) => {
  const { palette } = useColorPalette();
  const { currentUser } = useCurrentUser();
  const sheetRef = useRef<ActionSheetRef>(null);

  useImperativeHandle(ref, () => sheetRef.current as ActionSheetRef);

  const userAvatarInitials = React.useMemo(
    () => identifyUserAvatar(currentUser),
    [currentUser],
  );
  const displayName = React.useMemo(
    () => identifyUser(currentUser) || "Profile",
    [currentUser],
  );

  const { upload } = useServerImage({
    id: currentUser?.pictureId,
    enabled: !!currentUser?.pictureId,
  });

  const handleAction = async (action: () => void) => {
    await Haptics.selectionAsync();
    sheetRef.current?.hide();
    action();
  };

  const quickActions = [
    {
      id: "view-profile",
      title: "View Profile",
      description: "Inspect your full profile page",
      icon: User,
      action: () => router.push("/main/(tabs)/menu"),
    },
    {
      id: "edit-profile",
      title: "Edit Profile",
      description: "Update your personal details & avatar",
      icon: Pencil,
      action: () => router.push("/main/account/update-profile"),
    },
    {
      id: "settings",
      title: "Settings",
      description: "Privacy, preferences, and security",
      icon: Settings,
      action: () => router.push("/main/settings"),
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Check your recent activity and alerts",
      icon: Bell,
      action: () => router.push("/main/notifications"),
    },
  ];

  return (
    <ActionSheet
      ref={sheetRef}
      gestureEnabled
      statusBarTranslucent
      defaultOverlayOpacity={0.45}
      onClose={onClose}
      containerStyle={{
        backgroundColor: palette.card,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 36,
      }}
    >
      <View className="gap-5">
        {/* Profile Header */}
        <View className="flex-row items-center justify-between pb-4 border-b border-border pt-1">
          <View className="flex-row items-center gap-3.5 flex-1 pr-2">
            <Avatar
              style={{ width: 54, height: 54 }}
              className="border-2 border-primary"
            >
              <AvatarImage source={{ uri: upload ?? "" }} />
              <AvatarFallback>
                <Text className="text-base font-bold text-foreground">
                  {userAvatarInitials}
                </Text>
              </AvatarFallback>
            </Avatar>

            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text
                  className="text-lg font-bold text-foreground"
                  numberOfLines={1}
                >
                  {displayName}
                </Text>
                <Sparkles size={16} color={palette.primary} />
              </View>
              {currentUser?.username && (
                <Text
                  className="text-xs text-muted-foreground font-medium"
                  numberOfLines={1}
                >
                  @{currentUser.username}
                </Text>
              )}
              {currentUser?.email && (
                <Text
                  className="text-xs text-muted-foreground/70"
                  numberOfLines={1}
                >
                  {currentUser.email}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => sheetRef.current?.hide()}
            hitSlop={12}
            className="w-8 h-8 rounded-full bg-muted items-center justify-center"
          >
            <Icon as={X} size={18} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions List */}
        <View className="gap-2.5">
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleAction(item.action)}
              className="flex-row items-center justify-between p-3.5 rounded-2xl bg-muted/40 active:bg-muted/80 transition-colors"
            >
              <View className="flex-row items-center gap-3.5 flex-1">
                <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
                  <Icon as={item.icon} size={20} color={palette.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    {item.title}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {item.description}
                  </Text>
                </View>
              </View>
              <Icon
                as={ChevronRight}
                size={18}
                className="text-muted-foreground"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ActionSheet>
  );
});

ProfileQuickMenuActionSheet.displayName = "ProfileQuickMenuActionSheet";
