import {
  NotificationType,
  ResponseNotificationDto,
} from "~/types/notifications";
import { Text } from "../ui/text";
import { useTranslation } from "react-i18next";
import { timeAgo } from "~/lib/dates.utils";
import { cn } from "~/lib/utils";
import { HTMLText } from "../shared/HTMLText";
import { router } from "expo-router";
import { StablePressable } from "../shared/StablePressable";
import { useRTL } from "~/hooks/useRTL";

interface NotificationEntryProps {
  className?: string;
  notification: ResponseNotificationDto;
}

export const NotificationEntry = ({
  className,
  notification,
}: NotificationEntryProps) => {
  const { t } = useTranslation("notifications");
  const isRTL = useRTL();
  const onPress = () => {
    switch (notification.type) {
      case NotificationType.NEW_JOB_REQUEST:
        router.push({
          pathname: "/main/my-space/requests",
        });
        break;
      case NotificationType.JOB_REQUEST_APPROVED:
        router.push({
          pathname: "/main/explore/job-details",
          params: { id: notification.payload.id },
        });
        break;
      case NotificationType.JOB_REQUEST_REJECTED:
        router.push({
          pathname: "/main/explore/job-details",
          params: { id: notification.payload.id },
        });
        break;
    }
  };
  return (
    <StablePressable
      className={cn("flex flex-col px-2 py-1", className)}
      onPress={onPress}
    >
      <HTMLText variant={"large"}>{t(`titles.${notification.type}`)}</HTMLText>
      <HTMLText variant="muted" className="-mt-2 text-right">
        {t(
          `descriptions.${notification.type}`,
          notification.payload
        ).toString()}
      </HTMLText>
      <Text variant={"muted"} className="ml-auto -mt-4">
        {timeAgo(notification.createdAt)}
      </Text>
    </StablePressable>
  );
};
