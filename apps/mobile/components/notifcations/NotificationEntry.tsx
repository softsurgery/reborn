import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { Image } from "@/components/ui/image";
import { cn } from "~/lib/utils";
import {
  NotificationType,
  ResponseNotificationDto,
} from "~/types/notifications";
import { HTMLText } from "../shared/HTMLText";
import { Text } from "../ui/text";
import { timeAgo } from "~/lib/dates.utils";
import { useNotificationPicture } from "~/hooks/content/notifications/useNotificationPicture";
import { router } from "expo-router";

interface NotificationEntryProps {
  className?: string;
  notification: ResponseNotificationDto;
  isUnread?: boolean;
}

export const NotificationEntry = ({
  className,
  notification,
  isUnread: isUnreadProp,
}: NotificationEntryProps) => {
  const { t } = useTranslation("notifications");
  const onPress = () => {
    switch (notification.type) {
      case NotificationType.NEW_FOLLOWER:
        router.push({
          pathname: "/main/account/inspect-profile",
          params: {
            id: String(notification.payload.userId),
          },
        });
        break;
      case NotificationType.NEW_SIGNIN:
        router.push("/main/account/inspect-profile");
        break;
      case NotificationType.NEW_MESSAGE:
        break;
      case NotificationType.NEW_JOB_REQUEST:
        break;
      case NotificationType.JOB_REQUEST_APPROVED:
        break;
      case NotificationType.JOB_REQUEST_REJECTED:
        break;
      case NotificationType.TEST:
        break;
    }
  };

  const { source: pictureSource } = useNotificationPicture(notification);
  const isUnread = isUnreadProp ?? !notification.readAt;

  return (
    <Pressable
      className={cn(
        "flex flex-row items-center gap-2 px-2 py-1 rounded-xl active:opacity-70",
        isUnread ? "bg-primary/10" : "bg-transparent",
        className,
      )}
      onPress={onPress}
    >
      <Image className="w-16 h-16 rounded-full" source={pictureSource} />
      <View className="relative flex flex-col gap-2 px-2 py-1 flex-1">
        <HTMLText
          variant="large"
          className={isUnread ? "text-primary font-bold" : undefined}
        >
          {t(`titles.${notification.type}`)}
        </HTMLText>
        <HTMLText
          variant="muted"
          className={cn("-mt-2", isUnread && "text-foreground font-medium")}
        >
          {t(
            `descriptions.${notification.type}`,
            notification.payload,
          ).toString()}
        </HTMLText>
        <Text variant={"muted"} className="ml-auto">
          {timeAgo(notification.createdAt)}
        </Text>
        {isUnread && (
          <View className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-primary" />
        )}
        {/* <Text className="text-xs">{JSON.stringify(notification.payload)}</Text> */}
      </View>
    </Pressable>
  );
};
