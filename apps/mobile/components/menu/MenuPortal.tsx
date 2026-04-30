import React from "react";
import { Bell, FlaskConical, Settings, User } from "lucide-react-native";
import { ApplicationHeader } from "../shared/AppHeader";
import { router } from "expo-router";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { cn } from "~/lib/utils";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { View } from "react-native";
import { InspectBaseProfile } from "../profile/BaseProfile";

interface MenuPortalProps {
  className?: string;
}

export const MenuPortal = ({ className }: MenuPortalProps) => {
  const { t } = useTranslation("common");
  const { currentUser } = useCurrentUser();

  const { newCount, resetCount } = useNotificationContext();

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
              shortcuts={[
                {
                  key: "settings",
                  icon: Settings,
                  onPress: () => router.push("/main/settings"),
                },
                {
                  icon: Bell,
                  onPress: () => {
                    router.push("/main/notifications");
                    resetCount();
                  },
                  badgeText: newCount > 0 ? `${newCount}` : undefined,
                },
                ...(process.env.NODE_ENV === "development"
                  ? [
                      {
                        key: "flask",
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
