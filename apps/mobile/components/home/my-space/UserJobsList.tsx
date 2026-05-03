import React from "react";
import { LegendList } from "@legendapp/list";
import { RefreshControl, ScrollView, View } from "react-native";
import { ArrowLeft, Search } from "lucide-react-native";
import { router } from "expo-router";
import { ResponseJobDto } from "~/types";
import { cn } from "~/lib/utils";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { useInfiniteJobs } from "@/hooks/content/job/useInfiniteJobs";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";
import { NAV_THEME } from "@/lib/theme";
import { Loader } from "@/components/shared/Loader";
import { NotFound } from "@/components/shared/NotFound";
import { JobManagementCard } from "@/components/jobs/job-management/JobManagmentCard";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";

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
    return <JobManagementCard job={item} />;
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
      <ScrollView
        className="flex-1 bg-background px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={NAV_THEME.light.colors.primary}
            colors={[NAV_THEME.light.colors.primary]}
          />
        }
      >
        <View className="relative my-6">
          <Icon
            as={Search}
            size={18}
            className="absolute left-3 top-2 z-10 text-muted-foreground"
          />
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Search..."
            className="pl-10 rounded-full"
            autoFocus
          />
        </View>

        <LegendList
          className={cn("flex-1", className)}
          style={{ paddingBottom: 20 }}
          data={jobs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          recycleItems={true}
          maintainVisibleContentPosition
          bounces={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <Loader />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !isPending ? (
              <NotFound
                className="flex-1 justify-center items-center"
                message="You do not have any job posted"
              />
            ) : (
              <Loader className="flex-1 justify-center items-center" />
            )
          }
        />
      </ScrollView>
    </StableSafeAreaView>
  );
};
