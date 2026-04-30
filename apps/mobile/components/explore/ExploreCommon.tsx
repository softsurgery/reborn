import { LegendList } from "@legendapp/list";
import React from "react";
import { ResponseJobDto } from "~/types";
import { JobCard } from "../jobs/JobCard";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  View,
} from "react-native";
import { Text } from "../ui/text";
import { JobCardSkeleton } from "../jobs/JobCardSkeleton";
import { cn } from "~/lib/utils";
import { NAV_THEME } from "~/lib/theme";
import { useInfiniteJobs } from "@/hooks/content/job/useInfiniteJobs";
import { NotFound } from "../shared/NotFound";

interface ExploreCommonProps {
  className?: string;
  search: string;
  searching: boolean;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const ExploreCommon = ({
  className,
  search,
  searching,
  handleScroll,
}: ExploreCommonProps) => {
  const {
    jobs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isJobsPending,
    isRefetching,
    refetch,
  } = useInfiniteJobs({
    search,
    join: ["uploads"],
    sortKey: "createdAt",
    sortOrder: "desc",
  });

  const isPending = isJobsPending || isFetchingNextPage || searching;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobDto }) => (
      <JobCard job={item} className="my-4" />
    ),
    [],
  );

  return (
    <LegendList
      className={cn("flex-1", className)}
      data={jobs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      maintainVisibleContentPosition
      onScroll={handleScroll}
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
      ListEmptyComponent={
        !isPending ? (
          <NotFound className="flex-1 justify-center items-center" />
        ) : (
          <JobCardSkeleton />
        )
      }
      ListFooterComponent={
        <View className="items-center">
          {isPending ? (
            <JobCardSkeleton />
          ) : hasNextPage ? null : (
            <View className="flex flex-row items-center justify-center gap-2 pb-8">
              <Text className="text-muted-foreground">No more jobs</Text>
            </View>
          )}
        </View>
      }
    />
  );
};
