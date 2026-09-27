import { useColorPalette } from "@/hooks/useColorPalette";
import React from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { LegendList } from "@legendapp/list";
import { router, useFocusEffect } from "expo-router";
import { Search, Bell } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, RefreshControl, View } from "react-native";
import { cn } from "~/lib/utils";
import { ResponseConversationDto } from "~/types";
import { ApplicationHeader } from "../shared/AppHeader";
import { UserEntry } from "./UserEntry";
import { MarkedInput } from "../shared/MarkedInput";
import { Separator } from "../ui/separator";
import { useChat } from "@/hooks/content/chat/useChat";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { StableSafeAreaView } from "../shared/stables/StableSafeAreaView";
import { NotFound } from "../shared/lotties/NotFound";
import { UserEntrySkeleton } from "./UserEntrySkeleton";
import { CONVERSATION_LIST_JOIN } from "@/lib/chat/chat";
import { ConversationPreviewModal } from "./ConversationPreviewModal";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { InfiniteListFooter } from "@/components/shared/InfiniteListFooter";
interface ChatPortalProps {
  className?: string;
}

/**
 * Main chat portal component rendering the search input and virtualized list of active conversations.
 */
export const ChatPortal = ({ className }: ChatPortalProps) => {
  const { palette } = useColorPalette();
  const { t } = useTranslation("chat");
  const [searchQuery, setSearchQuery] = React.useState("");
  const { value: debouncedSearchQuery } = useDebounce(searchQuery, 500);

  const { currentUser } = useCurrentUser();
  const { count } = useNotificationContext();

  const [previewConversation, setPreviewConversation] =
    React.useState<ResponseConversationDto | null>(null);

  const isPreviewing = !!previewConversation;

  const animatedBlurStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isPreviewing ? 0.35 : 1, {
        duration: 250,
      }),
    };
  }, [isPreviewing]);

  const {
    conversations,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isRefetching,
    fetchNextPage,
    refetch,
    seeConversation,
  } = useChat({
    search: debouncedSearchQuery,
    join: CONVERSATION_LIST_JOIN,
    enabled: !!currentUser,
  });

  /**
   * Renders a single conversation list row item with navigation onPress callback.
   */
  const renderItem = React.useCallback(
    ({ item }: { item: ResponseConversationDto }) => {
      const participant = item.participants.find(
        (p) => p.userId !== currentUser?.id,
      );
      const user = participant?.user;

      if (!user) return null;
      return (
        <Pressable
          className="flex flex-col gap-4 active:opacity-50"
          onPress={() => {
            router.push({
              pathname: "/main/chat/conversation",
              params: {
                id: String(item.id),
                userId: user.id,
                identifier: identifyUser(user),
                pictureId: user.pictureId ? String(user.pictureId) : "",
                avatarFallback: identifyUserAvatar(user),
              },
            });
            seeConversation(item.id);
          }}
          onLongPress={() => {
            setPreviewConversation(item);
          }}
          delayLongPress={300}
        >
          <UserEntry className="py-2 px-5" conversation={item} />
        </Pressable>
      );
    },
    [currentUser?.id, seeConversation],
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setSearchQuery("");
      };
    }, []),
  );

  return (
    <StableSafeAreaView className={cn("flex flex-1 flex-col", className)}>
      <Animated.View
        pointerEvents={isPreviewing ? "none" : "auto"}
        style={animatedBlurStyle}
      >
        <ApplicationHeader
          title={t("chat.title")}
          shortcuts={[
            {
              key: "notifications",
              icon: Bell,
              onPress: () => {
                router.push("/main/notifications");
              },
              badgeText: count > 0 ? `${count}` : undefined,
            },
          ]}
        />
      </Animated.View>

      <Animated.View
        pointerEvents={isPreviewing ? "none" : "auto"}
        className="flex-1 bg-background"
        style={animatedBlurStyle}
      >
        {/* Search Bar */}
        <MarkedInput
          icon={Search}
          placeholder={t("chat.searchPlaceholder")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          editable={!isPending && conversations?.length > 0}
          className="m-4"
        />
        <Separator />
        {/* Manual Tabs */}
        <View className="flex-1">
          <LegendList
            style={{ flex: 1, paddingBlock: 12 }}
            data={conversations}
            renderItem={renderItem}
            recycleItems={true}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                progressViewOffset={0}
                enabled={true}
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
            contentContainerStyle={{
              paddingHorizontal: 0,
              paddingBottom: 24,
              flexGrow: 1,
            }}
            ListEmptyComponent={
              isPending ? (
                <View className="items-center w-full">
                  <UserEntrySkeleton className="py-2" />
                  <UserEntrySkeleton className="py-2" />
                  <UserEntrySkeleton className="py-2" />
                  <UserEntrySkeleton className="py-2" />
                  <UserEntrySkeleton className="py-2" />
                  <UserEntrySkeleton className="py-2" />
                </View>
              ) : (
                <View className="flex flex-col flex-1">
                  <NotFound
                    className="justify-center items-center"
                    message={[
                      t("chat.empty.noConversations"),
                      t("chat.empty.startNew"),
                    ]}
                  />
                </View>
              )
            }
            ListFooterComponent={
              <InfiniteListFooter
                isPending={isFetchingNextPage}
                hasNextPage={!!hasNextPage}
                dataLength={conversations?.length ?? 0}
                endMessage={""}
                loadingComponent={
                  <View className="items-center mb-8 w-full mt-2">
                    <UserEntrySkeleton className="py-2" />
                  </View>
                }
              />
            }
          />
        </View>
      </Animated.View>
      <ConversationPreviewModal
        visible={!!previewConversation}
        conversation={previewConversation}
        onClose={() => setPreviewConversation(null)}
      />
    </StableSafeAreaView>
  );
};
