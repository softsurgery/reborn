import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { View, RefreshControl, SafeAreaView } from "react-native";
import { JobCard } from "./jobs/JobCard";
import { api } from "~/api";
import { ExploreHeader } from "./ExploreHeader";
import { useDebounce } from "~/hooks/useDebounce";
import { Separator } from "../ui/separator";
import { JobCardSkeleton } from "./jobs/JobCardSkeleton";
import { Text } from "../ui/text";
import { PackageOpenIcon } from "lucide-react-native";
import { ResponseJobDto } from "~/types";
import { LegendList, LegendListRef } from "@legendapp/list";

export const Explore = () => {
  const [search, setSearch] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(search, 1000);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending: isJobsPending,
  } = useInfiniteQuery({
    queryKey: ["jobs", debouncedSearchTerm],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      api.job.findPaginated({
        page: String(pageParam),
        limit: "5",
        join: "uploads",
        filter: debouncedSearchTerm
          ? `title||$cont||${debouncedSearchTerm}`
          : undefined,
        sort: "createdAt,desc",
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const listRef = React.useRef<LegendListRef | null>(null);

  const jobs = data?.pages.flatMap((page) => page.data) ?? [];

  const ListItem = React.useCallback(({ item }: { item: ResponseJobDto }) => {
    return (
      <View className="">
        <JobCard job={item} className="my-2" />
      </View>
    );
  }, []);

  const isPending = isJobsPending || isFetchingNextPage || searching;

  return (
    <View className="flex-1">
      <View className="px-4">
        <ExploreHeader />
      </View>
      <Separator />
      <SafeAreaView className="flex-1 mx-2">
        <LegendList
          ref={listRef}
          data={jobs}
          renderItem={ListItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          recycleItems={true}
          maintainVisibleContentPosition
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
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
      </SafeAreaView>
    </View>
  );
};
