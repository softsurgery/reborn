import React from "react";
import {
  View,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { LegendList } from "@legendapp/list";
import { useInfiniteJobs } from "@/hooks/content/job/useInfiniteJobs";
import { ResponseJobDto, ResponseUserDto } from "@/types";
import { JobCard } from "@/components/jobs/JobCard";
import { Loader } from "@/components/shared/lotties/Loader";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Briefcase } from "lucide-react-native";
import { cn } from "@/lib/utils";

interface JobsTabProps {
  className?: string;
  user: ResponseUserDto | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const JobsTab = ({
  className,
  user,
  onRefresh,
  refreshing,
  onScroll,
}: JobsTabProps) => {
  const filterExpression = React.useMemo(() => {
    if (!user?.id) return "";
    return `postedById||$eq||${user.id}`;
  }, [user?.id]);

  const {
    jobs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isJobsPending,
  } = useInfiniteJobs({
    filter: filterExpression,
    enabled: !!user?.id,
    limit: 10,
    join: ["uploads"],
  });

  const renderItem = React.useCallback(({ item }: { item: ResponseJobDto }) => {
    return <JobCard job={item} className="mb-3 px-4" redundantUser />;
  }, []);

  if (isJobsPending && !jobs.length) {
    return (
      <View className="py-16 items-center justify-center">
        <Loader />
      </View>
    );
  }

  return (
    <LegendList
      className={cn("flex-1", className)}
      contentContainerStyle={{ paddingTop: 20 }}
      onScroll={onScroll}
      data={jobs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      recycleItems={true}
      maintainVisibleContentPosition
      refreshControl={
        <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
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
        <View className="flex-col items-center justify-center py-12 px-6 gap-4 border border-dashed border-border rounded-2xl mt-2 mx-4">
          <View className="w-14 h-14 rounded-full bg-muted items-center justify-center">
            <Icon as={Briefcase} size={26} className="text-muted-foreground" />
          </View>
          <View className="items-center gap-1">
            <Text className="text-base font-semibold text-foreground text-center">
              No jobs posted yet
            </Text>
            <Text className="text-xs text-muted-foreground text-center max-w-[240px]">
              This user hasn't posted any jobs yet.
            </Text>
          </View>
        </View>
      }
    />
  );
};
