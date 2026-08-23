import { ImageSourcePropType } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ImageSource } from "expo-image";
import { api } from "~/api";
import { useServerImages } from "@/hooks/content/useServerImages";
import { ResponseNotificationDto } from "~/types/notifications";
import {
  getNotificationPictureConfig,
  NotificationPictureConfig,
} from "./notification-picture.config";

const DEFAULT_STATIC_ASSET: ImageSourcePropType = require("@/assets/images/icon.png");

/**
 * Resolves the notification picture based on the configured strategy.
 *
 * Returns:
 * - `source`: The resolved image source (server image or static asset)
 * - `isPending`: Whether a network fetch is still in progress
 */
export function useNotificationPicture(notification: ResponseNotificationDto) {
  const config: NotificationPictureConfig = getNotificationPictureConfig(
    notification.type,
  );

  const payloadPictureId =
    config.strategy === "pictureId"
      ? notification.payload?.[config.payloadKey ?? "pictureId"]
      : undefined;

  const payloadUserId =
    config.strategy === "userId"
      ? notification.payload?.[config.payloadKey ?? "userId"]
      : undefined;

  // Fetch user's pictureId when strategy is "userId"
  const { data: fetchedPictureId, isPending: isUserPending } = useQuery({
    queryKey: ["notification-user-picture", payloadUserId],
    queryFn: async () => {
      if (!payloadUserId) return null;
      try {
        const user = await api.client.findById(payloadUserId);
        return user?.pictureId ?? null;
      } catch {
        return null;
      }
    },
    enabled: config.strategy === "userId" && !!payloadUserId,
  });

  // Determine which pictureId to load from server
  const pictureIdToLoad =
    config.strategy === "pictureId"
      ? payloadPictureId
      : config.strategy === "userId"
        ? fetchedPictureId
        : undefined;

  // Load the server image
  const { uploads, isPending: isUploadsPending } = useServerImages({
    ids: pictureIdToLoad ? [pictureIdToLoad] : [],
    fallbacks: ["?", ""],
    wrapperClassName:
      "border border-border bg-background rounded-full shadow-md",
    size: { width: 100, height: 100 },
  });

  const serverSource: ImageSourcePropType | undefined =
    uploads?.[0] as ImageSourcePropType | undefined;

  // Resolve final source
  if (config.strategy === "static") {
    return {
      source: (config.staticAsset ?? DEFAULT_STATIC_ASSET) as ImageSourcePropType,
      isPending: false,
    };
  }

  return {
    source: (serverSource || config.staticAsset || DEFAULT_STATIC_ASSET) as ImageSourcePropType,
    isPending:
      config.strategy === "userId"
        ? isUserPending || isUploadsPending
        : isUploadsPending,
  };
}
