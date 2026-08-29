import React from "react";
import { RefreshControl, View, FlatList } from "react-native";
import Animated from "react-native-reanimated";
import { Inbox, Send, Search } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { ResponseJobRequestDto, JobRequestStatus } from "@/types";
import { IncomingRequestEntry } from "./IncomingRequest";
import { IncomingRequestSkeleton } from "./IncomingRequestSkeleton";
import { OutgoingRequestEntry } from "./OutgoingRequest";
import { OutgoingRequestSkeleton } from "./OutgoingRequestSkeleton";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { MarkedInput } from "@/components/shared/MarkedInput";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteJobRequests } from "@/hooks/content/job/useInfiniteJobRequests";
import { useStickyElement } from "@/hooks/useStickyElement";
import { InfiniteListFooter } from "@/components/shared/InfiniteListFooter";

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList,
) as typeof FlatList;

interface RequestsListProps {
  className?: string;
  variant: "incoming" | "outgoing";
  jobId?: string;
  embedded?: boolean;
  statusFilter?: string;
}

export const RequestsList = ({
  className,
  variant,
  jobId,
  embedded = false,
  statusFilter,
}: RequestsListProps) => {
  const [searchValue, setSearchValue] = React.useState("");
  const { value: search, loading: searching } = useDebounce(searchValue, 300);
  const [searchBarHeight, setSearchBarHeight] = React.useState(60);
  const { handleScroll, stickyHeaderStyle } = useStickyElement(0);

  const {
    requests,
    hasNextPage,
    isRequestsPending,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    refetchRequests,
  } = useInfiniteJobRequests({
    search,
    variant,
    jobId,
    statusFilter,
  });

  const isInitialPending = isRequestsPending || searching;

  const listData = React.useMemo(() => {
    if (!requests || isInitialPending) return [];
    if (embedded && variant === "incoming") {
      const pending = requests.filter(
        (r) => r.status === JobRequestStatus.Pending,
      );
      const waitlist = requests.filter(
        (r) => r.status === JobRequestStatus.Waitlist,
      );
      const combined = [];
      if (pending.length > 0) {
        combined.push({
          type: "header",
          id: "header-pending",
          title: "No Decision",
        });
        combined.push(...pending);
      }
      if (waitlist.length > 0) {
        combined.push({
          type: "header",
          id: "header-waitlist",
          title: "Waitlist",
        });
        combined.push(...waitlist);
      }
      return combined;
    }
    return requests;
  }, [requests, isInitialPending, embedded, variant]);

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobRequestDto | any }) => {
      if (item.type === "header") {
        return (
          <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-2 pb-2 mb-2">
            {item.title}
          </Text>
        );
      }

      return variant === "incoming" ? (
        <IncomingRequestEntry
          request={item}
          embedded={embedded}
          className="mb-6 px-2"
        />
      ) : (
        <OutgoingRequestEntry request={item} className="mb-6 px-2" />
      );
    },
    [variant, refetchRequests, embedded],
  );

  const SkeletonComponent =
    variant === "incoming" ? IncomingRequestSkeleton : OutgoingRequestSkeleton;

  const EmptyIcon = variant === "incoming" ? Inbox : Send;
  const emptyTitle =
    variant === "incoming" ? "No Incoming Requests" : "No Sent Applications";
  const emptySubtitle =
    variant === "incoming"
      ? "Applications from candidates will appear here."
      : "Job applications you've submitted will appear here.";

  return (
    <View className={cn("flex-1 bg-background relative", className)}>
      {/* Animated Sticky Transparent Search Bar */}
      <Animated.View
        className="absolute left-0 right-0 z-20 bg-background/90 py-2.5"
        style={stickyHeaderStyle}
        onLayout={(e) => setSearchBarHeight(e.nativeEvent.layout.height)}
      >
        <MarkedInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder={
            variant === "incoming"
              ? "Search incoming candidates..."
              : "Search sent applications..."
          }
          icon={Search}
          enableClear
        />
      </Animated.View>

      <AnimatedFlatList
        className="flex-1"
        contentContainerStyle={{
          paddingTop: searchBarHeight,
          paddingBottom: 32,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: searchBarHeight }}
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetchRequests}
            tintColor="transparent"
            colors={["transparent"]}
          />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          !isInitialPending ? (
            <View className="py-16 items-center justify-center px-6 text-center">
              <View className="w-16 h-16 rounded-full bg-muted/60 items-center justify-center mb-3">
                <Icon
                  as={EmptyIcon}
                  size={28}
                  className="text-muted-foreground"
                />
              </View>
              <Text className="text-base font-semibold text-foreground mb-1">
                {emptyTitle}
              </Text>
              <Text className="text-xs text-muted-foreground text-center max-w-[260px] leading-relaxed">
                {emptySubtitle}
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <InfiniteListFooter
            isPending={isInitialPending || isFetchingNextPage}
            hasNextPage={!!hasNextPage}
            dataLength={requests?.length || 0}
            loadingCount={isInitialPending ? 3 : 1}
            loadingComponent={
              <View className="w-full mb-3">
                <SkeletonComponent />
              </View>
            }
            showEndMessage={true}
            endMessage=""
            className="pb-8 w-full px-0"
          />
        }
      />
    </View>
  );
};
