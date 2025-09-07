import React from "react";

import { ResponseJobRequestDto } from "~/types";
import { IncomingRequestEntry } from "./IncomingRequest";
import { useDebounce } from "~/hooks/useDebounce";
import { LegendList } from "@legendapp/list";
import { cn } from "~/lib/utils";
import { RefreshControl, View } from "react-native";
import { Loader } from "~/components/shared/Loader";
import { Text } from "~/components/ui/text";
import { OutgoingRequestEntry } from "./OutgoingRequest";
import { useRequestSystem } from "~/hooks/content/useRequestSystem";

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
      variant == "incoming" ? (
        <IncomingRequestEntry request={item} className="mb-4" />
      ) : (
        <OutgoingRequestEntry
          request={item}
          className="mb-4"
          refetchRequests={refetchRequests}
        />
      ),
    [variant]
  );

  const [dragging, setDragging] = React.useState(false);
  const { value: debouncedDragging, loading: isDragging } = useDebounce(
    dragging,
    1000
  );

  return (
    <LegendList
      className={cn("flex-1", className)}
      data={requests}
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
      ListHeaderComponent={
        <Loader
          size="small"
          isPending={isRefetching || debouncedDragging || isDragging}
          className="flex items-center h-fit"
        />
      }
      ListEmptyComponent={
        !isPending ? (
          <View className="p-6 items-center">
            <Text className="text-muted-foreground">No requests available</Text>
          </View>
        ) : null
      }
      ListFooterComponent={
        <View className="items-center">
          {isPending ? (
            <Text>Skeleton</Text>
          ) : hasNextPage ? null : (
            <View className="flex flex-row items-center justify-center gap-2 p-6"></View>
          )}
        </View>
      }
    />
  );
};
