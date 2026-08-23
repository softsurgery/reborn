import { ImageSourcePropType } from "react-native";
import { NotificationType } from "~/types/notifications";

/**
 * Defines how the notification picture is resolved.
 *
 * - "pictureId": Use `payload.pictureId` directly to fetch the image from the server.
 * - "userId":    Use `payload.userId` to look up the user's profile picture.
 * - "static":    Use a local asset provided via `staticAsset`.
 */
export type NotificationPictureStrategy = "pictureId" | "userId" | "static";

export interface NotificationPictureConfig {
  strategy: NotificationPictureStrategy;
  /** Required when strategy is "static". The local asset to display. */
  staticAsset?: ImageSourcePropType;
  /**
   * Override the payload key used to extract the value.
   * - For "pictureId" strategy: defaults to "pictureId"
   * - For "userId" strategy: defaults to "userId"
   */
  payloadKey?: string;
}

const DEFAULT_STATIC_ASSET: ImageSourcePropType = require("@/assets/images/icon.png");

/**
 * Per-notification-type picture configuration.
 *
 * Add a case for each NotificationType to control how its picture is resolved.
 * If a type is not listed here, it falls back to the default strategy.
 */
export const NOTIFICATION_PICTURE_CONFIG: Record<
  NotificationType,
  NotificationPictureConfig
> = {
  [NotificationType.NEW_FOLLOWER]: {
    strategy: "userId",
  },
  [NotificationType.NEW_SIGNIN]: {
    strategy: "static",
    staticAsset: DEFAULT_STATIC_ASSET,
  },
  [NotificationType.NEW_MESSAGE]: {
    strategy: "pictureId",
  },
  [NotificationType.NEW_JOB_REQUEST]: {
    strategy: "userId",
    payloadKey: "requesterId",
  },
  [NotificationType.JOB_REQUEST_APPROVED]: {
    strategy: "userId",
    payloadKey: "requesterId",
  },
  [NotificationType.JOB_REQUEST_REJECTED]: {
    strategy: "userId",
    payloadKey: "requesterId",
  },
  [NotificationType.TEST]: {
    strategy: "static",
    staticAsset: DEFAULT_STATIC_ASSET,
  },
};

/**
 * Resolves the picture config for a given notification type.
 * Falls back to the "static" strategy with the default asset.
 */
export function getNotificationPictureConfig(
  type: NotificationType,
): NotificationPictureConfig {
  return (
    NOTIFICATION_PICTURE_CONFIG[type] ?? {
      strategy: "static" as const,
      staticAsset: DEFAULT_STATIC_ASSET,
    }
  );
}
