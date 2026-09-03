import React from "react";
import { View, ActivityIndicator, Pressable } from "react-native";
import { Bell, TrendingUp, Coins, Wallet, Banknote } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { StableSafeAreaView } from "../shared/stables/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { router } from "expo-router";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { useTranslation } from "react-i18next";
import { useColorPalette } from "~/hooks/useColorPalette";
import { Text } from "~/components/ui/text";
import { TransactionList } from "./transaction/TransactionList";
import { useBalance } from "@/hooks/content/finance/useBalance";

interface FinancePortalProps {
  className?: string;
}

export const FinancePortal = ({ className }: FinancePortalProps) => {
  const { t } = useTranslation(["common", "finance"]);
  const { count } = useNotificationContext();
  const { palette } = useColorPalette();
  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useBalance();

  const currentPoints = Number(balanceData?.points || 0);
  const currentBalance = Number(balanceData?.balance || 0);

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

      <View className="flex-1 bg-background p-4">
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2">
              <Wallet size={20} color={palette.primary} />
              <Text className="text-lg font-semibold text-foreground">
                Assets
              </Text>
            </View>
          </View>
          <View className="flex-row bg-background px-0 pt-0 pb-6 gap-2">
            {/* Wallet Balance */}
            <Pressable
              className="flex-1 rounded-xl p-4 border border-border items-center justify-center active:opacity-50"
              onPress={() => router.push("/main/finance/topup")}
            >
              <View className="p-3 rounded-full bg-primary/10 mb-2">
                <Banknote size={24} color={palette.primary} />
              </View>
              {isLoadingBalance ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text className="text-2xl font-bold text-foreground">
                  {currentBalance.toFixed(2)} TND
                </Text>
              )}
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
                <Coins size={24} color="#f59e0b" />
              </View>
              {isLoadingBalance ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text className="text-2xl font-bold text-foreground">
                  {currentPoints}
                </Text>
              )}
              <Text className="text-xs text-muted-foreground mt-1">Points</Text>
            </Pressable>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2">
              <TrendingUp size={20} color={palette.primary} />
              <Text className="text-lg font-semibold text-foreground">
                Transaction History
              </Text>
            </View>
          </View>
        </View>
        <TransactionList limit={5} />
      </View>
    </StableSafeAreaView>
  );
};
