import { LegendList } from "@legendapp/list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigation } from "expo-router";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react-native";
import React from "react";
import { RefreshControl, View } from "react-native";
import { api } from "~/api";
import { Loader } from "~/components/shared/Loader";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { useDebounce } from "~/hooks/useDebounce";
import Icon from "~/lib/Icon";
import { identifyUser } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { JobRequestStatus, ResponseJobRequestDto } from "~/types";
import { NavigationProps } from "~/types/app.routes";

type TabType = "incoming" | "outgoing";

interface RequestsProps {
  className?: string;
  initialTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const Requests = ({
  className,
  initialTab = "incoming",
  onTabChange,
}: RequestsProps) => {
  const [tab, setTab] = React.useState<TabType>(initialTab);
  const [search, setSearch] = React.useState("");

  // Memoized tab change handler
  const handleTabChange = React.useCallback(
    (newTab: TabType) => {
      setTab(newTab);
      onTabChange?.(newTab);
    },
    [onTabChange]
  );

  // Memoized tab button renderer
  const renderTabButton = React.useCallback(
    (tabKey: TabType, label: string, icon: LucideIcon) => (
      <StablePressable
        key={tabKey}
        onPress={() => handleTabChange(tabKey)}
        className={cn(
          "h-12 flex-1 flex items-center justify-center",
          tab === tabKey ? "border-b-2 border-b-primary" : ""
        )}
      >
        <View className="flex flex-row items-center gap-2">
          <Text
            className={cn(
              "font-medium",
              tab === tabKey ? "text-primary" : "text-muted-foreground"
            )}
          >
            {label}
          </Text>
          <Icon
            name={icon}
            size={24}
            className={cn(
              "font-medium",
              tab === tabKey ? "text-primary" : "text-muted-foreground"
            )}
          />
        </View>
      </StablePressable>
    ),
    [tab, handleTabChange]
  );
  return (
    <View className="flex flex-1">
      <View className="flex flex-row border-b border-border">
        {renderTabButton("incoming", "Incoming", ArrowDown)}
        {renderTabButton("outgoing", "Outgoing", ArrowUp)}
      </View>
      <View className="flex-1 p-4">
        <RequestsList
          search=""
          searching={false}
          variant={tab as "incoming" | "ongoing"}
        />
      </View>
    </View>
  );
};

interface IncomingRequestEntryProps {
  className?: string;
  request: ResponseJobRequestDto;
}

export const IncomingRequestEntry = ({
  className,
  request,
}: IncomingRequestEntryProps) => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <StablePressable
      className={cn("p-4 m border border-border rounded-lg", className)}
      onPress={() => {
        navigation.navigate("explore/job-details", {
          id: request.job?.id,
          uploads: request.job?.uploads?.map((upload) => upload.uploadId) ?? [],
        });
      }}
    >
      <Text>{request.job?.title}</Text>
      <Text>{identifyUser(request.job?.postedBy)}</Text>
      <Text className="text-muted-foreground font-thin">
        {request.createdAt
          ? format(request.createdAt, "hh:mm dd MMMM yyyy")
          : ""}
      </Text>
      <View>
        <Text
          className={cn(
            "text-sm font-medium",
            request.status === JobRequestStatus.Approved
              ? "text-green-500"
              : request.status === JobRequestStatus.Rejected
              ? "text-red-500"
              : request.status === JobRequestStatus.Pending
              ? "text-secondary-foreground"
              : ""
          )}
        >
          {request.status === JobRequestStatus.Pending
            ? "Pending"
            : request.status === JobRequestStatus.Approved
            ? "Approved"
            : "Rejected"}
        </Text>
      </View>
    </StablePressable>
  );
};

interface OngoingRequestEntryProps {
  className?: string;
  request: ResponseJobRequestDto;
}

export const OngoingRequestEntry = ({
  className,
  request,
}: OngoingRequestEntryProps) => {
  return (
    <View>
      <Text>{identifyUser(request.user)}</Text>
    </View>
  );
};

interface RequestsListProps {
  className?: string;
  variant: "incoming" | "ongoing";
  search: string;
  searching: boolean;
}

export const RequestsList = ({
  className,
  search,
  searching,
}: RequestsListProps) => {
  const { currentUser } = useCurrentUser();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending: isRequestsPending,
  } = useInfiniteQuery({
    queryKey: ["requests", search],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      api.jobRequest.findPaginated({
        page: String(pageParam),
        limit: "20",
        filter: `userId||$eq||${currentUser?.id}`,
        sort: "createdAt,desc",
        join: "job.postedBy,job.uploads",
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const requests = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  console.log(JSON.stringify(requests, null, 2));

  const isPending =
    isRequestsPending || isRefetching || isFetchingNextPage || searching;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobRequestDto }) => (
      <IncomingRequestEntry request={item} className="mb-4" />
    ),
    []
  );

  const [dragging, setDragging] = React.useState(false);
  const { value: debouncedDragging, loading: isDragging } = useDebounce(
    dragging,
    1000
  );

  return (
    <LegendList
      className={cn("flex-1", className)}
      data={requests}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      recycleItems={true}
      maintainVisibleContentPosition
      onScrollBeginDrag={() => setDragging(true)}
      onScrollEndDrag={() => setDragging(false)}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor="transparent"
          colors={["transparent"]}
        />
      }
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <Loader
          size="small"
          isPending={isRefetching || debouncedDragging || isDragging}
          className="flex items-center h-fit"
        />
      }
      ListEmptyComponent={
        !isPending ? (
          <View className="p-6 items-center">
            <Text className="text-muted-foreground">No requests available</Text>
          </View>
        ) : null
      }
      ListFooterComponent={
        <View className="items-center">
          {isPending ? (
            <Text>Skeleton</Text>
          ) : hasNextPage ? null : (
            <View className="flex flex-row items-center justify-center gap-2 p-6"></View>
          )}
        </View>
      }
    />
  );
};
