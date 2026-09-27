import React from "react";
import { Modal, Pressable, View, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { X, Search, Ban, Trash2, MessageCircle, AlertTriangle } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useServerImages } from "@/hooks/content/useServerImages";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ResponseConversationDto, ServerErrorResponse } from "@/types";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner-native";
import { removeConversationFromPages } from "@/lib/chat/chat";
import { useChatContext } from "@/contexts/ChatContext";
import { DeleteConversationActionSheet } from "./details/DeleteConversationActionSheet";
import { BlockUserActionSheet } from "./details/BlockUserActionSheet";
import { ActionSheetRef } from "react-native-actions-sheet";

interface ConversationPreviewModalProps {
  visible: boolean;
  conversation: ResponseConversationDto | null;
  onClose: () => void;
}

export const ConversationPreviewModal = ({
  visible,
  conversation,
  onClose,
}: ConversationPreviewModalProps) => {
  const { palette } = useColorPalette();
  const { t } = useTranslation("chat");
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const { resetCount } = useChatContext();

  const user = React.useMemo(() => {
    if (!conversation || !currentUser) return null;
    return conversation.participants.find(
      (participant) => participant.userId !== currentUser.id,
    )?.user;
  }, [conversation, currentUser]);

  const identification = identifyUser(user);

  const { jsxArray: profilePictures } = useServerImages({
    ids: [user?.pictureId],
    className: "rounded-full w-24 h-24",
    fallbacks: [identifyUserAvatar(user)],
    size: { width: 96, height: 96 },
  });

  const progress = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  
  const blockSheetRef = React.useRef<ActionSheetRef>(null);
  const deleteSheetRef = React.useRef<ActionSheetRef>(null);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [0.82, 1]),
        },
        {
          translateY: interpolate(progress.value, [0, 1], [35, 0]),
        },
      ],
      opacity: interpolate(progress.value, [0, 0.3, 1], [0, 0.6, 1]),
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  React.useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else {
      progress.value = 0;
      backdropOpacity.value = 0;
    }
  }, [visible]);

  const removeConversationFromCache = React.useCallback(() => {
    if (!conversation) return;
    queryClient.removeQueries({ queryKey: ["conversation", conversation.id] });
    queryClient.removeQueries({
      queryKey: ["conversation-messages", conversation.id],
    });
    queryClient.setQueriesData({ queryKey: ["conversations"] }, (oldData) =>
      removeConversationFromPages(oldData as never, conversation.id),
    );
  }, [conversation, queryClient]);

  const handleConversationActionSuccess = React.useCallback(
    (message: string) => {
      blockSheetRef.current?.hide();
      deleteSheetRef.current?.hide();
      removeConversationFromCache();
      resetCount();
      toast.success(message);
      handleDismiss();
    },
    [removeConversationFromCache, resetCount],
  );

  const handleConversationActionError = React.useCallback(
    (title: string, error: ServerErrorResponse) => {
      blockSheetRef.current?.hide();
      deleteSheetRef.current?.hide();
      toast.error(title, {
        description:
          error.response?.data?.message || t("chat.details.errors.generic"),
      });
    },
    [t],
  );

  const { mutate: deleteConversation, isPending: isDeletePending } =
    useMutation({
      mutationFn: () =>
        api.chat.conversation.deleteConversation(conversation!.id),
      onSuccess: () =>
        handleConversationActionSuccess(
          t("chat.details.toasts.conversationDeleted"),
        ),
      onError: (error: ServerErrorResponse) =>
        handleConversationActionError(
          t("chat.details.errors.deleteFailed"),
          error,
        ),
    });

  const { mutate: blockUser, isPending: isBlockPending } = useMutation({
    mutationFn: () => api.chat.conversation.blockUser(user!.id),
    onSuccess: () =>
      handleConversationActionSuccess(t("chat.details.toasts.userBlocked")),
    onError: (error: ServerErrorResponse) =>
      handleConversationActionError(
        t("chat.details.errors.blockFailed"),
        error,
      ),
  });

  const handleDismiss = (callback?: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    progress.value = withTiming(
      0,
      {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(onClose)();
          if (callback) {
            runOnJS(callback)();
          }
        }
      },
    );
    backdropOpacity.value = withTiming(0, { duration: 200 });
  };

  const handleOpenConversation = () => {
    handleDismiss(() => {
      if (!user || !conversation) return;
      router.push({
        pathname: "/main/chat/conversation",
        params: {
          id: String(conversation.id),
          userId: user.id,
          identifier: identification,
          pictureId: user.pictureId ? String(user.pictureId) : "",
          avatarFallback: identifyUserAvatar(user),
        },
      });
    });
  };

  const handleViewProfile = () => {
    handleDismiss(() => {
      if (!user) return;
      router.push({
        pathname: "/main/account/inspect-profile",
        params: { id: user.id },
      });
    });
  };

  const handleReportUser = () => {
    handleDismiss(() => {
      if (!conversation) return;
      router.push({
        pathname: "/main/chat/report-conversation",
        params: {
          id: String(conversation.id),
          reportedUserName: identification,
        },
      });
    });
  };

  const handleDelete = () => {
    deleteSheetRef.current?.show();
  };

  const handleBlock = () => {
    blockSheetRef.current?.show();
  };

  if (!visible || !conversation) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={() => handleDismiss()}
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View
        style={[animatedBackdropStyle]}
        className="flex-1 bg-black/75 justify-center items-center px-4 py-8"
      >
        <Pressable
          style={{ position: "absolute", inset: 0 }}
          onPress={() => handleDismiss()}
        />

        <Animated.View
          style={[animatedCardStyle]}
          className="w-full max-w-sm flex-col items-center z-10"
        >
          <View className="w-full bg-card border border-border p-6 shadow-2xl overflow-hidden rounded-xl flex-col items-center">
            <View className="absolute right-4 top-4">
              <TouchableOpacity
                onPress={() => handleDismiss()}
                className="p-1.5 rounded-full bg-muted/80"
                hitSlop={8}
              >
                <X size={16} color={palette.foreground} />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              {profilePictures[0]}
            </View>
            <Text className="text-xl font-bold text-foreground text-center">
              {identification}
            </Text>
            {user?.username && (
              <Text className="text-sm text-muted-foreground text-center mt-1">
                @{user.username}
              </Text>
            )}
          </View>

          <View className="w-full bg-card border border-border rounded-2xl mt-3 overflow-hidden shadow-2xl">
            <TouchableOpacity
              onPress={handleOpenConversation}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 active:bg-accent/40"
            >
              <Text className="text-sm font-semibold text-foreground">
                {t("chat.preview.open", { defaultValue: "Open Conversation" })}
              </Text>
              <MessageCircle size={18} color={palette.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleViewProfile}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 active:bg-accent/40"
            >
              <Text className="text-sm font-semibold text-foreground">
                {t("chat.preview.viewProfile", { defaultValue: "View Profile" })}
              </Text>
              <Search size={18} color={palette.foreground} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBlock}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 active:bg-accent/40"
            >
              <Text className="text-sm font-semibold text-foreground">
                {t("chat.details.rows.block")}
              </Text>
              <Ban size={18} color={palette.foreground} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleReportUser}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 active:bg-accent/40"
            >
              <Text className="text-sm font-semibold text-foreground">
                {t("chat.details.rows.report")}
              </Text>
              <AlertTriangle size={18} color={palette.foreground} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="flex-row items-center justify-between px-4 py-3.5 active:bg-destructive/10"
            >
              <Text className="text-sm font-semibold text-destructive">
                {t("chat.details.rows.delete")}
              </Text>
              <Trash2 size={18} color={palette.destructive} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
      <BlockUserActionSheet
        ref={blockSheetRef}
        identification={identification}
        onConfirm={() => blockUser()}
        onClose={() => blockSheetRef.current?.hide()}
        isPending={isBlockPending}
      />
      <DeleteConversationActionSheet
        ref={deleteSheetRef}
        onConfirm={() => deleteConversation()}
        onClose={() => deleteSheetRef.current?.hide()}
        isPending={isDeletePending}
      />
    </Modal>
  );
};
