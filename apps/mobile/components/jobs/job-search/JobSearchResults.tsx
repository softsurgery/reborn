import { LegendList } from "@legendapp/list";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { RefreshControl, View } from "react-native";
import { api } from "~/api";
import { Text } from "~/components/ui/text";
import { NAV_THEME } from "~/lib/theme";
import { cn } from "~/lib/utils";
import { ResponseJobDto } from "~/types";
import { router } from "expo-router";
import { Skeleton } from "~/components/ui/skeleton";
import { useJobStore } from "~/hooks/stores/useJobStore";
import { JobSearchResultEntry } from "./JobSearchResultEntry";

interface JobSearchResultsProps {
  className?: string;
  search: string;
  searching: boolean;
}

export const JobSearchResults = ({
  className,
  search,
  searching,
}: JobSearchResultsProps) => {
  const jobStore = useJobStore();
  const {
    data,
    refetch,
    isPending: isJobPending,
  } = useQuery({
    queryKey: ["jobs", search],
    queryFn: () =>
      api.job.findPaginated({
        page: "1",
        limit: "5",
        sort: "createdAt,desc",
        search,
        join: "uploads",
      }),
  });

  const jobs = React.useMemo(() => data?.data ?? [], [data]);

  const isPending = searching || isJobPending;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobDto }) => (
      <JobSearchResultEntry
        item={item}
        onPress={() => {
          jobStore.addJobToSearchHistory(item);
          router.push({
            pathname: "/main/explore/job-details",
            params: { id: item.id },
          });
        }}
      />
    ),
    []
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
      refreshControl={
        <RefreshControl
          refreshing={isPending}
          onRefresh={refetch}
          tintColor={NAV_THEME.light.colors.primary}
          colors={[NAV_THEME.light.colors.primary]}
        />
      }
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
            <View className="p-4 border-b">
              {/* Title */}
              <Skeleton className="h-5 w-3/4 mb-2 rounded-md bg-secondary" />

              {/* Description */}
              <Skeleton className="h-4 w-full mb-2 rounded-md" />
              <Skeleton className="h-4 w-5/6 mb-2 rounded-md" />

              {/* Time */}
              <Skeleton className="h-4 w-1/6 ml-auto rounded-md" />
            </View>
          ) : null}
        </View>
      }
    />
  );
};
