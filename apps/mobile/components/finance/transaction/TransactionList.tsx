import React from "react";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { usePointTransactions } from "@/hooks/content/finance/usePointTransactions";
import { useFundTransactions } from "@/hooks/content/finance/useFundTransactions";
import { LegendList } from "@legendapp/list";
import { TransactionListItem } from "./TransactionListItem";
import { FundTransaction, PointTransaction } from "@/types";

interface TransactionListProps {
  className?: string;
  limit?: number;
}

export const TransactionList = ({ className, limit }: TransactionListProps) => {
  const { t } = useTranslation(["common", "finance"]);

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

  const [internalRefreshing, setInternalRefreshing] = React.useState(false);

  const pointTransactions: PointTransaction[] = (
    txData?.pages.flatMap((page) => page.data) || []
  ).map((tx) => new PointTransaction(tx));

  const fundTransactions: FundTransaction[] = (
    fundTxData?.pages.flatMap((page) => page.data) || []
  ).map((tx) => new FundTransaction(tx));

  let transactions = [...pointTransactions, ...fundTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (limit) {
    transactions = transactions.slice(0, limit);
  }

  const isLoading = isLoadingTx && isLoadingFundTx;

  if (isLoading) {
    return <ActivityIndicator size="large" className="mt-8" />;
  }

  return (
    <View className={className}>
      <LegendList
        data={transactions}
        keyExtractor={(item) =>
          `${item instanceof FundTransaction ? "FUNDS" : "POINTS"}-${item.id}`
        }
        ItemSeparatorComponent={() => <Separator className="my-2" />}
        onEndReached={() => {
          if (!limit) {
            if (hasNextPage) fetchNextPage();
            if (hasNextFundPage) fetchNextFundPage();
          }
        }}
        renderItem={({ item }) => <TransactionListItem item={item} />}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-8">
            <Text className="text-muted-foreground">
              {t("finance:no_transactions", "No transactions found.")}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <React.Fragment>
            {limit && (
              <TouchableOpacity
                className="mx-auto mt-4"
                onPress={() => router.push("/main/finance/transactions")}
              >
                <Text className="text-base font-bold text-primary">
                  Show More
                </Text>
              </TouchableOpacity>
            )}
          </React.Fragment>
        }
      />
    </View>
  );
};
