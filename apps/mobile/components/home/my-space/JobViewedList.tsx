import React from "react";
import { ResponseJobViewDto } from "~/types";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import { InfiniteListFooter } from "@/components/shared/InfiniteListFooter";
import Animated from "react-native-reanimated";
import { cn } from "~/lib/utils";
import { RefreshControl, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useInfiniteViewedJobs } from "~/hooks/content/job/useInfiniteViewedJobs";
import { JobCard } from "../../jobs/JobCard";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { useColorPalette } from "@/hooks/useColorPalette";
import { Search } from "lucide-react-native";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { JobCardSkeleton } from "@/components/jobs/JobCardSkeleton";
import { MarkedInput } from "~/components/shared/MarkedInput";
import { useDebounce } from "~/hooks/useDebounce";
import { AppHeaderBack } from "@/components/shared/AppHeaderBack";
import { useStickyElement } from "@/hooks/useStickyElement";

type FlattenedItem =
  | { type: "header"; title: string; id: string }
  | { type: "item"; item: ResponseJobViewDto; id: string };

interface JobViewedListProps {
  className?: string;
}

export const JobViewedList = ({ className }: JobViewedListProps) => {
  const { palette } = useColorPalette();
  const [searchValue, setSearchValue] = React.useState("");
  const { value: search, loading: searching } = useDebounce(searchValue, 300);

  const {
    viewedJobs,
    isViewedJobsPending,
    refetchViewedJobs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteViewedJobs({ search });

  const isPending = isViewedJobsPending || searching;

  const [searchBarHeight, setSearchBarHeight] = React.useState(70);
  const { handleScroll, stickyHeaderStyle } = useStickyElement(0);

  const renderItem = React.useCallback(({ item }: { item: FlattenedItem }) => {
    if (item.type === "header") {
      return (
        <Text className="mb-2.5 mt-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {item.title}
        </Text>
      );
    }

    if (item.item.job) {
      return <JobCard className="mb-3" job={item.item.job} />;
    }
    return null;
  }, []);

  const flattenedData = React.useMemo<FlattenedItem[]>(() => {
    const grouped: Record<string, ResponseJobViewDto[]> = {};

    viewedJobs.forEach((viewedJob) => {
      // Use updatedAt because a user might view the job again, updating the timestamp
      const date = parseISO(
        new Date(viewedJob.updatedAt || viewedJob.createdAt).toISOString(),
      );

      let title = format(date, "MMMM d, yyyy");

      if (isToday(date)) {
        title = "Today";
      } else if (isYesterday(date)) {
        title = "Yesterday";
      }

      if (!grouped[title]) {
        grouped[title] = [];
      }

      grouped[title].push(viewedJob);
    });

    const flattened: FlattenedItem[] = [];
    Object.entries(grouped).forEach(([title, data]) => {
      flattened.push({ type: "header", title, id: `header-${title}` });
      data.forEach((item) => {
        flattened.push({
          type: "item",
          item,
          id: `item-${item.id}`,
        });
      });
    });

    return flattened;
  }, [viewedJobs]);

  const [dragging, setDragging] = React.useState(false);

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        title="Viewed"
        classNames={{
          wrapper: "border-b border-border pb-2 bg bg-transparent",
        }}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
      />
      <View className={cn("flex-1 bg-background px-3 relative")}>
        <Animated.View
          className="absolute left-0 right-0 z-20 bg-background/90 px-3 pt-4 pb-2"
          style={stickyHeaderStyle}
          onLayout={(e) => setSearchBarHeight(e.nativeEvent.layout.height)}
        >
          <MarkedInput
            icon={Search}
            placeholder="Search viewed jobs..."
            value={searchValue}
            onChangeText={setSearchValue}
            autoCapitalize="none"
            enableClear
          />
        </Animated.View>

        <AnimatedLegendList
          data={flattenedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          recycleItems={true}
          style={{ paddingVertical: 0 }}
          maintainVisibleContentPosition
          onScroll={handleScroll}
          scrollIndicatorInsets={{ top: searchBarHeight }}
          ListHeaderComponent={<View style={{ height: searchBarHeight }} />}
          onScrollBeginDrag={() => setDragging(true)}
          onScrollEndDrag={() => setDragging(false)}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetchViewedJobs}
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
          ListEmptyComponent={
            isPending ? (
              <View>
                {Array.from({ length: 3 }).map((_, index) => (
                  <JobCardSkeleton key={index} className="mb-3" />
                ))}
              </View>
            ) : (
              <View className="p-6 items-center">
                <Text className="text-muted-foreground">
                  You haven't viewed any jobs yet
                </Text>
              </View>
            )
          }
          ListFooterComponent={
            <InfiniteListFooter
              isPending={isFetchingNextPage}
              hasNextPage={!!hasNextPage}
              dataLength={0}
              showEndMessage={false}
              loadingComponent={<JobCardSkeleton />}
            />
          }
        />
      </View>
    </StableSafeAreaView>
  );
};
