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
import { InfiniteListFooter } from "@/components/shared/InfiniteListFooter";
import { useInfiniteJobs } from "@/hooks/content/job/useInfiniteJobs";
import { NotFound } from "../shared/lotties/NotFound";
import { useExploreFilterStore } from "@/hooks/stores/userExploreFilterStore";
import { useColorPalette } from "@/hooks/useColorPalette";

interface ExploreCommonProps {
  className?: string;
  search: string;
  searching: boolean;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onPreviewJobChange?: (job: ResponseJobDto | null) => void;
  isPreviewing?: boolean;
}

export const ExploreCommon = ({
  className,
  search,
  searching,
  handleScroll,
  onPreviewJobChange,
  isPreviewing,
}: ExploreCommonProps) => {
  const { palette } = useColorPalette();
  const exploreFilterStore = useExploreFilterStore();

  const filter = React.useMemo(() => {
    let arr = exploreFilterStore.getFilterExpression();
    return arr.join(";");
  }, [exploreFilterStore.filters]);

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
    // postedBy, category and tags are eager on the entity; currency is not.
    join: ["uploads", "currency"],
    sortKey: "createdAt",
    sortOrder: "desc",
    filter,
  });

  const isPending = isJobsPending || searching;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobDto }) => (
      <JobCard job={item} className="my-2" onLongPress={onPreviewJobChange} />
    ),
    [onPreviewJobChange],
  );

  return (
    <LegendList
      className={cn("flex-1", className)}
      data={jobs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      maintainVisibleContentPosition
      scrollEnabled={!isPreviewing}
      onScroll={handleScroll}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={palette.primary}
          colors={[palette.primary]}
        />
      }
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      ListEmptyComponent={
        isPending ? (
          <View>
            {Array.from({ length: 4 }).map((_, index) => (
              <JobCardSkeleton key={index} className="my-2" />
            ))}
          </View>
        ) : (
          <NotFound
            className="flex-1 items-center justify-center pt-12"
            message="No jobs here yet. Try widening your filters."
          />
        )
      }
      ListFooterComponent={
        <InfiniteListFooter
          isPending={isFetchingNextPage}
          hasNextPage={!!hasNextPage}
          dataLength={jobs.length}
          endMessage="You're all caught up"
          loadingComponent={<JobCardSkeleton />}
        />
      }
    />
  );
};
