import React from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { LegendList } from "@legendapp/list";
import { InfiniteListFooter } from "@/components/shared/InfiniteListFooter";

import {
  RefreshControl,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Search, Plus, Briefcase } from "lucide-react-native";
import { ResponseJobDto, JobStatus } from "~/types";
import { cn } from "~/lib/utils";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { MarkedInput } from "@/components/shared/MarkedInput";
import { useInfiniteJobs } from "@/hooks/content/job/useInfiniteJobs";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";
import { Loader } from "@/components/shared/lotties/Loader";
import { JobManagementCard } from "@/components/jobs/job-management/JobManagmentCard";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { AppHeaderBack } from "@/components/shared/AppHeaderBack";
import { useStickyElement } from "@/hooks/useStickyElement";
import { MyJobPreviewModal } from "@/components/jobs/job-management/MyJobPreviewModal";

const AnimatedLegendList = Animated.createAnimatedComponent(
  LegendList,
) as typeof LegendList;

interface UserWorkListProps {
  className?: string;
  searching?: boolean;
}

interface FilterOption {
  label: string;
  value: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "In Progress", value: "in_progress" },
  { label: "Finished", value: JobStatus.FINISHED },
];

export const UserWorkList = ({
  className,
  searching = false,
}: UserWorkListProps) => {
  const { currentUser } = useCurrentUser();
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [previewJob, setPreviewJob] = React.useState<ResponseJobDto | null>(
    null,
  );

  const isPreviewing = !!previewJob;

  const animatedBlurStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isPreviewing ? 0.35 : 1, {
        duration: 250,
      }),
    };
  }, [isPreviewing]);

  const [searchBarHeight, setSearchBarHeight] = React.useState(110);
  const { handleScroll, stickyHeaderStyle } = useStickyElement(0);

  const filterExpression = React.useMemo(() => {
    if (selectedFilter === "all") return "";
    if (selectedFilter === "in_progress") {
      return `status||$in||Candidate Pending,Not Started,Pending,Reviewed By Worker,Reviewed By Worker & Client`;
    }
    return `status||$eq||${selectedFilter}`;
  }, [selectedFilter]);

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
    sortOrder: "desc",
    filter: filterExpression,
    enabled: !!currentUser,
    work: true,
  });

  const isPending = isJobsPending || searching;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobDto }) => {
      return <JobManagementCard job={item} onLongPress={setPreviewJob} />;
    },
    [setPreviewJob],
  );

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <Animated.View
        pointerEvents={isPreviewing ? "none" : "auto"}
        style={[animatedBlurStyle]}
      >
        <ApplicationHeader
          title="My Work"
          classNames={{ wrapper: "border-b border-border/60 pb-2.5 bg-card" }}
          titleVariant="large"
          reverse
          shortcuts={[
            {
              key: "back",
              render: <AppHeaderBack />,
            },
          ]}
        />
      </Animated.View>
      <Animated.View
        pointerEvents={isPreviewing ? "none" : "auto"}
        className="flex-1 bg-background px-3 relative"
        style={[animatedBlurStyle]}
      >
        <Animated.View
          className="absolute left-0 right-0 z-20 bg-background/90 mx-3 flex flex-col gap-4 py-4"
          style={stickyHeaderStyle}
          onLayout={(e) => setSearchBarHeight(e.nativeEvent.layout.height)}
        >
          {/* Search Input */}
          <View className="relative justify-center">
            <MarkedInput
              icon={Search}
              value={search}
              onChangeText={setSearch}
              placeholder="Search jobs by title or keyword..."
              enableClear
            />
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {FILTER_OPTIONS.map((filter) => {
              const isActive = selectedFilter === filter.value;
              return (
                <TouchableOpacity
                  key={filter.value}
                  activeOpacity={0.7}
                  onPress={() => setSelectedFilter(filter.value)}
                  className={cn(
                    "px-4 py-2 rounded-full border flex-row items-center gap-1.5",
                    isActive
                      ? "bg-primary border-primary shadow-xs"
                      : "bg-card border-border",
                  )}
                >
                  <Text
                    className={cn(
                      "text-xs font-semibold",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        <AnimatedLegendList
          className="flex-1"
          style={{ flex: 1 }}
          data={isPending ? [] : jobs}
          onScroll={handleScroll}
          scrollIndicatorInsets={{ top: searchBarHeight }}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          recycleItems={true}
          maintainVisibleContentPosition
          scrollEnabled={!isPreviewing}
          ListHeaderComponent={
            <View style={{ height: searchBarHeight + 16 }} />
          }
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <InfiniteListFooter
              isPending={isFetchingNextPage}
              hasNextPage={!!hasNextPage}
              dataLength={0}
              showEndMessage={false}
              loadingComponent={<Loader />}
            />
          }
          ListEmptyComponent={
            !isPending ? (
              <View className="flex-col items-center justify-center py-12 px-6 gap-4 mt-2">
                <View className="w-14 h-14 rounded-full bg-muted items-center justify-center">
                  <Icon
                    as={Briefcase}
                    size={45}
                    className="text-muted-foreground"
                  />
                </View>
                <View className="items-center gap-1">
                  <Text className="text-base font-semibold text-foreground text-center">
                    {search || selectedFilter !== "all"
                      ? "No work jobs found"
                      : "No work assigned yet"}
                  </Text>
                  <Text className="text-sm text-muted-foreground text-center max-w-[240px]">
                    {search || selectedFilter !== "all"
                      ? "Try adjusting your search keywords or clearing filter tabs."
                      : "You have not been assigned to any jobs yet."}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="py-16 items-center justify-center">
                <Loader />
              </View>
            )
          }
        />
      </Animated.View>

      <MyJobPreviewModal
        visible={!!previewJob}
        job={previewJob}
        onClose={() => setPreviewJob(null)}
      />
    </StableSafeAreaView>
  );
};
