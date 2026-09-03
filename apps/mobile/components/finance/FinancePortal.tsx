import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import {
  Bell,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  Coins,
  Wallet,
} from "lucide-react-native";
import { cn } from "~/lib/utils";
import { StableSafeAreaView } from "../shared/stables/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { router } from "expo-router";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { useTranslation } from "react-i18next";
import { useColorPalette } from "~/hooks/useColorPalette";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import {
  useBalance,
  usePointTransactions,
  useFundTransactions,
} from "~/hooks/content/finance/useFinance";
import { PointTransaction } from "~/api/finance";

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

  const {
    data: txData,
    isLoading: isLoadingTx,
    fetchNextPage,
    hasNextPage,
    refetch: refetchTx,
  } = usePointTransactions();

  const {
    data: fundTxData,
    isLoading: isLoadingFundTx,
    fetchNextPage: fetchNextFundPage,
    hasNextPage: hasNextFundPage,
    refetch: refetchFundTx,
  } = useFundTransactions();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchBalance(), refetchTx(), refetchFundTx()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchBalance, refetchTx, refetchFundTx]);

  const currentPoints = Number(balanceData?.points || 0);
  const currentBalance = Number(balanceData?.balance || 0);

  const pointTransactions = (
    txData?.pages.flatMap((page) => page.data) || []
  ).map((tx) => ({ ...tx, currencyType: "POINTS" }));
  const fundTransactions = (
    fundTxData?.pages.flatMap((page) => page.data) || []
  ).map((tx) => ({ ...tx, currencyType: "FUNDS" }));

  const transactions = [...pointTransactions, ...fundTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const isCredit = (type: PointTransaction["type"]) => {
    return [
      "CREDIT",
      "BOUGHT_VIA_CREDIT_CARD",
      "RECEIVED_PAYMENT",
      "APPLICATION_FEE_REFUNDED",
    ].includes(type as string);
  };

  const isDebit = (type: PointTransaction["type"]) => {
    return ["DEBIT", "APPLYING_FOR_JOB"].includes(type as string);
  };

  const getTransactionIcon = (type: PointTransaction["type"]) => {
    if (isCredit(type)) {
      return <ArrowUpRight size={18} color="#16a34a" />;
    }
    if (isDebit(type)) {
      return <ArrowDownLeft size={18} color="#dc2626" />;
    }
    return <MoreHorizontal size={18} color="#6b7280" />;
  };

  const renderHeader = () => (
    <View>
      <View className="flex-row bg-background px-0 pt-0 pb-6 gap-2">
        {/* Wallet Balance */}
        <TouchableOpacity
          className="flex-1 rounded-xl p-4 border border-border items-center justify-center"
          onPress={() => router.push("/main/finance/topup")}
        >
          <View className="p-3 rounded-full bg-primary/10 mb-2">
            <Wallet size={24} color={palette.primary} />
          </View>
          {isLoadingBalance && !refreshing ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text className="text-2xl font-bold text-foreground">
              {currentBalance.toFixed(2)} TND
            </Text>
          )}
          <Text className="text-xs text-muted-foreground mt-1">Balance</Text>
        </TouchableOpacity>

        {/* Points Balance */}
        <TouchableOpacity
          className="flex-1 rounded-xl p-4 border border-border items-center justify-center"
          onPress={() => router.push("/main/finance/topup")}
        >
          <View className="p-3 rounded-full bg-amber-500/10 mb-2">
            <Coins size={24} color="#f59e0b" />
          </View>
          {isLoadingBalance && !refreshing ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text className="text-2xl font-bold text-foreground">
              {currentPoints}
            </Text>
          )}
          <Text className="text-xs text-muted-foreground mt-1">Points</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-2">
          <TrendingUp size={20} color={palette.primary} />
          <Text className="text-lg font-semibold text-foreground">
            {t("finance:transaction_history", "Transaction History")}
          </Text>
        </View>
      </View>
    </View>
  );

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
        {isLoadingTx && isLoadingFundTx && !refreshing ? (
          <ActivityIndicator size="large" className="mt-8" />
        ) : (
          <FlatList
            ListHeaderComponent={renderHeader}
            data={transactions}
            keyExtractor={(item) => `${item.currencyType}-${item.id}`}
            ItemSeparatorComponent={() => <Separator className="my-2" />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
              if (hasNextFundPage) {
                fetchNextFundPage();
              }
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row justify-between items-center py-2"
                onPress={() =>
                  router.push({
                    pathname: "/main/finance/[transactionId]",
                    params: { transaction: JSON.stringify(item) },
                  })
                }
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="p-2 rounded-full bg-muted">
                    {getTransactionIcon(item.type)}
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-medium text-sm text-foreground"
                      numberOfLines={1}
                    >
                      {item.metadata?.title
                        ? `${(item as any).description || (item.currencyType === "FUNDS" ? "Fund Transaction" : "Point Transaction")} - ${item.metadata.title}`
                        : (item as any).description ||
                          (item.currencyType === "FUNDS"
                            ? "Fund Transaction"
                            : "Point Transaction")}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-1">
                      <Calendar size={12} color="#6b7280" />
                      <Text className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text
                  className={cn(
                    "font-semibold text-base",
                    isCredit(item.type) && "text-green-600",
                    isDebit(item.type) && "text-red-600",
                  )}
                >
                  {isCredit(item.type) ? "+" : "-"}
                  {item.amount} {item.currencyType === "FUNDS" ? "TND" : "Pts"}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View className="items-center justify-center py-8">
                <Text className="text-muted-foreground">
                  {t("finance:no_transactions", "No transactions found.")}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </StableSafeAreaView>
  );
};
