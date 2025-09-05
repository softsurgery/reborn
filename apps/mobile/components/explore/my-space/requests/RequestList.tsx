import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { ResponseJobRequestDto } from "~/types";
import { IncomingRequestEntry } from "./IncomingRequest";
import { useDebounce } from "~/hooks/useDebounce";
import { LegendList } from "@legendapp/list";
import { cn } from "~/lib/utils";
import { RefreshControl, View } from "react-native";
import { Loader } from "~/components/shared/Loader";
import { Text } from "~/components/ui/text";
import { OngoingRequestEntry } from "./OngoingRequest";

interface RequestsListProps {
  className?: string;
  variant: "incoming" | "ongoing";
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
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending: isRequestsPending,
  } = useInfiniteQuery({
    queryKey: ["requests", search, variant],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => {
      const queryParams = {
        page: String(pageParam),
        limit: "20",
        sort: "createdAt,desc",
        join: "job.postedBy,job.uploads",
      };
      return variant === "incoming"
        ? api.jobRequest.findPaginatedIncoming(queryParams)
        : api.jobRequest.findPaginatedOngoing(queryParams);
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const requests = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const isPending =
    isRequestsPending || isRefetching || isFetchingNextPage || searching;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobRequestDto }) =>
      variant == "incoming" ? (
        <IncomingRequestEntry request={item} className="mb-4" />
      ) : (
        <OngoingRequestEntry request={item} className="mb-4" />
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
