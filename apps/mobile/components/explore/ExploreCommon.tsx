import { LegendList } from "@legendapp/list";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";
import { ResponseJobDto } from "~/types";
import { JobCard } from "./jobs/JobCard";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  View,
} from "react-native";
import { Text } from "../ui/text";
import { JobCardSkeleton } from "./jobs/JobCardSkeleton";
import { cn } from "~/lib/utils";
import { useDebounce } from "~/hooks/useDebounce";
import { NAV_THEME } from "~/lib/theme";

interface ExploreCommonProps {
  className?: string;
  search: string;
  searching: boolean;
  setShowHeader: (show: boolean) => void;
}

export const ExploreCommon = ({
  className,
  search,
  searching,
  setShowHeader,
}: ExploreCommonProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending: isJobsPending,
  } = useInfiniteQuery({
    queryKey: ["jobs", search],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      api.job.findPaginated({
        page: String(pageParam),
        limit: "5",
        join: "uploads",
        filter: search ? `title||$cont||${search}` : undefined,
        sort: "createdAt,desc",
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const jobs = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const isPending = isJobsPending || isFetchingNextPage || searching;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobDto }) => (
      <JobCard job={item} className="my-2" />
    ),
    [],
  );

  const [dragging, setDragging] = React.useState(false);
  const { value: debouncedDragging, loading: isDragging } = useDebounce(
    dragging,
    1000,
  );

  // Track scroll direction
  const lastOffsetY = React.useRef(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffsetY = e.nativeEvent.contentOffset.y;

    const delta = currentOffsetY - lastOffsetY.current;
    if (currentOffsetY <= 0) {
      setShowHeader(true);
    } else if (delta < -10) {
      setShowHeader(true); // scrolling up
    } else if (delta > 0) {
      setShowHeader(false); // scrolling down
    }

    lastOffsetY.current = currentOffsetY;
  };

  return (
    <LegendList
      className={cn("flex-1", className)}
      data={jobs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      recycleItems={true}
      maintainVisibleContentPosition
      onScroll={handleScroll}
      onScrollBeginDrag={() => setDragging(true)}
      onScrollEndDrag={() => setDragging(false)}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={NAV_THEME.light.colors.primary}
          colors={[NAV_THEME.light.colors.primary]}
        />
      }
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        !isPending ? (
          <View className="p-6 items-center">
            <Text className="text-muted-foreground">No jobs available</Text>
          </View>
        ) : null
      }
      ListFooterComponent={
        <View className="items-center">
          {isPending ? (
            <>
              <JobCardSkeleton />
              <JobCardSkeleton />
            </>
          ) : hasNextPage ? null : (
            <View className="flex flex-row items-center justify-center gap-2 p-6">
              <Text className="text-muted-foreground text-lg font-thin">
                No more jobs
              </Text>
            </View>
          )}
        </View>
      }
    />
  );
};
