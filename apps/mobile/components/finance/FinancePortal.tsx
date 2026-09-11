import {
  View,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  AppState,
} from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import {
  Bell,
  TrendingUp,
  Coins,
  Wallet,
  Banknote,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { cn } from "~/lib/utils";
import { StableSafeAreaView } from "../shared/stables/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { useColorPalette } from "~/hooks/useColorPalette";
import { Text } from "~/components/ui/text";
import { TransactionList } from "./transaction/TransactionList";
import { useBalance } from "@/hooks/content/finance/useBalance";
import { useFinanceAuth } from "@/hooks/content/finance/useFinanceAuth";
import { useFinanceStore } from "@/hooks/stores/useFinanceStore";
import { useTranslation } from "react-i18next";
import { triggerHaptic } from "~/lib/haptics";
import { Icon } from "~/components/ui/icon";
import { useRTL } from "@/hooks/useRTL";
import { useScrollableElement } from "~/hooks/useScrollableElement";
import { useDynamicListLimit } from "~/hooks/useDynamicListLimit";

interface FinancePortalProps {
  className?: string;
}

export const FinancePortal = ({ className }: FinancePortalProps) => {
  const { t } = useTranslation("finance");
  const { count } = useNotificationContext();
  const { palette } = useColorPalette();
  const queryClient = useQueryClient();
  const isRTL = useRTL();
  const { isAuthenticatedInSession, isAuthenticating, authenticateSession } =
    useFinanceAuth();
  const { detailsVisible, setDetailsVisible, resetSession } = useFinanceStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: balanceData, isLoading: isLoadingBalance } = useBalance();

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active") {
        resetSession();
      }
    });

    return () => subscription.remove();
  }, [resetSession]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["finance"] });
    setRefreshing(false);
  }, [queryClient]);

  const toggleDetails = React.useCallback(async () => {
    if (isAuthenticatedInSession) {
      setDetailsVisible(!detailsVisible);
      triggerHaptic();
      return;
    }

    await authenticateSession();
  }, [
    authenticateSession,
    detailsVisible,
    isAuthenticatedInSession,
    setDetailsVisible,
  ]);

  const currentPoints = Number(balanceData?.points || 0);
  const currentBalance = Number(balanceData?.balance || 0);

  const renderAmount = (value: string) => {
    if (!detailsVisible) {
      return <Text className="text-2xl font-bold text-foreground">••••</Text>;
    }

    if (isLoadingBalance) {
      return <ActivityIndicator size="small" />;
    }

    return <Text className="text-2xl font-bold text-foreground">{value}</Text>;
  };

  const dynamicLimit = useDynamicListLimit({
    staticHeight: 100 + 200 + 40 + 48 + 40,
    itemHeight: 72,
    minItems: 1,
    maxItems: 10,
  });

  const { animatedHeaderStyle, contentAnimatedStyle, handleScroll } =
    useScrollableElement({
      duration: 250,
      deltaThreshold: 40,
      checkScrollable: true,
    });

  return (
    <StableSafeAreaView className={cn("flex flex-1 flex-col", className)}>
      <Animated.View style={animatedHeaderStyle}>
        <ApplicationHeader
          title={t("title")}
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
      </Animated.View>

      <Animated.ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="pt-4 pb-8"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={contentAnimatedStyle}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-1 px-4">
          <View
            className={cn(
              "flex justify-between items-center mb-4",
              isRTL ? "flex-row-reverse" : "flex-row",
            )}
          >
            <View
              className={cn(
                "flex items-center gap-2",
                isRTL ? "flex-row-reverse" : "flex-row",
              )}
            >
              <Wallet size={20} color={palette.primary} />
              <Text className="text-lg font-semibold text-foreground">
                {t("assets")}
              </Text>
            </View>
            <Pressable
              className="p-1 rounded-full active:opacity-50"
              onPress={toggleDetails}
              disabled={isAuthenticating}
              accessibilityRole="button"
              accessibilityLabel={
                detailsVisible ? t("hide_details") : t("show_details")
              }
              accessibilityState={{ busy: isAuthenticating }}
            >
              {isAuthenticating ? (
                <ActivityIndicator size="small" color={palette.primary} />
              ) : (
                <Icon
                  as={detailsVisible ? EyeOff : Eye}
                  size={22}
                  color={palette.primary}
                />
              )}
            </Pressable>
          </View>
          <View
            className={cn(
              "flex flex-1 bg-background pb-6 gap-2",
              isRTL ? "flex-row-reverse" : "flex-row",
            )}
          >
            {/* Wallet Balance */}
            <Pressable
              className="flex-1 rounded-xl p-4 border border-border items-center justify-center active:opacity-50"
              onPress={() => router.push("/main/finance/topup")}
            >
              <View className="p-3 rounded-full bg-primary/10 mb-2">
                <Banknote size={24} color={palette.primary} />
              </View>
              {renderAmount(`${currentBalance.toFixed(2)} TND`)}
              <Text className="text-xs text-muted-foreground mt-1">
                {t("balance")}
              </Text>
            </Pressable>

            {/* Points Balance */}
            <Pressable
              className="flex-1 rounded-xl p-4 border border-border items-center justify-center active:opacity-50"
              onPress={() => router.push("/main/finance/topup")}
            >
              <View className="p-3 rounded-full bg-amber-500/10 mb-2">
                <Coins size={24} color={palette.secondary} />
              </View>
              {renderAmount(`${currentPoints}`)}
              <Text className="text-xs text-muted-foreground mt-1">
                {t("points")}
              </Text>
            </Pressable>
          </View>
        </View>
        <View className="px-4 flex-1">
          <View
            className={cn(
              "flex justify-between items-center mb-4",
              isRTL ? "flex-row-reverse" : "flex-row",
            )}
          >
            <View
              className={cn(
                "flex items-center gap-2",
                isRTL ? "flex-row-reverse" : "flex-row",
              )}
            >
              <TrendingUp size={20} color={palette.primary} />
              <Text className="text-lg font-semibold text-foreground">
                {t("transaction_history")}
              </Text>
            </View>
          </View>
          <TransactionList
            classNames={{
              item: "-px-4",
            }}
            limit={dynamicLimit}
          />
        </View>
      </Animated.ScrollView>
    </StableSafeAreaView>
  );
};
