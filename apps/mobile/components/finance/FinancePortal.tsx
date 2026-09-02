import React from "react";
import { View } from "react-native";
import { Bell } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { StableSafeAreaView } from "../shared/stables/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { router } from "expo-router";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { useTranslation } from "react-i18next";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { useColorPalette } from "~/hooks/useColorPalette";
import { hslToHex } from "~/lib/theme";
import { FinanceOverviewTab } from "./FinanceOverviewTab";
import { FinanceTransactionsTab } from "./FinanceTransactionsTab";

const Tab = createMaterialTopTabNavigator();

interface FinancePortalProps {
  className?: string;
}

export const FinancePortal = ({ className }: FinancePortalProps) => {
  const { t } = useTranslation(["common", "finance"]);
  const { count } = useNotificationContext();
  const { palette } = useColorPalette();

  return (
    <StableSafeAreaView className={cn("flex flex-1 flex-col", className)}>
      <View>
        <ApplicationHeader
          title={t("screens.finance", { defaultValue: "Finance" })}
          shortcuts={[
            {
              key: "notifications",
              icon: Bell,
              onPress: () => {
                router.push("/main/notifications");
              },
              badgeText: count > 0 ? `${count}` : undefined,
            },
          ]}
        />
      </View>

      <View className="flex-1">
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: false,
            tabBarActiveTintColor: palette.foreground,
            tabBarInactiveTintColor: palette.mutedForeground,
            tabBarLabelStyle: {
              fontSize: 13,
              fontWeight: "600",
              textTransform: "none",
            },
            tabBarIndicatorStyle: {
              backgroundColor: hslToHex(palette.primary),
              height: 2,
              borderRadius: 2,
            },
            tabBarStyle: {
              backgroundColor: "transparent",
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: palette.border,
            },
          }}
        >
          <Tab.Screen
            name="overview"
            options={{ tabBarLabel: t("finance:overview", "Overview") }}
          >
            {() => <FinanceOverviewTab />}
          </Tab.Screen>
          <Tab.Screen
            name="transactions"
            options={{ tabBarLabel: t("finance:transactions", "Transactions") }}
          >
            {() => <FinanceTransactionsTab />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </StableSafeAreaView>
  );
};
