import React from "react";
import { Bell, FlaskConical, Settings, User } from "lucide-react-native";
import { ApplicationHeader } from "../shared/AppHeader";
import { router } from "expo-router";
import { StableSafeAreaView } from "../shared/stables/StableSafeAreaView";
import { cn } from "~/lib/utils";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { View } from "react-native";
import { InspectBaseProfile } from "./BaseProfile";
import { useColorPalette } from "@/hooks/useColorPalette";
import { hslToHex } from "@/lib/theme";

interface ProfilePortalProps {
  className?: string;
}

export const ProfilePortal = ({ className }: ProfilePortalProps) => {
  const { palette } = useColorPalette();
  const { t } = useTranslation("common");
  const { currentUser } = useCurrentUser();

  const { count } = useNotificationContext();

  return (
    <View className={cn("flex-1", className)}>
      <InspectBaseProfile
        id={currentUser?.id as string}
        coverExtra={
          <StableSafeAreaView
            className="absolute top-0 left-0 right-0 z-30"
            pointerEvents="box-none"
          >
            <ApplicationHeader
              title={t("screens.menu")}
              classNames={{
                title: "text-slate-900 dark:text-foreground",
              }}
              shortcuts={[
                {
                  key: "settings",
                  icon: Settings,
                  color: hslToHex(palette.foreground),
                  onPress: () => router.push("/main/settings"),
                },
                {
                  key: "notifications",
                  icon: Bell,
                  color: hslToHex(palette.foreground),
                  onPress: () => {
                    router.push("/main/notifications");
                  },
                  badgeText: count > 0 ? `${count}` : undefined,
                },
                ...(__DEV__
                  ? [
                      {
                        key: "flask",
                        color: hslToHex(palette.foreground),
                        icon: FlaskConical,
                        onPress: () => router.push("/main/test"),
                      },
                    ]
                  : []),
              ]}
            />
          </StableSafeAreaView>
        }
      />
    </View>
  );
};
