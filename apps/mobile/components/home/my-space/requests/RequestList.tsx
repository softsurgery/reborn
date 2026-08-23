import React from "react";
import { RefreshControl, View } from "react-native";
import { LegendList } from "@legendapp/list";
import { Inbox, Send, Search } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { ResponseJobRequestDto } from "@/types";
import { IncomingRequestEntry } from "./IncomingRequest";
import { IncomingRequestSkeleton } from "./IncomingRequestSkeleton";
import { OutgoingRequestEntry } from "./OutgoingRequest";
import { OutgoingRequestSkeleton } from "./OutgoingRequestSkeleton";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { MarkedInput } from "@/components/shared/MarkedInput";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteJobRequests } from "@/hooks/content/job/useInfiniteJobRequests";

interface RequestsListProps {
  className?: string;
  variant: "incoming" | "outgoing";
  jobId?: string;
}

export const RequestsList = ({
  className,
  variant,
  jobId,
}: RequestsListProps) => {
  const [searchValue, setSearchValue] = React.useState("");
  const { value: search, loading: searching } = useDebounce(searchValue, 300);
  const [searchBarHeight, setSearchBarHeight] = React.useState(60);

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
  });

  const isInitialPending = isRequestsPending || searching;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobRequestDto }) =>
      variant === "incoming" ? (
        <IncomingRequestEntry
          request={item}
          className="mb-3.5"
          refetchRequests={refetchRequests}
        />
      ) : (
        <OutgoingRequestEntry
          request={item}
          className="mb-3.5"
          refetchRequests={refetchRequests}
        />
      ),
    [variant, refetchRequests],
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
      {/* Sticky Search Header matching UserJobsList */}
      <View
        className="absolute left-0 right-0 z-20 bg-background/90 py-3 flex flex-col justify-center"
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
      </View>

      <LegendList
        className={cn("flex-1", className)}
        contentContainerStyle={{ paddingTop: searchBarHeight + 4 }}
        data={isInitialPending ? [] : requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        recycleItems={true}
        maintainVisibleContentPosition
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
          <View className="items-center w-full pb-8">
            {isInitialPending ? (
              <View className="w-full gap-3.5">
                {[...Array(3)].map((_, idx) => (
                  <SkeletonComponent key={idx} />
                ))}
              </View>
            ) : isFetchingNextPage ? (
              <View className="py-4">
                <SkeletonComponent />
              </View>
            ) : null}
          </View>
        }
      />
    </View>
  );
};
