import React from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import { InfiniteListFooter } from "@/components/shared/InfiniteListFooter";
import {
  RefreshControl,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Search, Briefcase } from "lucide-react-native";
import { ResponseJobDto, JobStatus } from "@/types";
import { cn } from "@reborn/lib";
import { ApplicationHeader } from "@reborn/mobile-components";
import { StableSafeAreaView } from "@reborn/mobile-components";
import { MarkedInput } from "@reborn/mobile-components";
import { useInfiniteJobs } from "@/hooks/content/job/useInfiniteJobs";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";
import { Loader } from "@reborn/mobile-components";
import { JobManagementCard } from "@/components/jobs/job-management/JobManagmentCard";
import { Icon } from "@reborn/mobile-ui";
import { Text } from "@reborn/mobile-ui";
import { AppHeaderBack } from "@reborn/mobile-components";
import { useStickyElement } from "@/hooks/useStickyElement";
import { useColorPalette } from "@reborn/mobile-components";
import { MyJobPreviewModal } from "@/components/jobs/job-management/MyJobPreviewModal";
import { useTranslation } from "@reborn/i18n";

interface UserWorkListProps {
  className?: string;
  searching?: boolean;
}

interface FilterOption {
  label: string;
  value: string;
}

export const UserWorkList = ({
  className,
  searching = false,
}: UserWorkListProps) => {
  const { t } = useTranslation("jobs");
  const { currentUser } = useCurrentUser();
  const [search, setSearch] = React.useState("");
  const { palette } = useColorPalette();
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

  const FILTER_OPTIONS: FilterOption[] = [
    { label: t("management.work.filters.all"), value: "all" },
    { label: t("management.work.filters.inProgress"), value: "in_progress" },
    { label: t("management.work.filters.finished"), value: JobStatus.FINISHED },
  ];

  const filterExpression = React.useMemo(() => {
    if (selectedFilter === "all") return "";
    if (selectedFilter === "in_progress") {
      return `status||$in||Candidate Pending,Not Started,Pending,On Hold,Reviewed By Worker,Reviewed By Worker & Client`;
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
      return (
        <JobManagementCard
          job={item}
          perspective="worker"
          onLongPress={setPreviewJob}
        />
      );
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
          title={t("management.work.listTitle")}
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
              placeholder={t("management.work.searchPlaceholder")}
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
            <RefreshControl 
              refreshing={isRefetching} 
              onRefresh={refetch} 
              progressViewOffset={searchBarHeight}
              tintColor={palette.primary}
              colors={[palette.primary]}
            />
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
                      ? t("management.work.emptyFilteredTitle")
                      : t("management.work.emptyTitle")}
                  </Text>
                  <Text className="text-sm text-muted-foreground text-center max-w-[240px]">
                    {search || selectedFilter !== "all"
                      ? t("management.work.emptyFilteredSubtitle")
                      : t("management.work.emptySubtitle")}
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
        perspective="worker"
        onClose={() => setPreviewJob(null)}
      />
    </StableSafeAreaView>
  );
};
