import React, { useMemo } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  View,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { JobCard } from "./JobCard";
import { api } from "~/api";
import { HomePageHeader } from "./HomeHeader";
import { useDebounce } from "~/hooks/useDebounce";
import { Separator } from "../ui/separator";
import { JobCardSkeleton } from "./JobCardSkeleton";
import { Text } from "../ui/text";
import Icon from "~/lib/Icon";
import { PackageOpenIcon } from "lucide-react-native";

export const HomePage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const { value: debouncedSearchTerm } = useDebounce<string>(search, 500);

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
        limit: "10",
        join: "uploads",
        filter: debouncedSearchTerm
          ? `title||$cont||${debouncedSearchTerm}`
          : undefined,
        sort: "createdAt,desc",
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const allJobs = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data]
  );

  React.useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs", debouncedSearchTerm],
      });
    };
  }, [debouncedSearchTerm]);

  return (
    <View className="flex-1">
      <View className="px-4">
        <HomePageHeader search={search} setSearch={setSearch} />
      </View>
      <Separator />
      <SafeAreaView style={{ flex: 1 }}>
        {isJobsPending ? (
          <FlatList
            className="px-2"
            data={Array.from({ length: 5 })}
            renderItem={() => <JobCardSkeleton />}
          />
        ) : (
          <FlatList
            className="px-2"
            data={allJobs}
            keyExtractor={(item) => `job-${item.id}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <JobCard job={item} className="my-2" />}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            onEndReached={() =>
              hasNextPage && !isFetchingNextPage && fetchNextPage()
            }
            ListEmptyComponent={
              <View className="px-4 py-12 items-center justify-center">
                {isJobsPending ? (
                  <>
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text className="opacity-70 text-center mt-3">
                      Loading jobs...
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="text-center opacity-70">
                      No jobs available right now
                    </Text>
                    <Text className="opacity-70 text-sm text-center mt-2">
                      Please check back later
                    </Text>
                  </>
                )}
              </View>
            }
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              isFetchingNextPage ? (
                <JobCardSkeleton />
              ) : !hasNextPage ? (
                <View className="px-4 pt-6 pb-10 flex flex-row  items-center justify-center gap-4">
                  <Text className="text-lg opacity-70">
                    No more jobs available
                  </Text>
                  <Icon name={PackageOpenIcon} />
                </View>
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
};
