import { LegendList } from "@legendapp/list";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";
import { ResponseJobDto } from "~/types";
import { JobCard } from "./jobs/JobCard";
import { RefreshControl, View } from "react-native";
import { Text } from "../ui/text";
import { JobCardSkeleton } from "./jobs/JobCardSkeleton";
import { PackageOpenIcon } from "lucide-react-native";
import { Loader } from "../shared/Loader";
import { ExploreHeader } from "./ExploreHeader";
import { cn } from "~/lib/utils";

interface ExploreCommonProps {
  className?: string;
  search: string;
  searching: boolean;
}

export const ExploreCommon = ({
  className,
  search,
  searching,
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
    []
  );
  return (
    <View>
      <LegendList
        className={cn("flex-1", className)}
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
            size="small"
            isPending={isRefetching}
            className="flex items-center"
          />
        }
        ListEmptyComponent={
          !isPending ? (
            <View className="p-8 items-center">
              <Text className="text-muted-foreground">No jobs available</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View className="items-center pb-5">
            {isPending ? (
              <JobCardSkeleton />
            ) : hasNextPage ? null : (
              <View className="flex flex-row items-center justify-center gap-2 p-6">
                <Text className="text-muted-foreground text-lg">
                  No more jobs
                </Text>
                <PackageOpenIcon size={24} color="gray" />
              </View>
            )}
          </View>
        }
      />
    </View>
  );
};
