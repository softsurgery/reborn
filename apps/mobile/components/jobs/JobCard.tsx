import React from "react";
import { cn } from "~/lib/utils";
import { View, TouchableOpacity } from "react-native";
import { Image, ImageSource } from "expo-image";
import {
  Heart,
  ImageOff,
  Pen,
  Settings2,
  Signal,
  MapPin,
} from "lucide-react-native";
import { router } from "expo-router";
import { JobPricingType, ResponseJobDto } from "~/types";
import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { Skeleton } from "../ui/skeleton";
import { timeAgo } from "~/lib/dates.utils";
import { Text } from "../ui/text";
import { useJobSaveActions } from "~/hooks/content/job/useJobSaveActions";
import { useIsJobSaved } from "~/hooks/content/job/useIsJobSaved";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { Badge } from "../ui/badge";
import { useServerImages } from "@/hooks/content/useServerImages";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useRTL } from "@/hooks/useRTL";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../shared/stables/StableAvatar";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";

interface JobCardProps {
  className?: string;
  job: ResponseJobDto;
  redundantUser?: boolean;
  isOwner?: boolean;
  onLongPress?: (job: ResponseJobDto) => void;
}

export const THUMBNAIL_SIZE = 84;

const DEFAULT_CURRENCY = "TND";

interface CurrencyExtras {
  code?: string;
  symbol?: string;
  digitsAfterComma?: number;
}

const readCurrency = (job: ResponseJobDto) => {
  const extras = (job.currency?.extras ?? {}) as CurrencyExtras;
  return {
    code: extras.code || job.currency?.label || DEFAULT_CURRENCY,
    digits: extras.digitsAfterComma ?? 2,
  };
};

export const JobCard = ({
  className,
  job,
  isOwner,
  onLongPress,
  redundantUser,
}: JobCardProps) => {
  const queryClient = useQueryClient();
  const { palette } = useColorPalette();
  const isRTL = useRTL();

  const { isJobSaved, isSavedPending } = useIsJobSaved(job.id);
  const { saveJob, isSavePending, unsaveJob, isUnsavePending } =
    useJobSaveActions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["is-job-saved", job.id] });
      },
    });

  const orderedUploads = React.useMemo(
    () => job.uploads?.slice().sort((a, b) => a.order - b.order),
    [job.uploads],
  );

  const coverId = orderedUploads?.[0]?.uploadId;
  const extraPhotos = Math.max((orderedUploads?.length ?? 0) - 1, 0);

  const { uploads: [upload], isPending: isUploadPending } = useServerImages({
    ids: [coverId],
    enabled: !!coverId,
  });

  const { uploads: [authorPicture] } = useServerImages({
    ids: [job.postedBy?.pictureId],
    enabled: !!job.postedBy?.pictureId,
  });

  React.useEffect(() => {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["job-thumbnail", job.id] });
      queryClient.invalidateQueries({ queryKey: ["is-job-saved", job.id] });
    };
  }, []);

  const isSaveMutating = isSavePending || isUnsavePending;

  const handleSave = (e: any) => {
    e.stopPropagation();
    if (isSaveMutating) return;
    if (isJobSaved) unsaveJob(job.id);
    else saveJob(job.id);
  };

  const { code, digits } = readCurrency(job);
  const isHourly = job.pricingType === JobPricingType.HOURLY;

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/main/explore/job-details",
          params: {
            id: job.id,
            uploads: JSON.stringify((job.uploads ?? []).map((u) => u.uploadId)),
          },
        });
      }}
      onLongPress={() => {
        if (onLongPress) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onLongPress(job);
        }
      }}
      delayLongPress={300}
      className={cn("w-full rounded-lg p-3", className)}
      activeOpacity={0.85}
    >
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 12 }}>
        <View
          style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
          className="overflow-hidden rounded-xl bg-muted"
        >
          {coverId && isUploadPending ? (
            <Skeleton className="h-full w-full" />
          ) : coverId && upload ? (
            <Image
              source={upload as ImageSource}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{ width: "100%", height: "100%" }}
              className="items-center justify-center"
            >
              <ImageOff
                size={18}
                color={palette.mutedForeground}
                opacity={0.4}
              />
            </View>
          )}

          {extraPhotos > 0 && (
            <View
              style={{
                position: "absolute",
                bottom: 4,
                ...(isRTL ? { left: 4 } : { right: 4 }),
              }}
              className="rounded-md bg-black/60 px-1.5 py-0.5"
            >
              <Text
                style={{ fontSize: 10 }}
                className="font-semibold text-white"
              >
                +{extraPhotos}
              </Text>
            </View>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
            }}
          >
            <Text
              numberOfLines={1}
              style={{ flex: 1, fontSize: 10 }}
              className={cn(
                "font-bold uppercase tracking-widest text-primary",
                isRTL ? "text-right" : "text-left",
              )}
            >
              {job.category?.label ?? "Uncategorised"}
            </Text>

            {isOwner ? (
              <Badge variant="secondary" className={isRTL ? "mr-2" : "ml-2"}>
                <Text style={{ fontSize: 10 }}>{job.status}</Text>
              </Badge>
            ) : (
              <TouchableOpacity
                onPress={handleSave}
                hitSlop={12}
                style={isRTL ? { marginRight: 8 } : { marginLeft: 8 }}
              >
                <Heart
                  size={20}
                  color={isJobSaved ? palette.primary : palette.mutedForeground}
                  fill={isJobSaved ? palette.primary : "none"}
                  opacity={isSavedPending ? 0.4 : 1}
                />
              </TouchableOpacity>
            )}
          </View>

          <Text
            numberOfLines={2}
            style={{ marginTop: 2 }}
            className="text-base font-semibold leading-5 tracking-tight"
          >
            {job.title}
          </Text>

          {job.description ? (
            <Text
              numberOfLines={1}
              style={{ marginTop: 2 }}
              className="text-xs leading-4 text-muted-foreground"
            >
              {job.description}
            </Text>
          ) : null}

          <View
            style={{
              marginTop: 6,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "baseline",
              gap: 4,
            }}
          >
            <Text className="text-lg font-bold leading-6 tracking-tight">
              {job.price?.toFixed(digits)}
            </Text>
            <Text className="text-xs font-semibold text-muted-foreground">
              {code}
              {isHourly ? " / hr" : ""}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: 12,
          paddingTop: 10,
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          gap: 6,
        }}
        className="border-t border-border"
      >
        {!redundantUser && (
          <>
            <Avatar
              alt={identifyUser(job.postedBy)}
              style={{ width: 20, height: 20 }}
            >
              {/* Always mounted: AvatarImage is what raises the fallback flag. */}
              <AvatarImage source={authorPicture as ImageSource} />
              <AvatarFallback>
                <Text style={{ fontSize: 9 }} className="font-semibold">
                  {identifyUserAvatar(job.postedBy)}
                </Text>
              </AvatarFallback>
            </Avatar>
            <Text
              numberOfLines={1}
              style={{ flexShrink: 1 }}
              className="text-xs font-medium"
            >
              {identifyUser(job.postedBy)}
            </Text>

            <Text className="text-xs text-muted-foreground">
              · {timeAgo(job?.createdAt || new Date())}
            </Text>
          </>
        )}

        <View
          style={{
            ...(isRTL ? { marginRight: "auto" } : { marginLeft: "auto" }),
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          {job.style ? (
            <View
              className={cn(
                "items-center gap-1 rounded-full bg-muted px-2 py-1",
                isRTL ? "flex-row-reverse" : "flex-row",
              )}
            >
              <MapPin size={10} color={palette.mutedForeground} />
              <Text
                style={{ fontSize: 10 }}
                className="font-medium text-muted-foreground"
              >
                {job.style}
              </Text>
            </View>
          ) : null}

          {job.difficulty ? (
            <View
              className={cn(
                "items-center gap-1 rounded-full bg-muted px-2 py-1",
                isRTL ? "flex-row-reverse" : "flex-row",
              )}
            >
              <Signal size={10} color={palette.mutedForeground} />
              <Text
                style={{ fontSize: 10 }}
                className="font-medium text-muted-foreground"
              >
                {job.difficulty}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {isOwner && (
        <View
          style={{
            marginTop: 8,
            flexDirection: isRTL ? "row-reverse" : "row",
            gap: 12,
          }}
        >
          <Button
            className="flex-1"
            size="sm"
            onPress={() => {
              router.push({
                pathname: "/main/my-space/manage-job",
                params: { id: job.id },
              });
            }}
          >
            <Icon as={Settings2} size={16} />
            <Text>Manage</Text>
          </Button>
          <Button className="flex-1" size="sm" variant="outline">
            <Icon as={Pen} size={16} />
            <Text>Update</Text>
          </Button>
        </View>
      )}
    </TouchableOpacity>
  );
};
