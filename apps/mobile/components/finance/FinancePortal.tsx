import {
  View,
  ActivityIndicator,
  Pressable,
  ScrollView,
  RefreshControl,
  AppState,
} from "react-native";
import React from "react";
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
import { router, useFocusEffect } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { useColorPalette } from "~/hooks/useColorPalette";
import { Text } from "~/components/ui/text";
import { TransactionList } from "./transaction/TransactionList";
import { useBalance } from "@/hooks/content/finance/useBalance";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { useTranslation } from "react-i18next";
import { toast } from "sonner-native";
import { triggerHaptic } from "~/lib/haptics";
import { Icon } from "~/components/ui/icon";

const MASKED_VALUE = "••••";

interface FinancePortalProps {
  className?: string;
}

export const FinancePortal = ({ className }: FinancePortalProps) => {
  const { t } = useTranslation("finance");
  const { count } = useNotificationContext();
  const { palette } = useColorPalette();
  const queryClient = useQueryClient();
  const { authenticate } = useBiometricAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);

  const { data: balanceData, isLoading: isLoadingBalance } = useBalance();

  const hideDetails = React.useCallback(() => {
    setDetailsVisible(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        hideDetails();
      };
    }, [hideDetails]),
  );

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active") {
        hideDetails();
      }
    });

    return () => subscription.remove();
  }, [hideDetails]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["finance"] });
    setRefreshing(false);
  }, [queryClient]);

  const toggleDetails = React.useCallback(async () => {
    if (isAuthenticating) return;

    if (detailsVisible) {
      hideDetails();
      return;
    }

    setIsAuthenticating(true);
    const result = await authenticate({
      promptMessage: t("biometric_prompt"),
      promptDescription: t("biometric_prompt_description"),
      cancelLabel: t("cancel"),
    });
    setIsAuthenticating(false);

    if (result.success) {
      setDetailsVisible(true);
      triggerHaptic();
      return;
    }

    if (result.cancelled) return;

    toast.error(
      result.error === "not_enrolled"
        ? t("biometric_unavailable")
        : result.error === "missing_usage_description"
          ? t("biometric_faceid_not_configured")
          : t("biometric_failed"),
    );
  }, [authenticate, detailsVisible, hideDetails, isAuthenticating, t]);

  const currentPoints = Number(balanceData?.points || 0);
  const currentBalance = Number(balanceData?.balance || 0);

  const renderAmount = (value: string) => {
    if (!detailsVisible) {
      return (
        <Text className="text-2xl font-bold text-foreground">
          {MASKED_VALUE}
        </Text>
      );
    }

    if (isLoadingBalance) {
      return <ActivityIndicator size="small" />;
    }

    return (
      <Text className="text-2xl font-bold text-foreground">{value}</Text>
    );
  };

  return (
    <StableSafeAreaView className={cn("flex flex-1 flex-col", className)}>
      <ApplicationHeader
        title={"Finance"}
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

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="pt-4 px-4 pb-8"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2">
              <Wallet size={20} color={palette.primary} />
              <Text className="text-lg font-semibold text-foreground">
                Assets
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
          <View className="flex-row flex-1 bg-background px-0 pt-0 pb-6 gap-2">
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
                Balance
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
              <Text className="text-xs text-muted-foreground mt-1">Points</Text>
            </Pressable>
          </View>
        </View>
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2">
              <TrendingUp size={20} color={palette.primary} />
              <Text className="text-lg font-semibold text-foreground">
                Transaction History
              </Text>
            </View>
          </View>
          <TransactionList limit={5} />
        </View>
      </ScrollView>
    </StableSafeAreaView>
  );
};
