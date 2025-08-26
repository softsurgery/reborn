import React, { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  View,
  RefreshControl,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Text } from "../ui/text";
import { JobCard } from "./JobCard";
import { api } from "~/api";
import { HomePageHeader } from "./HomeHeader";
import { useDebounce } from "~/hooks/useDebounce";
import { Separator } from "../ui/separator";

export const HomePage = () => {
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
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const allJobs = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data]
  );

  return (
    <View className="flex-1">
      <View className="px-4">
        <HomePageHeader search={search} setSearch={setSearch} />
      </View>
      <Separator />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <FlashList
          data={allJobs}
          keyExtractor={(item) => String(item.id)}
          estimatedItemSize={200}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          renderItem={({ item }) => <JobCard job={item} className="my-2" />}
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
          onEndReached={() =>
            hasNextPage && !isFetchingNextPage && fetchNextPage()
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                color="blue"
                size="small"
                style={{ marginVertical: 10 }}
              />
            ) : null
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
};
