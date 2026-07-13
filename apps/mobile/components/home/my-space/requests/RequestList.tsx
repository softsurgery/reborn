import React from "react";
import { cn } from "~/lib/utils";
import { ResponseJobRequestDto } from "~/types";
import { IncomingRequestEntry } from "./IncomingRequest";
import { IncomingRequestSkeleton } from "./IncomingRequestSkeleton";
import { OutgoingRequestEntry } from "./OutgoingRequest";
import { OutgoingRequestSkeleton } from "./OutgoingRequestSkeleton";
import { LegendList } from "@legendapp/list";
import { RefreshControl, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useRequestSystem } from "~/hooks/content/job/useInfiniteJobRequests";

interface RequestsListProps {
  className?: string;
  variant: "incoming" | "outgoing";
  search: string;
  searching: boolean;
}

export const RequestsList = ({
  className,
  variant,
  search,
  searching,
}: RequestsListProps) => {
  const {
    requests,
    hasNextPage,
    isRequestsPending,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    refetchRequests,
  } = useRequestSystem({
    search,
    variant,
  });

  const isPending =
    isRequestsPending || isRefetching || isFetchingNextPage || searching;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobRequestDto }) =>
      variant === "incoming" ? (
        <IncomingRequestEntry
          request={item}
          className="mt-4"
          refetchRequests={refetchRequests}
        />
      ) : (
        <OutgoingRequestEntry
          request={item}
          className="mt-4"
          refetchRequests={refetchRequests}
        />
      ),
    [variant],
  );

  const [dragging, setDragging] = React.useState(false);

  const SkeletonComponent =
    variant === "incoming" ? IncomingRequestSkeleton : OutgoingRequestSkeleton;

  return (
    <LegendList
      className={cn("flex-1", className)}
      data={isPending ? [] : requests}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      recycleItems={true}
      maintainVisibleContentPosition
      onScrollBeginDrag={() => setDragging(true)}
      onScrollEndDrag={() => setDragging(false)}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetchRequests}
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
      ListHeaderComponent={isPending ? null : <View />}
      ListEmptyComponent={
        !isPending ? (
          <View className="p-6 items-center">
            <Text className="text-muted-foreground">No requests available</Text>
          </View>
        ) : null
      }
      ListFooterComponent={
        <View className="items-center w-full">
          {isPending ? (
            <View className="w-full">
              {[...Array(3)].map((_, idx) => (
                <SkeletonComponent key={idx} className="mt-4" />
              ))}
            </View>
          ) : hasNextPage ? null : (
            <View className="flex flex-row items-center justify-center gap-2 p-6"></View>
          )}
        </View>
      }
    />
  );
};
