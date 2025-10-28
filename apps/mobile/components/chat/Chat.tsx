import React from "react";
import { RefreshControl, View } from "react-native";
import { Text } from "../ui/text";
import { Separator } from "../ui/separator";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { UserEntry } from "./UserEntry";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { api } from "~/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ResponseConversationDto } from "~/types";
import { useDebounce } from "~/hooks/useDebounce";
import { LegendList } from "@legendapp/list";
import { cn } from "~/lib/utils";
import { Loader } from "../shared/Loader";
import { useConversationMessages } from "~/hooks/content/chat/useConversationMessages";
import { format } from "date-fns";
import { StablePressable } from "../shared/StablePressable";
import { ApplicationHeader } from "../shared/AppHeader";
import { Bell, User } from "lucide-react-native";
import { useNotificationContext } from "~/contexts/NotificationContext";

interface ChatProps {
  className?: string;
}

export const Chat = ({ className }: ChatProps) => {
  const navigation = useNavigation<NavigationProps>();
  const { newCount, resetCount } = useNotificationContext();

  const { currentUser } = useCurrentUser();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending: isConversationsPending,
  } = useInfiniteQuery({
    queryKey: ["conversations"],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      api.chat.conversation.findPaginatedUserConversations({
        page: String(pageParam),
        limit: "5",
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const conversations = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const isPending = isConversationsPending || isFetchingNextPage;

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseConversationDto }) => {
      const { messages } = useConversationMessages({
        id: item.id,
        query: {
          limit: "1",
          sort: "createdAt,desc",
        },
      });

      return (
        <StablePressable
          key={new Date().getTime()}
          className="flex flex-col gap-4 py-2"
          onPress={() =>
            navigation.navigate("chat/conversation", { id: item.id })
          }
        >
          <UserEntry
            user={
              item.participants.find((user) => user.id !== currentUser?.id)!
            }
            lastMessage={messages?.length > 0 ? messages[0].content : ""}
            sentAt={
              messages.length > 0
                ? format(messages[0].createdAt, "hh:mm a")
                : ""
            }
          />
        </StablePressable>
      );
    },
    []
  );

  const [dragging, setDragging] = React.useState(false);
  const { value: debouncedDragging, loading: isDragging } = useDebounce(
    dragging,
    1000
  );

  return (
    <StableSafeAreaView className={cn("flex flex-1 mx-2", className)}>
      <ApplicationHeader
        title="Messages"
        shortcuts={[
          {
            icon: User,
            onPress: () => navigation.navigate("my-space/index", {}),
          },
          {
            icon: Bell,
            onPress: () => {
              navigation.navigate("notifications", { reset: false });
              resetCount();
            },
            badgeText: newCount > 0 ? `${newCount}` : undefined,
          },
        ]}
      />
      <View className="px-4"></View>

      <View className="flex-1 mx-2">
        {/* Manual Tabs */}

        <View className="flex-1">
          <View className="flex flex-col gap-2">
            <Text className="text-sm">Recent Messages</Text>
          </View>

          <Separator className="mt-2" />
          <LegendList
            className={cn("flex-1")}
            data={conversations}
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
                  <Text className="text-muted-foreground">
                    No conversations available
                  </Text>
                </View>
              ) : null
            }
            ListFooterComponent={
              <View className="items-center">
                {isPending ? (
                  <Loader isPending />
                ) : hasNextPage ? null : (
                  <View className="flex flex-row items-center justify-center gap-2 p-6">
                    <Text className="text-muted-foreground text-lg font-thin">
                      No more conversations
                    </Text>
                  </View>
                )}
              </View>
            }
          />
        </View>
      </View>
    </StableSafeAreaView>
  );
};
