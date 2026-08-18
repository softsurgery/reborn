import React from "react";
import { ResponseJobSaveDto } from "~/types";
import { LegendList } from "@legendapp/list";
import Animated from "react-native-reanimated";

const AnimatedLegendList = Animated.createAnimatedComponent(
  LegendList,
) as typeof LegendList;

import { cn } from "~/lib/utils";
import { RefreshControl, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useInfiniteSavedJobs } from "~/hooks/content/job/useInfiniteSavedJobs";
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
  | { type: "item"; item: ResponseJobSaveDto; id: string };

interface JobSavedListProps {
  className?: string;
}

export const JobSavedList = ({ className }: JobSavedListProps) => {
  const { palette } = useColorPalette();
  const [searchValue, setSearchValue] = React.useState("");
  const { value: search, loading: searching } = useDebounce(searchValue, 300);

  const {
    savedJobs,
    isSavedJobsPending,
    refetchSavedJobs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteSavedJobs({ search });

  const isPending = isSavedJobsPending || searching;

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
    const grouped: Record<string, ResponseJobSaveDto[]> = {};

    savedJobs.forEach((savedJob) => {
      const date = parseISO(new Date(savedJob.createdAt).toISOString());

      let title = format(date, "MMMM d, yyyy");

      if (isToday(date)) {
        title = "Today";
      } else if (isYesterday(date)) {
        title = "Yesterday";
      }

      if (!grouped[title]) {
        grouped[title] = [];
      }

      grouped[title].push(savedJob);
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
  }, [savedJobs]);

  const [dragging, setDragging] = React.useState(false);

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        title="Saved"
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
            placeholder="Search saved jobs..."
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
              onRefresh={refetchSavedJobs}
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
                  You haven't saved any jobs yet
                </Text>
              </View>
            )
          }
          ListFooterComponent={
            <View className="items-center">
              {isFetchingNextPage && <JobCardSkeleton />}
            </View>
          }
        />
      </View>
    </StableSafeAreaView>
  );
};
