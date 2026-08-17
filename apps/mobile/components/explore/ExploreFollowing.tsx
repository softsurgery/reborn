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
import { JobFeedSkeleton } from "../jobs/JobFeedSkeleton";
import { cn } from "~/lib/utils";
import { useInfiniteJobs } from "@/hooks/content/job/useInfiniteJobs";
import { NotFound } from "../shared/NotFound";
import { useColorPalette } from "@/hooks/useColorPalette";

interface ExploreFollowingProps {
  className?: string;
  search: string;
  searching: boolean;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const ExploreFollowing = ({
  className,
  search,
  searching,
  handleScroll,
}: ExploreFollowingProps) => {
  const { palette } = useColorPalette();

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
    followings: true,
    sortOrder: "desc",
  });

  const isPending = isJobsPending || searching;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobDto }) => (
      <JobCard job={item} className="my-2" />
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
          <JobFeedSkeleton />
        ) : (
          <NotFound
            className="flex-1 items-center justify-center pt-12"
            message="Nothing from the people you follow yet."
          />
        )
      }
      ListFooterComponent={
        <View className="items-center">
          {isFetchingNextPage ? (
            <JobCardSkeleton />
          ) : jobs.length > 0 && !hasNextPage ? (
            <View className="flex-row items-center justify-center gap-2 py-8">
              <Text className="text-sm text-muted-foreground">
                You're all caught up
              </Text>
            </View>
          ) : null}
        </View>
      }
    />
  );
};
