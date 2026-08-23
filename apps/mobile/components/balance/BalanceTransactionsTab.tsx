import React from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Calendar,
  MoreHorizontal,
} from "lucide-react-native";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import { usePointTransactions } from "~/hooks/content/finance/useFinance";
import { PointTransaction } from "~/api/finance";
import { useColorPalette } from "~/hooks/useColorPalette";

export const BalanceTransactionsTab = () => {
  const { palette } = useColorPalette();
  const { data: txData, isLoading: isLoadingTx, fetchNextPage, hasNextPage } = usePointTransactions();

  const transactions = txData?.pages.flatMap((page) => page.data) || [];

  const getTransactionIcon = (type: PointTransaction["type"]) => {
    switch (type) {
      case "CREDIT":
        return <ArrowUpRight size={18} color="#16a34a" />;
      case "DEBIT":
        return <ArrowDownLeft size={18} color="#dc2626" />;
      default:
        return <MoreHorizontal size={18} color="#6b7280" />;
    }
  };

  return (
    <View className="flex-1 bg-background p-4">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-2">
          <TrendingUp size={20} color={palette.primary} />
          <Text className="text-lg font-semibold text-foreground">
            Transaction History
          </Text>
        </View>
      </View>

      {isLoadingTx ? (
        <ActivityIndicator size="large" className="mt-8" />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Separator className="my-2" />}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center py-2">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="p-2 rounded-full bg-muted">
                  {getTransactionIcon(item.type)}
                </View>
                <View className="flex-1">
                  <Text
                    className="font-medium text-sm text-foreground"
                    numberOfLines={1}
                  >
                    {item.description}
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
                  item.type === "CREDIT" && "text-green-600",
                  item.type === "DEBIT" && "text-red-600"
                )}
              >
                {item.type === "CREDIT" ? "+" : "-"}
                {item.amount}
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="items-center justify-center py-8">
              <Text className="text-muted-foreground">No transactions found.</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};
