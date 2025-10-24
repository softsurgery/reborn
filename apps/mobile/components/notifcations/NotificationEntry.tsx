import { View } from "react-native";
import { ResponseNotificationDto } from "~/types/notifications";
import { Text } from "../ui/text";
import { useTranslation } from "react-i18next";
import { timeAgo } from "~/lib/dates.utils";
import { cn } from "~/lib/utils";

interface NotificationEntryProps {
  className?: string;
  notification: ResponseNotificationDto;
}

export const NotificationEntry = ({
  className,
  notification,
}: NotificationEntryProps) => {
  const { t } = useTranslation("notifications");
  return (
    <View className={cn("flex flex-col gap-2 px-2 py-1", className)}>
      <Text variant={"large"}>{t(`titles.${notification.type}`)}</Text>
      <Text className="text-xs text-muted-foreground">
        {t(`descriptions.${notification.type}`)}
      </Text>
      <Text
        variant={"small"}
        className="text-xs text-muted-foreground mt-1 ml-auto"
      >
        {timeAgo(new Date(notification.createdAt))}
      </Text>
    </View>
  );
};
