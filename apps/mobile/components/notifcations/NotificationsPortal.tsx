import { RefreshControl, View } from "react-native";
import { Text } from "../ui/text";
import { LegendList } from "@legendapp/list";
import { cn } from "~/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "~/api";
import React from "react";
import { ResponseNotificationDto } from "~/types/notifications";
import { StablePressable } from "../shared/StablePressable";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { NotificationEntry } from "./NotificationEntry";
import { Loader } from "../shared/Loader";

export const NotificationsPortal = () => {
  const navigation = useNavigation<NavigationProps>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending: isNotificationsPending,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      api.notifications.findPaginatedUserConversations({
        page: String(pageParam),
        limit: "5",
        sort: "createdAt,desc",
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const notifications = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const isPending = isNotificationsPending || isFetchingNextPage;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseNotificationDto }) => {
      return (
        <StablePressable
          key={new Date().getTime()}
          className="flex flex-col gap-4 py-2"
          onPress={() => {}}
        >
          <NotificationEntry notification={item} />
        </StablePressable>
      );
    },
    []
  );
  return (
    <View className="flex-1 px-2">
      <LegendList
        className={cn("flex-1")}
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        recycleItems={true}
        maintainVisibleContentPosition
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="transparent"
            colors={["transparent"]}
          />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <Loader
            isPending={isNotificationsPending || isFetchingNextPage}
            size="small"
            className="flex items-center h-fit"
          />
        }
        ListEmptyComponent={
          !isPending ? (
            <View className="p-6 items-center">
              <Text className="text-muted-foreground">
                No conversations available
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View className="items-center">
            {isPending ? (
              <Loader />
            ) : hasNextPage ? null : (
              <View className="flex flex-row items-center justify-center gap-2 p-6">
                <Text variant={"p"} className="text-muted-foreground">
                  You have catched up with all notifications
                </Text>
              </View>
            )}
          </View>
        }
      />
    </View>
  );
};
