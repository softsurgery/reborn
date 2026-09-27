import React from "react";
import { View, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { usePointTransactions } from "@/hooks/content/finance/usePointTransactions";
import { useFundTransactions } from "@/hooks/content/finance/useFundTransactions";
import { LegendList } from "@legendapp/list";
import { TransactionListItem } from "./TransactionListItem";
import { FundTransaction, PointTransaction } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useFinanceAuth } from "@/hooks/content/finance/useFinanceAuth";

interface TransactionListProps {
  classNames?: {
    wrapper?: string;
    item?: string;
  };
  limit?: number;
}

export const TransactionList = ({
  classNames,
  limit,
}: TransactionListProps) => {
  const { t } = useTranslation("finance");
  const { t: tCommon } = useTranslation("common");
  const { authenticateSession, isAuthenticating } = useFinanceAuth();

  const handleSeeMore = React.useCallback(async () => {
    const success = await authenticateSession();
    if (success) {
      router.push("/main/finance/transactions");
    }
  }, [authenticateSession]);

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

  const handleRefresh = React.useCallback(async () => {
    if (limit) return;
    setInternalRefreshing(true);
    await Promise.all([refetchTx(), refetchFundTx()]);
    setInternalRefreshing(false);
  }, [limit, refetchTx, refetchFundTx]);

  const transactions = React.useMemo(() => {
    const pointTransactions: PointTransaction[] = (
      txData?.pages.flatMap((page) => page.data) || []
    ).map((tx) => new PointTransaction(tx));

    const fundTransactions: FundTransaction[] = (
      fundTxData?.pages.flatMap((page) => page.data) || []
    ).map((tx) => new FundTransaction(tx));

    let sorted = [...pointTransactions, ...fundTransactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    if (limit) {
      sorted = sorted.slice(0, limit);
    }

    return sorted;
  }, [txData?.pages, fundTxData?.pages, limit]);

  const isLoading = isLoadingTx && isLoadingFundTx;

  if (isLoading) {
    return <ActivityIndicator size="large" className="mt-8" />;
  }

  const renderItem = React.useCallback(
    ({ item }: any) => (
      <TransactionListItem className={cn(classNames?.item)} item={item} />
    ),
    [classNames?.item]
  );

  const renderSeparator = React.useCallback(
    () => <Separator className="my-2" />,
    []
  );

  const renderEmpty = React.useCallback(
    () => (
      <View className="items-center justify-center py-8">
        <Text className="text-muted-foreground">{t("no_transactions")}</Text>
      </View>
    ),
    [t]
  );

  return (
    <View className={cn(classNames?.wrapper)}>
      <LegendList
        refreshing={internalRefreshing}
        onRefresh={limit ? undefined : handleRefresh}
        showsVerticalScrollIndicator={false}
        data={transactions}
        estimatedItemSize={80}
        keyExtractor={(item) =>
          `${item instanceof FundTransaction ? "FUNDS" : "POINTS"}-${item.id}`
        }
        ItemSeparatorComponent={renderSeparator}
        onEndReached={() => {
          if (!limit) {
            if (hasNextPage) fetchNextPage();
            if (hasNextFundPage) fetchNextFundPage();
          }
        }}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          <React.Fragment>
            {limit && (
              <Pressable
                className="mx-auto mt-4 active:opacity-50"
                onPress={handleSeeMore}
                disabled={isAuthenticating}
              >
                <Text className="text-base text-primary">
                  {tCommon("see_more")}
                </Text>
              </Pressable>
            )}
          </React.Fragment>
        }
      />
    </View>
  );
};
