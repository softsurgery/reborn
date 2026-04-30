import React from "react";
import { LegendList } from "@legendapp/list";
import { RefreshControl, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { ResponseJobDto } from "~/types";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { JobCard } from "~/components/jobs/JobCard";
import { useInfiniteJobs } from "@/hooks/content/job/useInfiniteJobs";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";
import { NAV_THEME } from "@/lib/theme";
import { Loader } from "@/components/shared/Loader";
import { JobCardSkeleton } from "@/components/jobs/JobCardSkeleton";
import { NotFound } from "@/components/shared/NotFound";

interface UserJobsListProps {
  className?: string;
  searching?: boolean;
}

export const UserJobsList = ({
  className,
  searching = false,
}: UserJobsListProps) => {
  const { currentUser } = useCurrentUser();
  const [search, setSearch] = React.useState("");

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
    userId: currentUser?.id,
    sortOrder: "desc",
    enabled: !!currentUser,
  });

  const isPending = isJobsPending || isFetchingNextPage || searching;

  const renderItem = React.useCallback(({ item }: { item: ResponseJobDto }) => {
    return <JobCard job={item} className="my-2" isOwner />;
  }, []);

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        title="My Jobs"
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
      <View className="flex-1 bg-background px-4">
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
              <NotFound
                className="flex-1 justify-center items-center"
                message="You do not have any job posted"
              />
            ) : (
              <JobCardSkeleton />
            )
          }
        />
      </View>
    </StableSafeAreaView>
  );
};
