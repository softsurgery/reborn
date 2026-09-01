import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ChevronRight } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { useServerImages } from "@/hooks/content/useServerImages";
import { ResponseUserDto } from "@/types";
import { cn } from "@/lib/utils";

interface RequestUserEntryProps {
  user?: ResponseUserDto;
  isIncoming: boolean;
  className?: string;
}

export const RequestUserEntry = ({
  user,
  isIncoming,
  className,
}: RequestUserEntryProps) => {
  const {
    jsxArray: [profilePicture],
  } = useServerImages({
    ids: [user?.pictureId],
    size: { width: 48, height: 48 },
    fallbacks: [identifyUserAvatar(user)],
    className: "rounded-full border border-border",
  });

  const navigateToProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (user?.id) {
      router.push({
        pathname: "/main/explore/inspect-profile",
        params: { id: user.id },
      });
    }
  };

  return (
    <View className={cn(className)}>
      <Text className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {isIncoming ? "Applicant Candidate" : "Job Client"}
      </Text>

      <Pressable
        className="flex flex-row items-center justify-between pt-3 pb-6 active:opacity-50 gap-3"
        onPress={navigateToProfile}
      >
        <View className="flex flex-row items-center gap-3 flex-1">
          <View className="w-14 h-14 bg-primary/10 rounded-full items-center justify-center shrink-0">
            {profilePicture}
          </View>

          <View className="flex-1 min-w-0 justify-center">
            <Text
              className="text-base font-medium text-foreground  shrink min-w-0"
              numberOfLines={1}
            >
              {identifyUser(user)}
            </Text>

            {user?.email ? (
              <Text
                className="text-xs text-muted-foreground font-medium mt-0.5"
                numberOfLines={1}
              >
                {user.email}
              </Text>
            ) : (
              <Text className="text-xs text-muted-foreground font-medium mt-0.5">
                Tap to inspect profile
              </Text>
            )}
          </View>
        </View>
        <View className="w-8 h-8 items-center justify-center shrink-0">
          <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
        </View>
      </Pressable>
    </View>
  );
};
