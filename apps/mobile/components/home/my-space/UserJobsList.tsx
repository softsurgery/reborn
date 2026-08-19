import React from "react";
import Animated from "react-native-reanimated";
import { LegendList } from "@legendapp/list";

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
import { JobCreateActionBanner } from "./JobCreateActionBanner";

const AnimatedLegendList = Animated.createAnimatedComponent(
  LegendList,
) as typeof LegendList;

interface UserJobsListProps {
  className?: string;
  searching?: boolean;
}

interface FilterOption {
  label: string;
  value: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Published", value: JobStatus.POSTED },
  { label: "Drafts", value: JobStatus.DRAFT },
  { label: "In Progress", value: "in_progress" },
  { label: "Finished", value: JobStatus.FINISHED },
];

export const UserJobsList = ({
  className,
  searching = false,
}: UserJobsListProps) => {
  const { currentUser } = useCurrentUser();
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");

  const [bannerHeight, setBannerHeight] = React.useState(100);
  const [searchBarHeight, setSearchBarHeight] = React.useState(110);
  const { handleScroll, stickyHeaderStyle } = useStickyElement(bannerHeight);

  const filterExpression = React.useMemo(() => {
    if (!currentUser?.id) return "";
    const base = `postedById||$eq||${currentUser.id}`;
    if (selectedFilter === "all") return base;
    if (selectedFilter === "in_progress") {
      return `${base};status||$in||Candidate Pending,Not Started,Pending,Reviewed By Worker,Reviewed By Worker & Client`;
    }
    return `${base};status||$eq||${selectedFilter}`;
  }, [currentUser?.id, selectedFilter]);

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
  });

  const isPending = isJobsPending || searching;

  const renderItem = React.useCallback(({ item }: { item: ResponseJobDto }) => {
    return <JobManagementCard job={item} />;
  }, []);

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        title="My Jobs"
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
      <View className="flex-1 bg-background px-3 relative">
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
          ListHeaderComponent={
            <JobCreateActionBanner
              className="py-4"
              searchBarHeight={searchBarHeight}
              setBannerHeight={setBannerHeight}
            />
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
            <View className="py-6 items-center">
              {isFetchingNextPage ? <Loader /> : null}
            </View>
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
                      ? "No jobs found"
                      : "No jobs posted yet"}
                  </Text>
                  <Text className="text-sm text-muted-foreground text-center max-w-[240px]">
                    {search || selectedFilter !== "all"
                      ? "Try adjusting your search keywords or clearing filter tabs."
                      : "Start hiring by posting your first job listing today."}
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
      </View>
    </StableSafeAreaView>
  );
};
