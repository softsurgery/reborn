import React from "react";
import { ResponseJobSaveDto } from "~/types";
import { LegendList } from "@legendapp/list";
import { cn } from "~/lib/utils";
import { RefreshControl, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useInfiniteSavedJobs } from "~/hooks/content/job/useInfiniteSavedJobs";
import { JobCard } from "../../../jobs/JobCard";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";

interface SavedListProps {
  className?: string;
  search: string;
  searching: boolean;
}

export const SavedList = ({ className, search, searching }: SavedListProps) => {
  const {
    savedJobs,
    isSavedJobsPending,
    refetchSavedJobs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteSavedJobs({ search });
  const isPending =
    isSavedJobsPending || isRefetching || isFetchingNextPage || searching;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobSaveDto }) => {
      if (item.job) return <JobCard className="mt-4" job={item.job} />;
    },
    [],
  );

  const [dragging, setDragging] = React.useState(false);

  // const SkeletonComponent =
  //   variant === "incoming" ? IncomingRequestSkeleton : OutgoingRequestSkeleton;

  return (
    <StableSafeAreaView className={cn("flex-1", className)}>
      <ApplicationHeader
        title="Saved"
        className="border-b border-border pb-2"
        titleVariant="large"
        reverse
        shortcuts={[
          {
            icon: ArrowLeft,
            onPress: () => router.back(),
          },
        ]}
      />
      <LegendList
        className={cn("flex-1", className)}
        data={isPending ? [] : savedJobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        recycleItems={true}
        maintainVisibleContentPosition
        onScrollBeginDrag={() => setDragging(true)}
        onScrollEndDrag={() => setDragging(false)}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetchSavedJobs}
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
        ListHeaderComponent={isPending ? null : <View />}
        ListEmptyComponent={
          !isPending ? (
            <View className="p-6 items-center">
              <Text className="text-muted-foreground">
                You haven't saved any jobs yet
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View className="items-center w-full">
            {isPending ? (
              <View className="w-full">
                {[...Array(3)].map(
                  (_, idx) =>
                    // <SkeletonComponent key={idx} className="mt-4" />
                    null,
                )}
              </View>
            ) : hasNextPage ? null : (
              <View className="flex flex-row items-center justify-center gap-2 p-6"></View>
            )}
          </View>
        }
      />
    </StableSafeAreaView>
  );
};
