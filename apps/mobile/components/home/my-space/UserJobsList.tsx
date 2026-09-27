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
import { useColorPalette } from "@/hooks/useColorPalette";
import { JobCreateActionBanner } from "./JobCreateActionBanner";
import { MyJobPreviewModal } from "@/components/jobs/job-management/MyJobPreviewModal";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";

interface UserJobsListProps {
  className?: string;
  searching?: boolean;
}

interface FilterOption {
  labelKey:
    | "userJobs.filters.all"
    | "userJobs.filters.published"
    | "userJobs.filters.drafts"
    | "userJobs.filters.inProgress"
    | "userJobs.filters.finished";
  value: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { labelKey: "userJobs.filters.all", value: "all" },
  { labelKey: "userJobs.filters.published", value: JobStatus.POSTED },
  { labelKey: "userJobs.filters.drafts", value: JobStatus.DRAFT },
  { labelKey: "userJobs.filters.inProgress", value: "in_progress" },
  { labelKey: "userJobs.filters.finished", value: JobStatus.FINISHED },
];

export const UserJobsList = ({
  className,
  searching = false,
}: UserJobsListProps) => {
  const { t } = useTranslation("home");
  const isRTL = useRTL();
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
          title={t("userJobs.title")}
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
              placeholder={t("userJobs.searchPlaceholder")}
              enableClear
              reverseIcon={isRTL}
            />
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
            contentContainerStyle={{ gap: 8 }}
          >
            {FILTER_OPTIONS.map((filter) => {
              const isActive = selectedFilter === filter.value;
              return (
                <TouchableOpacity
                  key={filter.value}
                  activeOpacity={0.7}
                  onPress={() => setSelectedFilter(filter.value)}
                  style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
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
                    {t(filter.labelKey)}
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
          ItemSeparatorComponent={() => <Separator className="mt-4" />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          recycleItems={true}
          maintainVisibleContentPosition
          scrollEnabled={!isPreviewing}
          ListHeaderComponent={
            <JobCreateActionBanner
              className="pt-6"
              searchBarHeight={searchBarHeight}
              setBannerHeight={setBannerHeight}
            />
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
                      ? t("userJobs.empty.noResultsTitle")
                      : t("userJobs.empty.noJobsTitle")}
                  </Text>
                  <Text className="text-sm text-muted-foreground text-center max-w-[240px]">
                    {search || selectedFilter !== "all"
                      ? t("userJobs.empty.noResultsSubtitle")
                      : t("userJobs.empty.noJobsSubtitle")}
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
