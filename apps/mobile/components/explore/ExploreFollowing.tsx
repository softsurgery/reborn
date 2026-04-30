import { LegendList } from "@legendapp/list";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";
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
import { PackageOpenIcon, User } from "lucide-react-native";
import { useDebounce } from "~/hooks/useDebounce";
import { cn } from "~/lib/utils";
import { NAV_THEME } from "~/lib/theme";
import { useInfiniteJobs } from "@/hooks/content/job/useInfiniteJobs";
import { Loader } from "../shared/Loader";

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
    follow: true,
    sortOrder: "desc",
  });

  const isPending = isJobsPending || isFetchingNextPage || searching;

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
      recycleItems={true}
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
          <View className="p-6 items-center">
            <Text className="text-muted-foreground">No jobs available</Text>
          </View>
        ) : (
          <Loader />
        )
      }
      ListFooterComponent={
        <View className="items-center">
          {isPending ? (
            <JobCardSkeleton />
          ) : hasNextPage ? null : (
            <View className="flex flex-row items-center justify-center gap-2 p-6">
              <Text className="text-muted-foreground">No more jobs</Text>
            </View>
          )}
        </View>
      }
    />
  );
};
