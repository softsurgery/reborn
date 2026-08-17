import React from "react";
import { ResponseJobSaveDto } from "~/types";
import { LegendList } from "@legendapp/list";
import { cn } from "~/lib/utils";
import { RefreshControl, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useInfiniteSavedJobs } from "~/hooks/content/job/useInfiniteSavedJobs";
import { JobCard } from "../../jobs/JobCard";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { useColorPalette } from "@/hooks/useColorPalette";
import { ChevronLeft, Search } from "lucide-react-native";
import { router } from "expo-router";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { JobCardSkeleton } from "@/components/jobs/JobCardSkeleton";
import { MarkedInput } from "~/components/shared/MarkedInput";
import { useDebounce } from "~/hooks/useDebounce";

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
            icon: ChevronLeft,
            onPress: () => router.back(),
          },
        ]}
      />
      <View className={cn("flex-1 bg-background")}>
        <View className="px-4 pt-4 pb-2">
          <MarkedInput
            icon={Search}
            placeholder="Search saved jobs..."
            value={searchValue}
            onChangeText={setSearchValue}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
        <LegendList
          data={flattenedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          recycleItems={true}
          maintainVisibleContentPosition
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
              {isFetchingNextPage ? (
                <JobCardSkeleton />
              ) : flattenedData.length > 0 && !hasNextPage ? (
                <View className="flex-row items-center justify-center gap-2 py-8">
                  <Text className="text-sm text-muted-foreground">
                    You're all caught up
                  </Text>
                </View>
              ) : null}
            </View>
          }
        />
      </View>
    </StableSafeAreaView>
  );
};
